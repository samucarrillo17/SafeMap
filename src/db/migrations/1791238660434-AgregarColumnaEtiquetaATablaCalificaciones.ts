import { MigrationInterface, QueryRunner } from "typeorm";

export class AgregarColumnaEtiquetaATablaCalificaciones1791238660434 implements MigrationInterface {
    name = 'AgregarColumnaEtiquetaATablaCalificaciones1791238660434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calificaciones" ADD "etiqueta" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calificaciones" DROP COLUMN "etiqueta"`);
    }

}
