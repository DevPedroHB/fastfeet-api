import { ZodValidationPipe, createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

const createOrderBodySchema = z.object({
  description: z
    .string()
    .min(1, { message: "A descrição não pode estar vazia." }),
});

export const createOrderBodyPipe = new ZodValidationPipe(createOrderBodySchema);

export class CreateOrderBodyDto extends createZodDto(createOrderBodySchema) {}
