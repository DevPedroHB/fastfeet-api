import { IAddress } from "../../enterprise/entities/value-objects/address";

export abstract class Locator {
  abstract getLocationByZipCode(
    zipCode: string,
  ): Promise<Omit<IAddress, "number"> | null>;
}
