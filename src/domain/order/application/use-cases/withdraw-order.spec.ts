import { makeOrder } from "test/factories/make-order";
import { makeUser } from "test/factories/make-user";
import { InMemoryOrderAttachmentsRepository } from "test/repositories/in-memory-order-attachments-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { WithdrawOrderUseCase } from "./withdraw-order";

let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: WithdrawOrderUseCase;

describe("Withdraw order", () => {
  beforeEach(() => {
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentsRepository,
      inMemoryRecipientsRepository,
    );
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new WithdrawOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryUsersRepository,
    );
  });

  it("should be able to withdraw a order", async () => {
    const deliveryman = makeUser();
    const order = makeOrder();

    await inMemoryUsersRepository.create(deliveryman);
    await inMemoryOrdersRepository.create(order);

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliverymanId: deliveryman.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryOrdersRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          withdrawnAt: expect.any(Date),
          deliverymanId: deliveryman.id,
        }),
      ]),
    );
  });
});
