import { UseCaseError } from "@/core/errors/use-case-error";

export class RequiredValueError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`The ${identifier} is required.`);
  }
}
