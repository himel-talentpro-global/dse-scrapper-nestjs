// company.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Circuit_breaks } from '../entities/circuitBreaker.entities';
import { CreateCircuitBreakerDto } from '../dto/circuitBreaker.dto';

@Injectable()
export class CircuitBreakerService {
  constructor(
    @InjectRepository(Circuit_breaks)
    private readonly circuitBreakerRepository: Repository<Circuit_breaks>,
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
        trade_code,
        breaker,
        tickSize,
        openAdjPrice,
        floorPrice,
        lowerLimit,
        upperLimit,
        floorPriceBlockMarket,
        // date,
      } = createCircuitBreakerDto;
      const circuitBreaker = new Circuit_breaks();

      circuitBreaker.trade_code = trade_code;
      circuitBreaker.breaker = breaker;
      circuitBreaker.tickSize = tickSize;
      circuitBreaker.openAdjPrice = openAdjPrice;
      circuitBreaker.floorPrice = floorPrice;
      circuitBreaker.lowerLimit = lowerLimit;
      circuitBreaker.upperLimit = upperLimit;
      circuitBreaker.floorPriceBlockMarket = floorPriceBlockMarket;

      const queryBuilder = this.circuitBreakerRepository
        .createQueryBuilder()
        .insert()
        .into(Circuit_breaks)
        .values(circuitBreaker)
        .orUpdate(
          [
            'breaker',
            'tickSize',
            'openAdjPrice',
            'floorPrice',
            'lowerLimit',
            'upperLimit',
            'floorPriceBlockMarket',
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
