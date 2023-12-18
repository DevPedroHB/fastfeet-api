import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeRecipient } from "test/factories/make-recipient";
import { makeUser } from "test/factories/make-user";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UserRole } from "../../enterprise/entities/user";
import { EditRecipientPasswordUseCase } from "./edit-recipient-password";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let sut: EditRecipientPasswordUseCase;

describe("Edit recipient password", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new EditRecipientPasswordUseCase(
      inMemoryRecipientsRepository,
      inMemoryUsersRepository,
      fakeHasher,
    );
  });

  it("should be able to edit a recipient password", async () => {
    const administrator = makeUser({
      role: UserRole.ADMINISTRATOR,
    });
    const recipient = makeRecipient();

    await inMemoryUsersRepository.create(administrator);
    await inMemoryRecipientsRepository.create(recipient);

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      password: "123456",
      administratorId: administrator.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryRecipientsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          password: await fakeHasher.hash("123456"),
        }),
      ]),
    );
  });
});
