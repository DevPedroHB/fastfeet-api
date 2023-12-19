import { makeOrder } from "test/factories/make-order";
import { makeUser } from "test/factories/make-user";
import { InMemoryOrderAttachmentsRepository } from "test/repositories/in-memory-order-attachments-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { FetchDeliverymanOrdersUseCase } from "./fetch-deliveryman-orders";

let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: FetchDeliverymanOrdersUseCase;

describe("Fetch deliveryman orders", () => {
  beforeEach(() => {
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentsRepository,
    );
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new FetchDeliverymanOrdersUseCase(
      inMemoryOrdersRepository,
      inMemoryUsersRepository,
    );
  });

  it("should be able to fetch a deliveryman orders", async () => {
    const deliveryman = makeUser();

    await inMemoryUsersRepository.create(deliveryman);

    for (let i = 0; i < 22; i++) {
      await inMemoryOrdersRepository.create(
        makeOrder({
          deliverymanId: deliveryman.id,
        }),
      );
    }

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      page: 1,
      perPage: 20,
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.isSuccess() && result.value.orders).toHaveLength(20);
  });
});
