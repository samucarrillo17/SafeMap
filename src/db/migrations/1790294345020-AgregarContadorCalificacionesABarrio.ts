import { MigrationInterface, QueryRunner } from "typeorm";

export class AgregarContadorCalificacionesABarrio1790294345020 implements MigrationInterface {
    name = 'AgregarContadorCalificacionesABarrio1790294345020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "barrios" ADD "contador_calificaciones" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "barrios" DROP COLUMN "contador_calificaciones"`);
    }

}
