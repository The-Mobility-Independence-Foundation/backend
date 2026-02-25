import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Enable the PostGIS extension
 */
export class PostGISMigration1744068355626 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS postgis`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION IF EXISTS postgis`);
  }
}
