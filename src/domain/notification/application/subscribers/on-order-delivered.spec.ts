import { makeOrder } from "test/factories/make-order";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { InMemoryOrderAttachmentsRepository } from "test/repositories/in-memory-order-attachments-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { waitFor } from "test/utils/wait-for";
import { MockInstance } from "vitest";
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from "./../use-cases/send-notification";
import { OnOrderDelivered } from "./on-order-delivered";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sendNotification: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe("On order delivered", () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentsRepository,
      inMemoryRecipientsRepository,
    );
    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotification, "execute");

    new OnOrderDelivered(sendNotification);
  });

  it("should send notification when order is delivered", async () => {
    const recipient = makeRecipient();
    const order = makeOrder({
      recipientId: recipient.id,
    });

    await inMemoryRecipientsRepository.create(recipient);
    await inMemoryOrdersRepository.create(order);

    order.delivered();

    await inMemoryOrdersRepository.save(order);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
