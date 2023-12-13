import { makeUser } from "test/factories/make-user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UserRole } from "../../enterprise/entities/user";
import { FetchDeliverymenUseCase } from "./fetch-deliverymen";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: FetchDeliverymenUseCase;

describe("Fetch deliverymen", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new FetchDeliverymenUseCase(inMemoryUsersRepository);
  });

  it("should be able to fetch deliverymen", async () => {
    const administrator = makeUser({
      role: UserRole.ADMINISTRATOR,
    });

    await inMemoryUsersRepository.create(administrator);

    for (let i = 0; i < 22; i++) {
      await inMemoryUsersRepository.create(makeUser());
    }

    const result = await sut.execute({
      page: 1,
      perPage: 20,
      administratorId: administrator.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.isSuccess() && result.value.deliverymen).toHaveLength(20);
  });
});
