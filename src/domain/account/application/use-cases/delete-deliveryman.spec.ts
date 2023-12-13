import { makeUser } from "test/factories/make-user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UserRole } from "../../enterprise/entities/user";
import { DeleteDeliverymanUseCase } from "./delete-deliveryman";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: DeleteDeliverymanUseCase;

describe("Delete deliveryman", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new DeleteDeliverymanUseCase(inMemoryUsersRepository);
  });

  it("should be able to delete a deliveryman", async () => {
    const administrator = makeUser({
      role: UserRole.ADMINISTRATOR,
    });
    const deliveryman = makeUser();

    await inMemoryUsersRepository.create(administrator);
    await inMemoryUsersRepository.create(deliveryman);

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      administratorId: administrator.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryUsersRepository.items).toHaveLength(1);
  });
});
