import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, MaxLength } from 'class-validator';

export class UpdateReportDto {
  // This should be factored out once we have auth on the endpoint
  // We should instead use the id of whichever user is making the update
  @ApiProperty({ description: 'The id of the moderator handling the report.' })
  @IsPositive({ message: 'moderatorId must be positive.' })
  moderatorId: number;

  @ApiProperty({ description: 'The action taken by the moderator.' })
  @IsNotEmpty()
  @MaxLength(200)
  actionTaken: string;
}
