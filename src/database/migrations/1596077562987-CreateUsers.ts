import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1596077562987 implements MigrationInterface {
  name = 'CreateUsers1596077562987';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "public"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(255) NOT NULL, "sobrenome" character varying(255) NOT NULL, "idade" integer NOT NULL, "foto_url" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "created_At" TIMESTAMP NOT NULL DEFAULT 'now()', "updated_At" TIMESTAMP NOT NULL DEFAULT 'now()', CONSTRAINT "UQ_12ffa5c867f6bb71e2690a526ce" UNIQUE ("email"), CONSTRAINT "PK_a6cc71bedf15a41a5f5ee8aea97" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "pkey_id_users" ON "public"."users" ("id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."pkey_id_users"`);
    await queryRunner.query(`DROP TABLE "public"."users"`);
  }
}
