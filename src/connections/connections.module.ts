import { Module } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from './entities/connection.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Connection]), CommonModule],
  providers: [ConnectionsService],
  exports: [ConnectionsService],
})
export class ConnectionsModule {}
