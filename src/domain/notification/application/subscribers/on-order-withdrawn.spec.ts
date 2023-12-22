import { makeOrder } from "test/factories/make-order";
import { makeRecipient } from "test/factories/make-recipient";
import { makeUser } from "test/factories/make-user";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { InMemoryOrderAttachmentsRepository } from "test/repositories/in-memory-order-attachments-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { waitFor } from "test/utils/wait-for";
import { MockInstance } from "vitest";
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from "./../use-cases/send-notification";
import { OnOrderWithdrawn } from "./on-order-withdrawn";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sendNotification: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe("On order withdrawn", () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentsRepository,
      inMemoryRecipientsRepository,
    );
    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotification, "execute");

    new OnOrderWithdrawn(sendNotification);
  });

  it("should send notification when order is withdrawn", async () => {
    const deliveryman = makeUser();
    const recipient = makeRecipient();
    const order = makeOrder({
      recipientId: recipient.id,
    });

    await inMemoryUsersRepository.create(deliveryman);
    await inMemoryRecipientsRepository.create(recipient);
    await inMemoryOrdersRepository.create(order);

    order.withdrawn(deliveryman.id);

    await inMemoryOrdersRepository.save(order);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
