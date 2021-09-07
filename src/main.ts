import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./http-exception.filter";
import passport from "passport";
import path from "path";
import { NestExpressApplication } from "@nestjs/platform-express";

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3000;
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe()); // transform: true 설정 시 param 타입 변환 자동 => pipe 사용x

  // static setting
  if (process.env.NODE_ENV === "production") {
    app.enableCors({
      origin: ["https://실주소"],
      credentials: true
    });
  } else {
    app.enableCors({
      origin: true,
      credentials: true
    });
  }
  // useStaticAssets 못찾는 이유
  // nest가 express 혹은 fastify를 내부에서 선택하는데 선택한 것에 해당 함수가 없는것.
  // app생성시 익스프레스로 사용하기위해 제네릭 타입으로 NestExpressApplication를 해주어 타입추론이 가능하게 한다.
  app.useStaticAssets(path.join(__dirname, "..", "uploads"), {
    prefix: "/uploads"
  });

  const config = new DocumentBuilder()
    .setTitle("Slack example")
    .setDescription("Slack API description")
    .setVersion("1.0")
    .addCookieAuth("connect.sid")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  // app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(port);

  console.log(`listening on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
