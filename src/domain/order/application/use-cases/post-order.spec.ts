import { UserRole } from "@/domain/account/enterprise/entities/user";
import { makeOrder } from "test/factories/make-order";
import { makeUser } from "test/factories/make-user";
import { InMemoryOrderAttachmentsRepository } from "test/repositories/in-memory-order-attachments-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { PostOrderUseCase } from "./post-order";

let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: PostOrderUseCase;

describe("Post order", () => {
  beforeEach(() => {
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentsRepository,
      inMemoryRecipientsRepository,
    );
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new PostOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryUsersRepository,
    );
  });

  it("should be able to post a order", async () => {
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
    expect(inMemoryOrdersRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          postedAt: expect.any(Date),
        }),
      ]),
    );
  });
});
