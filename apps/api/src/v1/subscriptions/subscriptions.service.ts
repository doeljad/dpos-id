import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getActiveByTenant(tenantId: string) {
    return this.prisma.subscription.findFirst({
      where: {
        tenant_id: tenantId,
        status: SubscriptionStatus.active,
      },
      include: {
        current_plan: true,
        next_plan: true,
      },
    });
  }

  async getAll() {
    return this.prisma.subscription.findMany({
      include: {
        tenant: {
          select: { id: true, name: true, email: true },
        },
        current_plan: true,
        next_plan: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async subscribe(data: {
  tenant_id: string;
  current_plan_id: string;
  start_date?: Date;
  end_date?: Date;
  renewal_date?: Date;
  status?: SubscriptionStatus;
}) {
  const start = data.start_date ?? new Date();
  const end = data.end_date ?? new Date(new Date().setMonth(new Date().getMonth() + 1));
  const renewal = data.renewal_date ?? end;

  // Nonaktifkan yang aktif dulu
  await this.prisma.subscription.updateMany({
    where: { tenant_id: data.tenant_id, status: SubscriptionStatus.active },
    data: { status: SubscriptionStatus.cancelled },
  });

  return this.prisma.subscription.create({
    data: {
      tenant_id: data.tenant_id,
      current_plan_id: data.current_plan_id,
      start_date: start,
      end_date: end,
      renewal_date: renewal,
      status: data.status ?? SubscriptionStatus.active,
    },
  });
}


  async update(id: string, data: any) {
    return this.prisma.subscription.update({
      where: { id },
      data,
    });
  }

  async cancel(id: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { id } });
    if (!sub) throw new NotFoundException('Subscription not found');

    return this.prisma.subscription.update({
      where: { id },
      data: {
        status: SubscriptionStatus.cancelled,
        end_date: new Date(),
      },
    });
  }
}
