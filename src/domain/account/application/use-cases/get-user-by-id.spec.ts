import { makeUser } from "test/factories/make-user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UserRole } from "../../enterprise/entities/user";
import { GetUserByIdUseCase } from "./get-user-by-id";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetUserByIdUseCase;

describe("Get user by id", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetUserByIdUseCase(inMemoryUsersRepository);
  });

  it("should be able to get a user by id", async () => {
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
    expect(inMemoryUsersRepository.items).toEqual(
      expect.arrayContaining([expect.objectContaining(user)]),
    );
  });
});
