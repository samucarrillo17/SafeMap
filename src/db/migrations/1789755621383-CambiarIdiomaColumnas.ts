import { MigrationInterface, QueryRunner } from "typeorm";

export class CambiarIdiomaColumnas1789755621383 implements MigrationInterface {
    name = 'CambiarIdiomaColumnas1789755621383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "correo" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD CONSTRAINT "UQ_63665765c1a778a770c9bd585d3" UNIQUE ("correo")`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "contrasena" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "contrasena"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP CONSTRAINT "UQ_63665765c1a778a770c9bd585d3"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "correo"`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "password" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "email" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email")`);
    }

}
