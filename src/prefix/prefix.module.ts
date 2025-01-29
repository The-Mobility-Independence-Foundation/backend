import { Module } from '@nestjs/common';
import { PrefixController } from './prefix.controller';
import { PrefixService } from './prefix.service';
import { Prefix } from './prefix.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([Prefix])],
  controllers: [PrefixController],
  providers: [PrefixService]
})
export class PrefixModule {}
