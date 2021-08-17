import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoggerMiddleware } from "./middlewares/logger.middleware";
import { UsersModule } from "./users/users.module";
import { WorkspacesModule } from "./workspaces/workspaces.module";
import { ChannelsModule } from "./channels/channels.module";
import { DmsModule } from "./dms/dms.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as ormconfig from "../ormconfig";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    WorkspacesModule,
    ChannelsModule,
    DmsModule,
    TypeOrmModule.forRoot(ormconfig)
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
