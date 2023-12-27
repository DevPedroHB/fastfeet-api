import { ZodValidationPipe, createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

const editOrderBodySchema = z.object({
  description: z
    .string()
    .min(1, { message: "A descrição não pode estar vazia." }),
});

export const editOrderBodyPipe = new ZodValidationPipe(editOrderBodySchema);

export class EditOrderBodyDto extends createZodDto(editOrderBodySchema) {}
