import { MigrationInterface, QueryRunner } from "typeorm";

export class CambiarEstadoSemaforoAEnum1790354948648 implements MigrationInterface {
    name = 'CambiarEstadoSemaforoAEnum1790354948648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "barrios" DROP COLUMN "estado_semaforo"`);
        await queryRunner.query(`CREATE TYPE "public"."barrios_estado_semaforo_enum" AS ENUM('verde', 'amarillo', 'rojo', 'sin_calificar')`);
        await queryRunner.query(`ALTER TABLE "barrios" ADD "estado_semaforo" "public"."barrios_estado_semaforo_enum" NOT NULL DEFAULT 'sin_calificar'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "barrios" DROP COLUMN "estado_semaforo"`);
        await queryRunner.query(`DROP TYPE "public"."barrios_estado_semaforo_enum"`);
        await queryRunner.query(`ALTER TABLE "barrios" ADD "estado_semaforo" text NOT NULL DEFAULT 'VERDE'`);
    }

}
