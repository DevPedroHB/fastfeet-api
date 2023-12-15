import { makeUser } from "test/factories/make-user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UserRole } from "../../enterprise/entities/user";
import { DeleteUserUseCase } from "./delete-user";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: DeleteUserUseCase;

describe("Delete user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new DeleteUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to delete a user", async () => {
    const administrator = makeUser({
      role: UserRole.ADMINISTRATOR,
    });
    const user = makeUser();

    await inMemoryUsersRepository.create(administrator);
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      userId: user.id.toString(),
      administratorId: administrator.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryUsersRepository.items).toHaveLength(1);
  });
});
