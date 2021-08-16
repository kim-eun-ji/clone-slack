import { Mentions } from "src/entities/Mentions";
import {MigrationInterface, QueryRunner} from "typeorm";

export class categoryToType1629107510522 implements MigrationInterface {
    name = 'categoryToType1629107510522'

    // generate 명령은 불안정하기때문에 100% 신뢰하지 않을것.
    // 변경할 내역 npm run db:migrate
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `mentions` RENAME COLUMN `category` To `type`');
    }

    // 롤백 내역 npm run db:migrate:revert
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `mentions` RENAME COLUMN `type` To `category`');
    }

}
