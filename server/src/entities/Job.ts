import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Company } from "./Company";

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  title: string;

  @Column({ type: "varchar", length: 255 })
  description: string;

  @Column({ type: "timestamptz" })
  expiry: Date;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;

  @ManyToOne(() => Company, (company) => company.jobs)
  company: Company;
}
