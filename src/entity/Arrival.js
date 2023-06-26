import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Arrival {
  @PrimaryColumn()
  routeId: number;

  @PrimaryColumn()
  stationId: number;

  @PrimaryColumn()
  date: number;

  @PrimaryColumn()
  time: number;
}
