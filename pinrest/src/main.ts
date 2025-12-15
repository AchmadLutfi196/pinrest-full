import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Pinterest Clone API')
    .setDescription(`
## 📌 Pinterest-like REST API

API lengkap untuk aplikasi seperti Pinterest dengan fitur:
- **Authentication** - Register & Login dengan JWT
- **Boards** - CRUD untuk papan/koleksi
- **Pins** - CRUD untuk pin/gambar dengan fitur like & save
- **Users** - Manajemen profil pengguna

### Authentication
Gunakan token JWT yang didapat dari endpoint login.
Klik tombol **Authorize** dan masukkan: \`Bearer <token>\`
    `)
    .setVersion('1.0')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Boards', 'Board CRUD endpoints')
    .addTag('Pins', 'Pin CRUD endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Pinterest API Docs',
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Application is running on: http://localhost:${process.env.PORT ?? 3000}/api`);
  console.log(`📚 Swagger docs available at: http://localhost:${process.env.PORT ?? 3000}/docs`);
}
bootstrap();
