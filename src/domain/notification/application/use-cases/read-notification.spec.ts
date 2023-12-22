import { makeNotification } from "test/factories/make-notification";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { ReadNotificationUseCase } from "./read-notification";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: ReadNotificationUseCase;

describe("Read notification", () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
  });

  it("should be able to read a notification", async () => {
    const recipient = makeRecipient();
    const notification = makeNotification({
      recipientId: recipient.id,
    });

    await inMemoryRecipientsRepository.create(recipient);
    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: recipient.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
      expect.any(Date),
    );
  });
});
