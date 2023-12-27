import { ZodValidationPipe, createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

const editRecipientBodySchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  cpf: z
    .string()
    .min(14, { message: "O CPF deve ter 14 caracteres." })
    .max(14, { message: "O CPF deve ter no máximo 14 caracteres." }),
  zipCode: z
    .string()
    .min(8, { message: "O CEP deve ter 8 caracteres." })
    .max(8, { message: "O CEP deve ter no máximo 8 caracteres." }),
  number: z.coerce.number(),
});

export const editRecipientBodyPipe = new ZodValidationPipe(
  editRecipientBodySchema,
);

export class EditRecipientBodyDto extends createZodDto(
  editRecipientBodySchema,
) {}
