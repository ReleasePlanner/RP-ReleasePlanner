/**
 * Release Planner API
 * NestJS application following best practices
 */

import { Logger, ValidationPipe, BadRequestException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    bufferLogs: true,
  });

  // Serve static files from 'files' directory
  app.useStaticAssets(join(process.cwd(), 'files'), {
    prefix: '/files/',
  });

  // Global prefix for all routes
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Security: Helmet for HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"], // Swagger UI needs inline styles
          scriptSrc: ["'self'", "'unsafe-inline'"], // Swagger UI needs inline scripts
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false, // Disable for Swagger
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // Compression middleware
  app.use(compression());

  // Enhanced CORS configuration
  const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
    : ['http://localhost:5173'];

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-ID'],
    exposedHeaders: ['X-Correlation-ID', 'X-Request-ID'],
    maxAge: 86400, // 24 hours
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        // Log errors for debugging - use a custom serializer to handle circular references
        const serializeError = (error: any): any => {
          return {
            property: error.property,
            value: error.value,
            constraints: error.constraints,
            children: error.children?.map((child: any) => serializeError(child)),
          };
        };
        
        const serializedErrors = errors.map((error: any) => serializeError(error));
        console.error('[ValidationPipe] Validation errors:', JSON.stringify(serializedErrors, null, 2));
        
        const messages = errors.map((error) => {
          const constraints = error.constraints || {};
          const property = error.property || 'unknown';
          const constraintMessages = Object.values(constraints).join(', ');
          
          // If there are nested errors (children), include them in the message
          if (error.children && error.children.length > 0) {
            const nestedMessages = error.children.map((child: any) => {
              const childConstraints = child.constraints || {};
              const childProperty = child.property || 'unknown';
              const childMessages = Object.values(childConstraints).join(', ');
              
              // Recursively handle nested children
              if (child.children && child.children.length > 0) {
                const grandchildMessages = child.children.map((grandchild: any) => {
                  const grandchildConstraints = grandchild.constraints || {};
                  const grandchildProperty = grandchild.property || 'unknown';
                  const grandchildMessages = Object.values(grandchildConstraints).join(', ');
                  return grandchildMessages ? `${grandchildProperty}: ${grandchildMessages}` : grandchildProperty;
                }).filter((msg: string) => msg).join('; ');
                
                if (grandchildMessages) {
                  return `${childProperty}: ${childMessages || 'validation failed'} (${grandchildMessages})`;
                }
              }
              
              return childMessages ? `${childProperty}: ${childMessages}` : childProperty;
            }).filter((msg: string) => msg).join('; ');
            
            if (nestedMessages) {
              return `${property}: ${constraintMessages || 'validation failed'} (${nestedMessages})`;
            }
          }
          
          return constraintMessages ? `${property}: ${constraintMessages}` : `${property}: validation failed`;
        });
        
        const details = errors.map((error) => {
          const detail: any = {
            property: error.property,
            constraints: error.constraints,
            value: error.value,
          };
          
          if (error.children && error.children.length > 0) {
            detail.children = error.children.map((child: any) => {
              const childDetail: any = {
                property: child.property,
                constraints: child.constraints,
                value: child.value,
              };
              
              if (child.children && child.children.length > 0) {
                childDetail.children = child.children.map((grandchild: any) => ({
                  property: grandchild.property,
                  constraints: grandchild.constraints,
                  value: grandchild.value,
                }));
              }
              
              return childDetail;
            });
          }
          
          return detail;
        });
        
        return new BadRequestException({
          message: 'Validation failed',
          errors: messages,
          details,
        });
      },
    })
  );

  // Swagger/OpenAPI Configuration
  const config = new DocumentBuilder()
    .setTitle('Release Planner API')
    .setDescription(
      'API REST para la gestión de planes de release, productos, features, calendarios y propietarios IT. ' +
      'Construida con NestJS siguiendo Clean Architecture y mejores prácticas.'
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .addTag('auth', 'Autenticación y autorización')
    .addTag('base-phases', 'Gestión de fases base del sistema')
    .addTag('products', 'Gestión de productos y componentes')
    .addTag('features', 'Gestión de features de productos')
    .addTag('calendars', 'Gestión de calendarios y días festivos')
    .addTag('it-owners', 'Gestión de propietarios IT')
    .addTag('plans', 'Gestión de planes de release')
    .addTag('files', 'Gestión de archivos')
    .addTag('health', 'Health check endpoints')
    .addTag('metrics', 'Prometheus metrics endpoint')
    .addServer(`http://localhost:${process.env.PORT || 3000}`, 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Release Planner API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(
    `🚀 Release Planner API is running on: http://localhost:${port}/${globalPrefix}`,
    'Bootstrap'
  );
  Logger.log(
    `📚 Swagger Documentation: http://localhost:${port}/api/docs`,
    'Bootstrap'
  );
  Logger.log(
    `📊 Prometheus Metrics: http://localhost:${port}/api/metrics`,
    'Bootstrap'
  );
  Logger.log(
    `📄 OpenAPI JSON: http://localhost:${port}/api/docs-json`,
    'Bootstrap'
  );
}

bootstrap();

