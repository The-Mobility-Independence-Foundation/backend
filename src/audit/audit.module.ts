import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../organization/organization.entity';
import { User } from '../user/entities/user.entity';
import { Audit } from './audit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Audit, User, Organization])],
  controllers: [AuditController],
  providers: [AuditService],
})
export class AuditModule {}
