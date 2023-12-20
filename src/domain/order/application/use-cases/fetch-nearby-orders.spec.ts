import { faker } from "@faker-js/faker";
import { makeOrder } from "test/factories/make-order";
import { makeRecipient } from "test/factories/make-recipient";
import { makeRecipientAddress } from "test/factories/make-recipient-address";
import { InMemoryOrderAttachmentsRepository } from "test/repositories/in-memory-order-attachments-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { FetchNearbyOrdersUseCase } from "./fetch-nearby-orders";

let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sut: FetchNearbyOrdersUseCase;

describe("Fetch nearby orders", () => {
  beforeEach(() => {
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentsRepository,
      inMemoryRecipientsRepository,
    );
    sut = new FetchNearbyOrdersUseCase(inMemoryOrdersRepository);
  });

  it("should be able to fetch a nearby orders", async () => {
    const recipient1 = makeRecipient({
      address: makeRecipientAddress({
        latitude: -23.1164753 - 0.005,
        longitude: -47.2281471 + 0.005,
      }),
    });
    const recipient2 = makeRecipient({
      address: makeRecipientAddress({
        latitude: -23.1164753 + 0.01,
        longitude: -47.2281471 - 0.01,
      }),
    });
    const order1 = makeOrder({
      description: "Near order",
      recipientId: recipient1.id,
      postedAt: faker.date.recent(),
    });
    const order2 = makeOrder({
      description: "Far order",
      recipientId: recipient2.id,
      postedAt: faker.date.recent(),
    });

    await inMemoryRecipientsRepository.create(recipient1);
    await inMemoryRecipientsRepository.create(recipient2);
    await inMemoryOrdersRepository.create(order1);
    await inMemoryOrdersRepository.create(order2);

    const result = await sut.execute({
      latitude: -23.1164753,
      longitude: -47.2281471,
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.isSuccess() && result.value.orders).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          description: "Near order",
        }),
      ]),
    );
  });
});
