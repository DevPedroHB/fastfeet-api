import { makeAttachment } from "test/factories/make-attachment";
import { makeOrder } from "test/factories/make-order";
import { makeUser } from "test/factories/make-user";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryOrderAttachmentsRepository } from "test/repositories/in-memory-order-attachments-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { DeliverOrderUseCase } from "./deliver-order";

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: DeliverOrderUseCase;

describe("Deliver order", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentsRepository,
    );
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new DeliverOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryUsersRepository,
      inMemoryOrderAttachmentsRepository,
    );
  });

  it("should be able to deliver a order", async () => {
    const deliveryman = makeUser();
    const order = makeOrder({
      deliverymanId: deliveryman.id,
    });
    const attachment = makeAttachment();

    await inMemoryUsersRepository.create(deliveryman);
    await inMemoryOrdersRepository.create(order);
    await inMemoryAttachmentsRepository.create(attachment);

    const result = await sut.execute({
      orderId: order.id.toString(),
      attachmentsIds: [attachment.id.toString()],
      deliverymanId: deliveryman.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryOrdersRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          deliveredAt: expect.any(Date),
        }),
      ]),
    );
  });
});
