import { MigrationInterface, QueryRunner } from "typeorm";

export class CambiarValorPorDefectoDePuntajePromedio1790518698045 implements MigrationInterface {
    name = 'CambiarValorPorDefectoDePuntajePromedio1790518698045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "barrios" ALTER COLUMN "puntaje_promedio" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "barrios" ALTER COLUMN "puntaje_promedio" SET DEFAULT '1'`);
    }

}
