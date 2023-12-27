import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { patchNestJsSwagger } from "nestjs-zod";
import { AppModule } from "./app.module";
import { EnvService } from "./env/env.service";

patchNestJsSwagger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["v1"],
    prefix: "api/",
  });

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle("FastFeet API")
    .setDescription(
      "API para controle de encomendas de uma transportadora FastFeet.",
    )
    .setVersion("1.0.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Insira o JWT token",
        in: "header",
      },
      "token",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("docs", app, document);

  const envService = app.get(EnvService);

  const port = envService.get("PORT");

  await app.listen(port);
}

bootstrap();
