import { Injectable } from '@nestjs/common';
import { User } from '../../../user/entities/user.entity';
import { ResourceAccessStrategy } from './resource-access.strategy';
import { OrganizationService } from '../../../organization/organization.service';

/**
 * Strategy for organization resource access
 * Checks if the user is the owner of the organization
 */
@Injectable()
export class OrganizationOwnerResourceAccessStrategy extends ResourceAccessStrategy {
  private organizationIdParam: string = 'orgId';

  constructor(private readonly organizationService: OrganizationService) {
    super();
  }

  async canAccess(user: User, params: Record<string, any>): Promise<boolean> {
    const orgId = parseInt(params[this.organizationIdParam]);

    if (isNaN(orgId)) {
      return false;
    }

    const organization = await this.organizationService.findByIdOrThrow(orgId, {
      relations: {
        members: true,
      },
    });

    return organization.owner.id === user.id;
  }
}
