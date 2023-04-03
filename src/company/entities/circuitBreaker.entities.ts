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
  code: string;

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
  floorPriceBlockMakret: string;

<<<<<<< HEAD
  // @Column({ primary: true, type: 'date' })
  // // @PrimaryColumn({ type: 'date' })
  // created_at: Date;

  @Column({ primary: true, type: 'timestamp' })
=======
  @Column({ primary: true, type: 'date' })
  // @PrimaryColumn({ type: 'date' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
>>>>>>> master
  // @PrimaryColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @BeforeInsert()
  setPrimaryKey() {
<<<<<<< HEAD
    this.updated_at = new Date();
=======
    this.created_at = new Date();
>>>>>>> master
  }
}
