import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeUser } from "test/factories/make-user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UserRole } from "../../enterprise/entities/user";
import { CreateUserUseCase } from "./create-user";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let sut: CreateUserUseCase;

describe("Create user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new CreateUserUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it("should be able to crete a user", async () => {
    const administrator = makeUser({
      role: UserRole.ADMINISTRATOR,
    });

    await inMemoryUsersRepository.create(administrator);

    const result = await sut.execute({
      name: "An example name",
      cpf: "12345678901",
      password: "123456",
      administratorId: administrator.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryUsersRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "An example name",
          cpf: "12345678901",
          password: await fakeHasher.hash("123456"),
        }),
      ]),
    );
  });
});
