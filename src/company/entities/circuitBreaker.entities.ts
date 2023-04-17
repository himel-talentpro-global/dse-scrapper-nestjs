import {
  Entity,
  Column,
  // PrimaryGeneratedColumn,
  PrimaryColumn,
  BeforeInsert,
  // CreateDateColumn,
} from 'typeorm';

@Entity()
export class CircuitBreaker {
  @PrimaryColumn()
  trade_code: string;

  @Column()
  breaker: string;

  @Column()
  tickSize: string;

  @Column()
  openAdjPrice: string;

  @Column()
  floorPrice: string;

  @Column()
  lowerLimit: string;

  @Column()
  upperLimit: string;

  @Column()
  floorPriceBlockMarket: string;

  @Column({ primary: true, type: 'date' })
  // @PrimaryColumn({ type: 'date' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // @PrimaryColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @BeforeInsert()
  setPrimaryKey() {
    this.created_at = new Date();
  }
}
