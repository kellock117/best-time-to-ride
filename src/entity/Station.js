import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Station {
  @PrimaryColumn()
  routeId: number;

  @PrimaryColumn()
  stationId: number;

  @Column()
  name: string;

  @Column()
  stationOrder: number;
}
