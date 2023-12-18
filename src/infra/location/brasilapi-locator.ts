import { Locator } from "@/domain/account/application/location/locator";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

interface BrasilApiResponse {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  location: {
    type: string;
    coordinates: {
      longitude: string;
      latitude: string;
    };
  };
}

@Injectable()
export class BrasilApiLocator implements Locator {
  constructor(private readonly axios: HttpService) {}

  async getLocationByZipCode(zipCode: string) {
    try {
      const response = await firstValueFrom(
        this.axios.get<BrasilApiResponse>(
          `https://brasilapi.com.br/api/cep/v2/${zipCode}`,
        ),
      );

      return {
        zipCode: response.data.cep,
        state: response.data.state,
        city: response.data.city,
        neighborhood: response.data.neighborhood,
        street: response.data.street,
        latitude: Number(response.data.location.coordinates.latitude),
        longitude: Number(response.data.location.coordinates.longitude),
      };
    } catch (error) {
      console.log(error);

      return null;
    }
  }
}
