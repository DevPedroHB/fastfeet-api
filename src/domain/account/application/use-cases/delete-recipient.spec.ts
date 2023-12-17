import { makeRecipient } from "test/factories/make-recipient";
import { makeUser } from "test/factories/make-user";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UserRole } from "../../enterprise/entities/user";
import { DeleteRecipientUseCase } from "./delete-recipient";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: DeleteRecipientUseCase;

describe("Delete recipient", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new DeleteRecipientUseCase(
      inMemoryRecipientsRepository,
      inMemoryUsersRepository,
    );
  });

  it("should be able to delete a recipient", async () => {
    const administrator = makeUser({
      role: UserRole.ADMINISTRATOR,
    });
    const recipient = makeRecipient();

    await inMemoryUsersRepository.create(administrator);
    await inMemoryRecipientsRepository.create(recipient);

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      administratorId: administrator.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryRecipientsRepository.items).toHaveLength(0);
  });
});
