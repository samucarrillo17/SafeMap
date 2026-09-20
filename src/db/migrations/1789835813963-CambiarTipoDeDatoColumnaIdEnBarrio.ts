import { MigrationInterface, QueryRunner } from "typeorm";

export class CambiarTipoDeDatoColumnaIdEnBarrio1789835813963 implements MigrationInterface {
    name = 'CambiarTipoDeDatoColumnaIdEnBarrio1789835813963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calificaciones" DROP CONSTRAINT "FK_5093ca807c555d530c697edf1bb"`);
        await queryRunner.query(`ALTER TABLE "barrios" DROP CONSTRAINT "PK_16e28df8b7ebada77200bc7c52e"`);
        await queryRunner.query(`ALTER TABLE "barrios" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "barrios" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "barrios" ADD CONSTRAINT "PK_16e28df8b7ebada77200bc7c52e" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "calificaciones" DROP CONSTRAINT "UQ_139c38de46b83e1d6bc9d75fdf7"`);
        await queryRunner.query(`ALTER TABLE "calificaciones" DROP COLUMN "barrio_id"`);
        await queryRunner.query(`ALTER TABLE "calificaciones" ADD "barrio_id" uuid`);
        await queryRunner.query(`ALTER TABLE "calificaciones" ADD CONSTRAINT "UQ_139c38de46b83e1d6bc9d75fdf7" UNIQUE ("usuario_id", "barrio_id")`);
        await queryRunner.query(`ALTER TABLE "calificaciones" ADD CONSTRAINT "FK_5093ca807c555d530c697edf1bb" FOREIGN KEY ("barrio_id") REFERENCES "barrios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calificaciones" DROP CONSTRAINT "FK_5093ca807c555d530c697edf1bb"`);
        await queryRunner.query(`ALTER TABLE "calificaciones" DROP CONSTRAINT "UQ_139c38de46b83e1d6bc9d75fdf7"`);
        await queryRunner.query(`ALTER TABLE "calificaciones" DROP COLUMN "barrio_id"`);
        await queryRunner.query(`ALTER TABLE "calificaciones" ADD "barrio_id" integer`);
        await queryRunner.query(`ALTER TABLE "calificaciones" ADD CONSTRAINT "UQ_139c38de46b83e1d6bc9d75fdf7" UNIQUE ("usuario_id", "barrio_id")`);
        await queryRunner.query(`ALTER TABLE "barrios" DROP CONSTRAINT "PK_16e28df8b7ebada77200bc7c52e"`);
        await queryRunner.query(`ALTER TABLE "barrios" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "barrios" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "barrios" ADD CONSTRAINT "PK_16e28df8b7ebada77200bc7c52e" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "calificaciones" ADD CONSTRAINT "FK_5093ca807c555d530c697edf1bb" FOREIGN KEY ("barrio_id") REFERENCES "barrios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
