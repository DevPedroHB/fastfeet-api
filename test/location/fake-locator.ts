import { Locator } from "@/domain/account/application/location/locator";
import { IAddress } from "@/domain/account/enterprise/entities/value-objects/address";
import { faker } from "@faker-js/faker";

export class FakeLocator implements Locator {
  async getLocationByZipCode(
    zipCode: string,
  ): Promise<Omit<IAddress, "number"> | null> {
    const coordinates = faker.location.nearbyGPSCoordinate();

    return {
      zipCode,
      state: faker.location.state({ abbreviated: true }),
      city: faker.location.city(),
      neighborhood: faker.location.country(),
      street: faker.location.street(),
      latitude: coordinates[0],
      longitude: coordinates[1],
    };
  }
}
