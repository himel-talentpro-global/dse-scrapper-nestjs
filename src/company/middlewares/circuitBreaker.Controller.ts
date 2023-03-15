import CircuitBreakerScraper from '../scrapers/circuitBreakerScrapper';
import { Injectable, Inject } from '@nestjs/common';
@Injectable()
export default class CircuitBreakerController {
  constructor(
    @Inject(CircuitBreakerScraper)
    private readonly circuitBreakerScraper: CircuitBreakerScraper,
  ) {}

  async scrapeAll(browserInstance) {
    let browser;
    try {
      browser = await browserInstance;
      await this.circuitBreakerScraper.scraper(browser);
    } catch (err) {
      console.log('Could not resolve the browser instance => ', err);
    }
  }
}
