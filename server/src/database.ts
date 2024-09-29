import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Job } from "./entities/Job";
import { Company } from "./entities/Company";

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Set to false in production
  logging: false,
  entities: [Job, Company],
});

const initializeDatabaseConnection = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
};

export { AppDataSource, initializeDatabaseConnection };
