import { makeUser } from "test/factories/make-user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UserRole } from "../../enterprise/entities/user";
import { EditDeliverymanUseCase } from "./edit-deliveryman";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: EditDeliverymanUseCase;

describe("Edit deliveryman", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new EditDeliverymanUseCase(inMemoryUsersRepository);
  });

  it("should be able to edit a deliveryman", async () => {
    const administrator = makeUser({
      role: UserRole.ADMINISTRATOR,
    });
    const deliveryman = makeUser();

    await inMemoryUsersRepository.create(administrator);
    await inMemoryUsersRepository.create(deliveryman);

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      name: "New name",
      cpf: 12345678901,
      administratorId: administrator.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryUsersRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "New name",
          cpf: 12345678901,
        }),
      ]),
    );
  });
});
