import { makeOrder } from "test/factories/make-order";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryOrderAttachmentsRepository } from "test/repositories/in-memory-order-attachments-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { FetchRecipientOrdersUseCase } from "./fetch-recipient-orders";

let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: FetchRecipientOrdersUseCase;

describe("Fetch recipient orders", () => {
  beforeEach(() => {
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentsRepository,
    );
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    sut = new FetchRecipientOrdersUseCase(
      inMemoryOrdersRepository,
      inMemoryRecipientsRepository,
    );
  });

  it("should be able to fetch a recipient orders", async () => {
    const recipient = makeRecipient();

    await inMemoryRecipientsRepository.create(recipient);

    for (let i = 0; i < 22; i++) {
      await inMemoryOrdersRepository.create(
        makeOrder({
          recipientId: recipient.id,
        }),
      );
    }

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      page: 1,
      perPage: 20,
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.isSuccess() && result.value.orders).toHaveLength(20);
  });
});
