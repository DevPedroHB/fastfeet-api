import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { FakeEncrypter } from "./../../../../../test/cryptography/fake-encrypter";
import { SignInRecipientUseCase } from "./sign-in-recipient";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: SignInRecipientUseCase;

describe("Sign in recipient", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new SignInRecipientUseCase(
      inMemoryRecipientsRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it("should be able to sign in recipient", async () => {
    const recipient = makeRecipient({
      password: await fakeHasher.hash("123456"),
    });

    await inMemoryRecipientsRepository.create(recipient);

    const result = await sut.execute({
      cpf: recipient.cpf.value,
      password: "123456",
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual({
      token: expect.any(String),
    });
  });
});
