import { ZodValidationPipe, createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

const fetchRecipientOrdersQuerySchema = z.object({
  page: z.coerce
    .number()
    .optional()
    .default(1)
    .pipe(z.number().min(1, { message: "A página deve ser no mínimo 1." })),
  perPage: z.coerce
    .number()
    .optional()
    .default(20)
    .pipe(
      z.number().min(1, { message: "Itens por página deve ser no mínimo 1." }),
    ),
});

export const fetchRecipientOrdersQueryPipe = new ZodValidationPipe(
  fetchRecipientOrdersQuerySchema,
);

export class FetchRecipientOrdersQueryDto extends createZodDto(
  fetchRecipientOrdersQuerySchema,
) {}
