import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { SendNotificationUseCase } from "./send-notification";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: SendNotificationUseCase;

describe("Send notification", () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
  });

  it("should be able to send a notification", async () => {
    const recipient = makeRecipient();

    await inMemoryRecipientsRepository.create(recipient);

    const result = await sut.execute({
      title: "An example title",
      content: "An example content",
      recipientId: recipient.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryNotificationsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "An example title",
          content: "An example content",
          recipientId: recipient.id,
        }),
      ]),
    );
  });
});
