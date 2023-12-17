import { makeRecipient } from "test/factories/make-recipient";
import { makeUser } from "test/factories/make-user";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UserRole } from "../../enterprise/entities/user";
import { GetRecipientByIdUseCase } from "./get-recipient-by-id";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetRecipientByIdUseCase;

describe("Get recipient by id", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetRecipientByIdUseCase(
      inMemoryRecipientsRepository,
      inMemoryUsersRepository,
    );
  });

  it("should be able to get a recipient by id", async () => {
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
    expect(result.value).toMatchObject({
      recipient: expect.objectContaining({
        name: recipient.name,
        cpf: recipient.cpf,
      }),
    });
  });
});
