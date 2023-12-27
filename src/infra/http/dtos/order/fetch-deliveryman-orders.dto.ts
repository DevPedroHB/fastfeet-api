import { ZodValidationPipe, createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

const fetchDeliverymanOrdersQuerySchema = z.object({
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

export const fetchDeliverymanOrdersQueryPipe = new ZodValidationPipe(
  fetchDeliverymanOrdersQuerySchema,
);

export class FetchDeliverymanOrdersQueryDto extends createZodDto(
  fetchDeliverymanOrdersQuerySchema,
) {}
