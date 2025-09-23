import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { LevelsModule } from './domains/levels/levels.module';
import { DevelopersModule } from './domains/developers/developers.module';
dotenv.config({ path: '.env' });

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: String(process.env.POSTGRES_PASSWORD),
    database: process.env.POSTGRES_DB,
    entities: [__dirname + '../src/domains/*/entity.{js,ts}'],
    autoLoadEntities: true,
    synchronize: false,
  }),
    LevelsModule,
    DevelopersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
