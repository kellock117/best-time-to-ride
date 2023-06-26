import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { Route } from "./entity/Route";
import { Station } from "./entity/Station";
import { Arrival } from "./entity/Arrival";

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: process.env.username,
  password: process.env.password,
  database: "best-time-to-ride",
  synchronize: true,
  logging: false,
  entities: [Route, Station, Arrival],
  migrations: [],
  subscribers: [],
});

export default AppDataSource;
