import PageScraper from '../scrapers/codeNameScraper';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export default class PageController {
  constructor(@Inject(PageScraper) private readonly pageScraper: PageScraper) {}

  async scrapeAll(browserInstance) {
    let browser;
    try {
      browser = await browserInstance;
      await this.pageScraper.scraper(browser);
    } catch (err) {
      console.log('Could not resolve the browser instance => ', err);
    }
  }
}
