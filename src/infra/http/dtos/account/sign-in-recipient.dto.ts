import { ZodValidationPipe, createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

const signInRecipientBodySchema = z.object({
  cpf: z
    .string()
    .min(14, { message: "O CPF deve ter 14 caracteres." })
    .max(14, { message: "O CPF deve ter 14 caracteres." }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export const signInRecipientBodyPipe = new ZodValidationPipe(
  signInRecipientBodySchema,
);

export class SignInRecipientBodyDto extends createZodDto(
  signInRecipientBodySchema,
) {}
