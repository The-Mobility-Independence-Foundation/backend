import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { Address } from './address.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
