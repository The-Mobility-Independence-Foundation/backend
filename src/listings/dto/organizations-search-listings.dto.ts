import { SearchListingsDto } from './search-listings.dto';
import { OmitType } from '@nestjs/swagger';

export class OrganizationsSearchListingsDto extends OmitType(
  SearchListingsDto,
  ['organizationId'],
) {}
