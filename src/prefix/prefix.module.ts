import { Module } from '@nestjs/common';
import { PrefixController } from './prefix.controller';
import { PrefixService } from './prefix.service';
import { Prefix } from './prefix.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Forum } from '../forum/forum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prefix, Forum])],
  controllers: [PrefixController],
  providers: [PrefixService],
})
export class PrefixModule {}
