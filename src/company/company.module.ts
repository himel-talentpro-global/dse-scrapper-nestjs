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

import { Companies } from './entities/company.entities';
import { Price_earnings } from './entities/pe.entities';
import { Circuit_breaks } from './entities/circuitBreaker.entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      //   password: 'password',
      database: 'scraped_data',
      entities: [Companies, Price_earnings, Circuit_breaks],
      synchronize: true,
      //!if enabled every time run the app will try to create table using registerd entity (runs migration automatically).
    }),
    TypeOrmModule.forFeature([Companies, Price_earnings, Circuit_breaks]), //to use typeORM Repository on entities
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
