import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeUser } from "test/factories/make-user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UserRole } from "../../enterprise/entities/user";
import { EditUserUseCase } from "./edit-user";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let sut: EditUserUseCase;

describe("Edit user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new EditUserUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it("should be able to edit a user", async () => {
    const administrator = makeUser({
      role: UserRole.ADMINISTRATOR,
    });
    const user = makeUser();

    await inMemoryUsersRepository.create(administrator);
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      userId: user.id.toString(),
      name: "New name",
      cpf: "12345678901",
      password: "123456",
      administratorId: administrator.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryUsersRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "New name",
          cpf: "12345678901",
          password: await fakeHasher.hash("123456"),
        }),
      ]),
    );
  });
});