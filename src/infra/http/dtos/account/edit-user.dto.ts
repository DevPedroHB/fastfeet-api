import { ZodValidationPipe, createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

const editUserBodySchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  cpf: z
    .string()
    .min(14, { message: "O CPF deve ter 14 caracteres." })
    .max(14, { message: "O CPF deve ter no máximo 14 caracteres." }),
  role: z.enum(["ADMINISTRATOR", "DELIVERYMAN"]).optional(),
});

export const editUserBodyPipe = new ZodValidationPipe(editUserBodySchema);

export class EditUserBodyDto extends createZodDto(editUserBodySchema) {}
