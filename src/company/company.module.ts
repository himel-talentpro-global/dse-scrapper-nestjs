import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Browser from './index/browser';
import Index from './index/index';

import PageController from './middlewares/page.Controller';
import PeController from './middlewares/pe.Controller';
import CircuitBreakerController from './middlewares/circuitBreaker.Controller';

import PageScraper from './scrapers/codeNameScraper';
import PeScraper from './scrapers/peScrapar';
import CircuitBreakerScrapper from './scrapers/circuitBreakerScrapper';

import { CompanyService } from '../company/services/company.service';
import { PeService } from '../company/services/pe.service';
import { CircuitBreakerService } from '../company/services/circuitBreaker.service';

import { Company } from './entities/company.entities';
import { PE } from './entities/pe.entities';
import { CircuitBreaker } from './entities/circuitBreaker.entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      //   password: 'password',
      database: 'dse_scraped_data',
      entities: [Company, PE, CircuitBreaker],
      synchronize: true,
      //!if enabled every time run the app will try to create table using registerd entity (runs migration automatically).
    }),
    TypeOrmModule.forFeature([Company, PE, CircuitBreaker]), //to use typeORM Repository on company entity
  ],
  controllers: [],
  providers: [
    CompanyService,
    PeService,
    CircuitBreakerService,
    PageController,
    PeController,
    CircuitBreakerController,
    PageScraper,
    PeScraper,
    CircuitBreakerScrapper,
    Index,
    Browser,
  ],
})
export default class CompanyModule {}
