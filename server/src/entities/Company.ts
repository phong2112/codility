import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Job } from "./Job";

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  title: string;

  @Column({ type: "varchar", length: 255 })
  description: string;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;

  @OneToMany(() => Job, (job) => job.company) 
  jobs: Job[];
}
