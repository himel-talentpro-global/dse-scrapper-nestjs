import PeScraper from '../scrapers/peScrapar';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export default class PeController {
  constructor(@Inject(PeScraper) private readonly peScraper: PeScraper) {}

  async scrapeAll(browserInstance) {
    let browser;
    try {
      browser = await browserInstance;
      await this.peScraper.scraper(browser);
    } catch (err) {
      console.log('Could not resolve the browser instance => ', err);
    }
  }
}
