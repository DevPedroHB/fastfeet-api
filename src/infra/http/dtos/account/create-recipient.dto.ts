import { ZodValidationPipe, createZodDto } from "nestjs-zod";
import { z } from "zod";

const isValidCPF = (cpf) => {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

  return cpfRegex.test(cpf);
};

const createRecipientBodySchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  cpf: z.string().refine((cpf) => isValidCPF(cpf), {
    message: "O CPF deve estar no formato correto (ex: 123.456.789-01).",
  }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  zipCode: z
    .string()
    .min(8, { message: "O CEP deve ter 8 caracteres." })
    .max(8, { message: "O CEP deve ter 8 caracteres." }),
  number: z.number().refine((value) => !isNaN(value), {
    message: "O número deve ser um valor numérico.",
  }),
});

export const createRecipientBodyPipe = new ZodValidationPipe(
  createRecipientBodySchema,
);

export class CreateRecipientBodyDto extends createZodDto(
  createRecipientBodySchema,
) {}
