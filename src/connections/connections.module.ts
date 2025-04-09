import { Module } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { User } from 'src/user/entities/user.entity';
import { Connection } from './connection.entity';
import { UsersConnectionsController } from './users-connections.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Connection, User]), CommonModule],
  controllers: [UsersConnectionsController],
  providers: [ConnectionsService],
  exports: [ConnectionsService],
})
export class ConnectionsModule {}
