import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import dotenv from "dotenv";
import { ChannelChats } from "./src/entities/ChannelChats";
import { ChannelMembers } from "./src/entities/ChannelMembers";
import { Channels } from "./src/entities/Channels";
import { DMs } from "./src/entities/DMs";
import { Mentions } from "./src/entities/Mentions";
import { Users } from "./src/entities/Users";
import { WorkspaceMembers } from "./src/entities/WorkspaceMembers";
import { Workspaces } from "./src/entities/Workspaces";

dotenv.config();
const config: TypeOrmModuleOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    ChannelChats,
    ChannelMembers,
    Channels,
    DMs,
    Mentions,
    Users,
    WorkspaceMembers,
    Workspaces
  ],
  migrations: [__dirname + "/src/migrations/*.ts"], // 마이그레이션할때 migration이나 cli명령시 ormconfig.ts가 package.json과 같은 위치에 없으면 가끔 에러 발생하여..
  cli: { migrationsDir: "src/migrations" },
  autoLoadEntities: true,
  charset: "utf8mb4",
  synchronize: false,
  logging: process.env.NODE_ENV !== "production",
  keepConnectionAlive: true //hotreload시 db연결끊김 방지
};

export = config;
