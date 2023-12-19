import { UserRole } from "@/domain/account/enterprise/entities/user";
import { makeOrder } from "test/factories/make-order";
import { makeUser } from "test/factories/make-user";
import { InMemoryOrderAttachmentsRepository } from "test/repositories/in-memory-order-attachments-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { GetOrderByIdUseCase } from "./get-order-by-id";

let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetOrderByIdUseCase;

describe("Get order by id", () => {
  beforeEach(() => {
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentsRepository,
    );
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetOrderByIdUseCase(
      inMemoryOrdersRepository,
      inMemoryUsersRepository,
    );
  });

  it("should be able to get a order by id", async () => {
    const administrator = makeUser({
      role: UserRole.ADMINISTRATOR,
    });
    const order = makeOrder();

    await inMemoryUsersRepository.create(administrator);
    await inMemoryOrdersRepository.create(order);

    const result = await sut.execute({
      orderId: order.id.toString(),
      administratorId: administrator.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.value).toMatchObject({
      order: expect.objectContaining({
        description: order.description,
      }),
    });
  });
});
