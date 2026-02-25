import { Injectable } from '@nestjs/common';
import { User } from '../../../user/entities/user.entity';
import { ResourceAccessStrategy } from './generic/resource-access.strategy';
import { UserService } from '../../../user/user.service';

/**
 * Strategy for organization resource access
 * Checks if the user is a member of the organization
 */
@Injectable()
export class OrganizationMemberResourceAccessStrategy extends ResourceAccessStrategy {
  private organizationIdParam: string = 'orgId';

  constructor(private readonly userService: UserService) {
    super();
  }

  async canAccess(user: User, params: Record<string, any>): Promise<boolean> {
    const orgId = parseInt(params[this.organizationIdParam]);
    if (isNaN(orgId)) {
      return false;
    }

    const member = await this.userService.findByIdOrThrow(user.id, {
      relations: {
        organization: true,
      },
    });

    return orgId === member.organization?.id;
  }
}
