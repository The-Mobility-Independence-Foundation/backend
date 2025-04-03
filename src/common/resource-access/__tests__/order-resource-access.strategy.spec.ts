import { Test, TestingModule } from '@nestjs/testing';
import { OrderResourceAccessStrategy } from '../strategies/order-resource-access.strategy';
import { OrderService } from '../../../order/order.service';
import { createMock } from '@golevelup/ts-jest';
import { User } from '../../../user/entities/user.entity';
import { Order } from '../../../order/order.entity';
import { Organization } from '../../../organization/organization.entity';
import { when } from 'jest-when';

describe('OrderResourceAccessStrategy', () => {
  let strategy: OrderResourceAccessStrategy;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderResourceAccessStrategy],
    })
      .useMocker(createMock)
      .compile();

    strategy = module.get(OrderResourceAccessStrategy);
    orderService = module.get(OrderService);
  });

  describe('canAccess', () => {
    let user: User;

    beforeEach(async () => {
      user = new User();
    });

    it('should return false when order id is not a number', async () => {
      Object.assign(user, {
        id: 1,
      });
      const params = { orderId: 'NaN' };

      const result = await strategy.canAccess(user, params);

      expect(result).toBe(false);
      expect(orderService.findByIdOrThrow).not.toHaveBeenCalled();
    });

    it('should return false when user isnt in either org for the order', async () => {
      const order = new Order();
      const recOrg = new Organization();
      const provOrg = new Organization();
      Object.assign(recOrg, {
        id: 1,
      });
      Object.assign(provOrg, {
        id: 2,
      });
      Object.assign(order, {
        id: 1,
        recipientOrganization: recOrg,
        providerOrganization: provOrg,
      });

      Object.assign(user, {
        id: 300,
      });
      const params = { orderId: String(order.id) };

      when(orderService.findByIdOrThrow)
        .calledWith(order.id, expect.anything())
        .mockResolvedValue(order);

      const result = await strategy.canAccess(user, params);

      expect(result).toBe(false);
    });

    it('should return true when user is in an org for the order', async () => {
      const order = new Order();
      const recOrg = new Organization();
      const provOrg = new Organization();
      Object.assign(recOrg, {
        id: 1,
      });
      Object.assign(provOrg, {
        id: 2,
      });
      Object.assign(order, {
        id: 1,
        recipientOrganization: recOrg,
        providerOrganization: provOrg,
      });

      Object.assign(user, {
        id: 1,
        organization: recOrg,
      });
      const params = { orderId: String(order.id) };

      when(orderService.findByIdOrThrow)
        .calledWith(order.id, expect.anything())
        .mockResolvedValue(order);

      const result = await strategy.canAccess(user, params);

      expect(result).toBe(true);
    });
  });
});
