import { Entity } from "@/core/entities/entity";

export interface IAttachment {
  title: string;
  url: string;
}

export class Attachment<T extends IAttachment> extends Entity<T> {
  get title() {
    return this.props.title;
  }

  get url() {
    return this.props.url;
  }
}
