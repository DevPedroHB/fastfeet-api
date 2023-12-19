import { makeOrder } from "test/factories/make-order";
import { makeUser } from "test/factories/make-user";
import { InMemoryOrderAttachmentsRepository } from "test/repositories/in-memory-order-attachments-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { ReturnOrderUseCase } from "./return-order";

let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: ReturnOrderUseCase;

describe("Return order", () => {
  beforeEach(() => {
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentsRepository,
    );
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new ReturnOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryUsersRepository,
    );
  });

  it("should be able to return a order", async () => {
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
          returnedAt: expect.any(Date),
        }),
      ]),
    );
  });
});
