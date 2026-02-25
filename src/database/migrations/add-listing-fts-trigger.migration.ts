import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Add a trigger to the listing table to update the ftsVector column
 */
export class ListingFtsTriggerMigration1743718263642
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the function to update the ftsVector column
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_listing_fts_vector()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."ftsVector" := 
          setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
          setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
          setweight(to_tsvector('english', COALESCE(NEW.attributes::text, '')), 'C');
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create the trigger to update the ftsVector column when the listing is created or updated
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS listing_fts_vector_trigger ON listing;
      CREATE TRIGGER listing_fts_vector_trigger
      BEFORE INSERT OR UPDATE ON listing
      FOR EACH ROW
      EXECUTE FUNCTION update_listing_fts_vector();
    `);

    // add the column to the table
await queryRunner.query(`
  ALTER TABLE "listing"
  ADD COLUMN IF NOT EXISTS "ftsVector" tsvector
`);

    // Create a GIN index on the ftsVector column for better search performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS listing_fts_gin_idx ON listing USING GIN ("ftsVector");
    `);

    // Update the ftsVector column for all existing listings
    // We also rank the search results by the name, description, and attributes
    await queryRunner.query(`
      UPDATE listing
      SET "ftsVector" = 
        setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(attributes::text, '')), 'C');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS listing_fts_vector_trigger ON listing;`,
    );

    await queryRunner.query(
      `DROP FUNCTION IF EXISTS update_listing_fts_vector();`,
    );

    await queryRunner.query(`DROP INDEX IF EXISTS listing_fts_gin_idx;`);
  }
}
