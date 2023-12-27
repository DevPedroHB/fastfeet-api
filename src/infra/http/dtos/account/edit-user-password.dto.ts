import { ZodValidationPipe, createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

const editUserPasswordBodySchema = z.object({
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export const editUserPasswordBodyPipe = new ZodValidationPipe(
  editUserPasswordBodySchema,
);

export class EditUserPasswordBodyDto extends createZodDto(
  editUserPasswordBodySchema,
) {}
