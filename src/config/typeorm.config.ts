import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  url: 'postgres://default:cKv39CHabUif@ep-broad-credit-a2k4y7e7.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require',
  database: 'gather',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true, // Set to false in production
  autoLoadEntities: true,
  ssl: {
    rejectUnauthorized: false,
  },
};
