import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { OrderDeliveredEvent } from "@/domain/order/enterprise/events/order-delivered-event";
import { SendNotificationUseCase } from "../use-cases/send-notification";

export class OnOrderDelivered implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendOrderDeliveredNotification.bind(this),
      OrderDeliveredEvent.name,
    );
  }

  private async sendOrderDeliveredNotification({ order }: OrderDeliveredEvent) {
    await this.sendNotification.execute({
      title: `Novo status em "${order.description}"`,
      content: `A encomenda "${order.description}" foi marcada como entregue.`,
      recipientId: order.recipientId.toString(),
    });
  }
}
