import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeUser } from "test/factories/make-user";
import { FakeLocator } from "test/location/fake-locator";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UserRole } from "../../enterprise/entities/user";
import { CPF } from "../../enterprise/entities/value-objects/cpf";
import { CreateRecipientUseCase } from "./create-recipient";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let fakeLocator: FakeLocator;
let sut: CreateRecipientUseCase;

describe("Create recipient", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    fakeLocator = new FakeLocator();
    sut = new CreateRecipientUseCase(
      inMemoryRecipientsRepository,
      inMemoryUsersRepository,
      fakeHasher,
      fakeLocator,
    );
  });

  it("should be able to create a recipient", async () => {
    const administrator = makeUser({
      role: UserRole.ADMINISTRATOR,
    });

    await inMemoryUsersRepository.create(administrator);

    const result = await sut.execute({
      name: "An example name",
      cpf: "123.456.789-01",
      password: "123456",
      zipCode: "12345678",
      number: 123,
      administratorId: administrator.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryRecipientsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "An example name",
          cpf: CPF.create("123.456.789-01"),
          password: await fakeHasher.hash("123456"),
        }),
      ]),
    );
  });
});
