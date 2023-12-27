import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { OrderReturnedEvent } from "@/domain/order/enterprise/events/order-returned-event";
import { Injectable } from "@nestjs/common";
import { SendNotificationUseCase } from "../use-cases/send-notification";

@Injectable()
export class OnOrderReturned implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendOrderReturnedNotification.bind(this),
      OrderReturnedEvent.name,
    );
  }

  private async sendOrderReturnedNotification({ order }: OrderReturnedEvent) {
    await this.sendNotification.execute({
      title: `Novo status em "${order.description}"`,
      content: `A encomenda "${order.description}" foi marcada como devolvida.`,
      recipientId: order.recipientId.toString(),
    });
  }
}
