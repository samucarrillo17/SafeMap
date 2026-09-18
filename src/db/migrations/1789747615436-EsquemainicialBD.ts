import { MigrationInterface, QueryRunner } from "typeorm";

export class EsquemainicialBD1789747615436 implements MigrationInterface {
    name = 'EsquemainicialBD1789747615436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "barrios" ("id" SERIAL NOT NULL, "nombre" text NOT NULL, "geometria" geometry(Polygon,4326) NOT NULL, "puntaje_promedio" double precision NOT NULL DEFAULT '1', "estado_semaforo" text NOT NULL DEFAULT 'VERDE', CONSTRAINT "UQ_cc46f56a8af3ff666e9abfb785f" UNIQUE ("nombre"), CONSTRAINT "PK_16e28df8b7ebada77200bc7c52e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "calificaciones" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "estrellas" integer NOT NULL, "fue_victima" boolean NOT NULL, "comentario" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "usuario_id" uuid, "barrio_id" integer, CONSTRAINT "UQ_139c38de46b83e1d6bc9d75fdf7" UNIQUE ("usuario_id", "barrio_id"), CONSTRAINT "PK_45fac93d6e61f7cd3b4f28020b0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" text NOT NULL, "password" text NOT NULL, "nombre" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "calificaciones" ADD CONSTRAINT "FK_2c659b1ff27e23cf97d70fb25c8" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "calificaciones" ADD CONSTRAINT "FK_5093ca807c555d530c697edf1bb" FOREIGN KEY ("barrio_id") REFERENCES "barrios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calificaciones" DROP CONSTRAINT "FK_5093ca807c555d530c697edf1bb"`);
        await queryRunner.query(`ALTER TABLE "calificaciones" DROP CONSTRAINT "FK_2c659b1ff27e23cf97d70fb25c8"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
        await queryRunner.query(`DROP TABLE "calificaciones"`);
        await queryRunner.query(`DROP TABLE "barrios"`);
    }

}
