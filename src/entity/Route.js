import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Route {
  @PrimaryColumn()
  routeId: number;

  @Column()
  name: string;
}
