import { DataSource } from "typeorm";
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: String(process.env.POSTGRES_PASSWORD),
    database: process.env.POSTGRES_DB,
    migrations: [path.resolve(__dirname, './migrations/*{.ts,.js}')],
    synchronize: false,
    migrationsRun: true,
})