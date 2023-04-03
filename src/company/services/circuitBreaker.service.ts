// company.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CircuitBreaker } from '../entities/circuitBreaker.entities';
import { CreateCircuitBreakerDto } from '../dto/circuitBreaker.dto';

@Injectable()
export class CircuitBreakerService {
  constructor(
    @InjectRepository(CircuitBreaker)
    private readonly circuitBreakerRepository: Repository<CircuitBreaker>,
  ) {}

  async upsertCircuitBreakerEntity(
    createCircuitBreakerDtos: CreateCircuitBreakerDto[],
  ): Promise<void> {
    // const a = 0;
    for (const createCircuitBreakerDto of createCircuitBreakerDtos) {
      // a++;
      // console.log('createPeDtos...', createCircuitBreakerDto);
      // if (a == 3) {
      //   break;
      // }
      const {
        code,
        breaker,
        tickSize,
        openAdjPrice,
        floorPrice,
        lowerLimit,
        upperLimit,
        floorPriceBlockMakret,
        // date,
      } = createCircuitBreakerDto;
      const circuitBreaker = new CircuitBreaker();

      circuitBreaker.code = code;
      circuitBreaker.breaker = breaker;
      circuitBreaker.tickSize = tickSize;
      circuitBreaker.openAdjPrice = openAdjPrice;
      circuitBreaker.floorPrice = floorPrice;
      circuitBreaker.lowerLimit = lowerLimit;
      circuitBreaker.upperLimit = upperLimit;
      circuitBreaker.floorPriceBlockMakret = floorPriceBlockMakret;

      const queryBuilder = this.circuitBreakerRepository
        .createQueryBuilder()
        .insert()
        .into(CircuitBreaker)
        .values(circuitBreaker)
        .orUpdate(
          [
            'breaker',
            'tickSize',
            'openAdjPrice',
            'floorPrice',
            'lowerLimit',
            'upperLimit',
            'floorPriceBlockMakret',
            'updated_at',
          ],
          // ['externalId'],
          // {
          //   skipUpdateIfNoValuesChanged: true,
          //   // indexPredicate: 'date > 2020-01-01',
          // },
        );
      // .orUpdate([
      //   'breaker',
      //   'tickSize',
      //   'openAdjPrice',
      //   'floorPrice',
      //   'lowerLimit',
      //   'upperLimit',
      //   'floorPriceBlockMakret',
      //   // 'updated_at',
      // ]);
      await queryBuilder.execute();
    }
  }
}
