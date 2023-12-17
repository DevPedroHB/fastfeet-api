import { makeRecipient } from "test/factories/make-recipient";
import { makeUser } from "test/factories/make-user";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UserRole } from "../../enterprise/entities/user";
import { FetchRecipientsUseCase } from "./fetch-recipients";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: FetchRecipientsUseCase;

describe("Fetch recipients", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new FetchRecipientsUseCase(
      inMemoryRecipientsRepository,
      inMemoryUsersRepository,
    );
  });

  it("should be able to fetch recipients", async () => {
    const administrator = makeUser({
      role: UserRole.ADMINISTRATOR,
    });

    await inMemoryUsersRepository.create(administrator);

    for (let i = 0; i < 22; i++) {
      await inMemoryRecipientsRepository.create(makeRecipient());
    }

    const result = await sut.execute({
      page: 1,
      perPage: 20,
      administratorId: administrator.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.isSuccess() && result.value.recipients).toHaveLength(20);
  });
});
