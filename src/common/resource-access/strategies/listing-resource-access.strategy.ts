import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { ListingsService } from 'src/listings/listings.service';
import { ResourceAccessStrategy } from './generic/resource-access.strategy';

@Injectable()
export class ListingResourceAccessStrategy extends ResourceAccessStrategy {
  private listingIdParam: string = 'listingId';

  constructor(private readonly listingsService: ListingsService) {
    super();
  }

  async canAccess(user: User, params: Record<string, any>): Promise<boolean> {
    const listingId = parseInt(params[this.listingIdParam]);
    if (isNaN(listingId)) {
      return false;
    }

    const listing = await this.listingsService.findByIdOrThrow(listingId);
    return listing.organizationId === user.organizationId;
  }
}
