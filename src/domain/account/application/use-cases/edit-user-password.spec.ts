import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeUser } from "test/factories/make-user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UserRole } from "../../enterprise/entities/user";
import { EditUserPasswordUseCase } from "./edit-user-password";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let sut: EditUserPasswordUseCase;

describe("Edit user password", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new EditUserPasswordUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it("should be able to edit a user password", async () => {
    const administrator = makeUser({
      role: UserRole.ADMINISTRATOR,
    });
    const user = makeUser();

    await inMemoryUsersRepository.create(administrator);
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      userId: user.id.toString(),
      password: "123456",
      administratorId: administrator.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryUsersRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          password: await fakeHasher.hash("123456"),
        }),
      ]),
    );
  });
});
