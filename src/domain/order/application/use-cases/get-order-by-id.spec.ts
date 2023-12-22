import { makeOrder } from "test/factories/make-order";
import { InMemoryOrderAttachmentsRepository } from "test/repositories/in-memory-order-attachments-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { GetOrderByIdUseCase } from "./get-order-by-id";

let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sut: GetOrderByIdUseCase;

describe("Get order by id", () => {
  beforeEach(() => {
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentsRepository,
      inMemoryRecipientsRepository,
    );
    sut = new GetOrderByIdUseCase(inMemoryOrdersRepository);
  });

  it("should be able to get a order by id", async () => {
    const order = makeOrder();

    await inMemoryOrdersRepository.create(order);

    const result = await sut.execute({
      orderId: order.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.value).toMatchObject({
      order: expect.objectContaining({
        description: order.description,
      }),
    });
  });
});
