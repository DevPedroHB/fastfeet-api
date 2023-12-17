import { ValueObject } from "@/core/entities/value-object";

export interface IAddress {
  zipCode: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: number;
  latitude: number;
  longitude: number;
}

export abstract class Address<T extends IAddress> extends ValueObject<T> {
  get zipCode() {
    return this.props.zipCode;
  }

  get state() {
    return this.props.state;
  }

  get city() {
    return this.props.city;
  }

  get neighborhood() {
    return this.props.neighborhood;
  }

  get street() {
    return this.props.street;
  }

  get number() {
    return this.props.number;
  }

  get latitude() {
    return this.props.latitude;
  }

  get longitude() {
    return this.props.longitude;
  }
}
