import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { OrderWithdrawnEvent } from "@/domain/order/enterprise/events/order-withdrawn-event";
import { Injectable } from "@nestjs/common";
import { SendNotificationUseCase } from "../use-cases/send-notification";

@Injectable()
export class OnOrderWithdrawn implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendOrderWithdrawnNotification.bind(this),
      OrderWithdrawnEvent.name,
    );
  }

  private async sendOrderWithdrawnNotification({ order }: OrderWithdrawnEvent) {
    await this.sendNotification.execute({
      title: `Novo status em "${order.description}"`,
      content: `A encomenda "${order.description}" foi retirada para entrega.`,
      recipientId: order.recipientId.toString(),
    });
  }
}
