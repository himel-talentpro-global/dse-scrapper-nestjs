import BrowserObject from './browser';
import { Injectable } from '@nestjs/common';
import ScraperController from '../middlewares/page.Controller';
import PeController from '../middlewares/pe.Controller';
import CircuitBreakerController from '../middlewares/circuitBreaker.Controller';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export default class IndexProvider {
  constructor(
    private readonly browserObject: BrowserObject,
    private readonly scraperController: ScraperController,
    private readonly peController: PeController,
    private readonly circuitBreakerController: CircuitBreakerController,
  ) {}
  //Start the browser and create a browser instance
  // @Cron(CronExpression.EVERY_5_MINUTES)
  @Cron(CronExpression.EVERY_MINUTE)
  // @Cron('*/2 * * * *') // for every 2 minutes
  async func() {
    const browserInstance = this.browserObject.startBrowser();

    // Pass the browser instance to the scraper controller
    this.scraperController.scrapeAll(browserInstance);
    this.peController.scrapeAll(browserInstance);
    this.circuitBreakerController.scrapeAll(browserInstance);
  }
}
