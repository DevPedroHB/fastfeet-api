import { makeRecipient } from "test/factories/make-recipient";
import { makeRecipientAddress } from "test/factories/make-recipient-address";
import { makeUser } from "test/factories/make-user";
import { FakeLocator } from "test/location/fake-locator";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UserRole } from "../../enterprise/entities/user";
import { CPF } from "../../enterprise/entities/value-objects/cpf";
import { EditRecipientUseCase } from "./edit-recipient";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeLocator: FakeLocator;
let sut: EditRecipientUseCase;

describe("Edit recipient", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeLocator = new FakeLocator();
    sut = new EditRecipientUseCase(
      inMemoryRecipientsRepository,
      inMemoryUsersRepository,
      fakeLocator,
    );
  });

  it("should be able to edit a recipient", async () => {
    const administrator = makeUser({
      role: UserRole.ADMINISTRATOR,
    });
    const recipient = makeRecipient();
    const address = makeRecipientAddress({
      recipientId: recipient.id,
    });

    recipient.address = address;

    await inMemoryUsersRepository.create(administrator);
    await inMemoryRecipientsRepository.create(recipient);

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      name: "New name",
      cpf: "123.456.789-01",
      zipCode: "12345678",
      number: 123,
      administratorId: administrator.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryRecipientsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "New name",
          cpf: CPF.create("123.456.789-01"),
        }),
      ]),
    );
  });
});
