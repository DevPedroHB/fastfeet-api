import { ZodValidationPipe, createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

const editRecipientPasswordBodySchema = z.object({
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export const editRecipientPasswordBodyPipe = new ZodValidationPipe(
  editRecipientPasswordBodySchema,
);

export class EditRecipientPasswordBodyDto extends createZodDto(
  editRecipientPasswordBodySchema,
) {}
