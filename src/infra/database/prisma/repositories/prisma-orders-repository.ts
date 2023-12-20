import { PaginationParams } from "@/core/repositories/pagination-params";
import { OrderAttachmentsRepository } from "@/domain/order/application/repositories/order-attachments-repository";
import {
  FindManyNearbyParams,
  OrdersRepository,
} from "@/domain/order/application/repositories/orders-repository";
import { Order } from "@/domain/order/enterprise/entities/order";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { Injectable } from "@nestjs/common";
import { getDistanceBetweenCoordinates } from "test/utils/get-distance-between-coordinates";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
    private orderAttachmentsRepository: OrderAttachmentsRepository,
  ) {}

  async findById(id: string) {
    const cacheHit = await this.cache.get(`order:${id}`);

    if (cacheHit) {
      return PrismaOrderMapper.toDomain(JSON.parse(cacheHit));
    }

    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      return null;
    }

    await this.cache.set(`order:${order.id}`, JSON.stringify(order));

    return PrismaOrderMapper.toDomain(order);
  }

  async findManyByDeliverymanId(
    deliverymanId: string,
    { page, perPage }: PaginationParams,
  ) {
    const users = await this.prisma.order.findMany({
      where: {
        deliverymanId,
      },
      orderBy: {
        withdrawnAt: "desc",
      },
      take: perPage,
      skip: (page - 1) * perPage,
    });

    return users.map(PrismaOrderMapper.toDomain);
  }

  async findManyByRecipientId(
    recipientId: string,
    { page, perPage }: PaginationParams,
  ) {
    const users = await this.prisma.order.findMany({
      where: {
        recipientId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: perPage,
      skip: (page - 1) * perPage,
    });

    return users.map(PrismaOrderMapper.toDomain);
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Order[]> {
    const MAX_DISTANCE_IN_KILOMETERS = 1;

    const ordersAndRecipient = await this.prisma.order.findMany({
      where: {
        postedAt: {
          not: null,
        },
        deliverymanId: null,
        withdrawnAt: null,
      },
      include: {
        recipient: true,
      },
    });

    const orders = ordersAndRecipient.filter((order) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude, longitude },
        {
          latitude: order.recipient.latitude,
          longitude: order.recipient.longitude,
        },
      );

      return distance < MAX_DISTANCE_IN_KILOMETERS;
    });

    return orders.map(PrismaOrderMapper.toDomain);
  }

  async create(order: Order) {
    const data = PrismaOrderMapper.toPrisma(order);

    await this.prisma.order.create({
      data,
    });
  }

  async save(order: Order) {
    const data = PrismaOrderMapper.toPrisma(order);

    await Promise.all([
      this.prisma.order.update({
        where: {
          id: data.id,
        },
        data,
      }),

      this.orderAttachmentsRepository.createMany(
        order.attachments.getNewItems(),
      ),

      this.orderAttachmentsRepository.deleteMany(
        order.attachments.getRemovedItems(),
      ),
    ]);

    await this.cache.delete(`order:${data.id}`);
  }

  async delete(order: Order) {
    await this.prisma.order.delete({
      where: {
        id: order.id.toString(),
      },
    });

    await this.orderAttachmentsRepository.deleteManyByOrderId(
      order.id.toString(),
    );

    await this.cache.delete(`order:${order.id.toString()}`);
  }
}
