import { ZodValidationPipe, createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

const createUserBodySchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  cpf: z
    .string()
    .min(14, { message: "O CPF deve ter 14 caracteres." })
    .max(14, { message: "O CPF deve ter no máximo 14 caracteres." }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  role: z.enum(["ADMINISTRATOR", "DELIVERYMAN"]).optional(),
});

export const createUserBodyPipe = new ZodValidationPipe(createUserBodySchema);

export class CreateUserBodyDto extends createZodDto(createUserBodySchema) {}
