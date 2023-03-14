import {
  Entity,
  Column,
  // PrimaryGeneratedColumn,
  PrimaryColumn,
  // CreateDateColumn,
} from 'typeorm';

@Entity()
export class Company {
  // @PrimaryGeneratedColumn()
  // id: number;

  @Column()
  @PrimaryColumn()
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column()
  last_agm: string;

  @Column()
  market_capitalization_mn: string;

  @Column()
  authorized_capital_mn: string;

  @Column()
  paidup_capital_mn: string;

  @Column()
  type_of_instrument: string;

  @Column()
  total_outstanding_share: string;

  @Column()
  face_par_value: string;

  @Column()
  sector: string;

  @Column()
  cash_dividend: string;

  @Column()
  bonus_issued_stock_dividend: string;

  @Column({ nullable: true })
  pe: string;

  @Column({ nullable: true })
  eps: string;

  @Column()
  listing_since: string;

  @Column()
  category: string;

  @Column()
  ponsor_director: string;

  @Column({ nullable: true })
  govt: string;

  @Column({ nullable: true })
  institute: string;

  @Column({ nullable: true })
  foreign: string;

  @Column({ nullable: true })
  public: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  // @Column({ type: 'date' })   // all types are working here
  // @CreateDateColumn()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
