import { ZodValidationPipe, createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

const deliverOrderBodySchema = z.object({
  attachmentsIds: z.array(
    z
      .string()
      .uuid({ message: "O identificador do anexo deve ser um UUID válido." })
      .refine((data) => data.length > 0, {
        message: "A lista de identificadores de anexos não pode estar vazia.",
      }),
  ),
});

export const deliverOrderBodyPipe = new ZodValidationPipe(
  deliverOrderBodySchema,
);

export class DeliverOrderBodyDto extends createZodDto(deliverOrderBodySchema) {}
