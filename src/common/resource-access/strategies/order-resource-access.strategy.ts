import { Injectable } from '@nestjs/common';
import { User } from '../../../user/entities/user.entity';
import { ResourceAccessStrategy } from './resource-access.strategy';
import { OrderService } from '../../../order/order.service';

/**
 * Strategy for organization resource access
 * Checks if the user is a member of the organizations for the order
 */
@Injectable()
export class OrderResourceAccessStrategy extends ResourceAccessStrategy {
  private orderIdParam: string = 'orderId';

  constructor(private readonly orderService: OrderService) {
    super();
  }

  async canAccess(user: User, params: Record<string, any>): Promise<boolean> {
    const orderId = parseInt(params[this.orderIdParam]);

    if (isNaN(orderId)) {
      return false;
    }

    const order = await this.orderService.findByIdOrThrow(orderId, {
      relations: {
        recipientOrganization: true,
        providerOrganization: true,
      },
    });

    return (
      user.organization?.id === order.recipientOrganization.id ||
      user.organization?.id === order.providerOrganization.id
    );
  }
}
