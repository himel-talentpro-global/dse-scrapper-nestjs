import { Injectable } from '@nestjs/common';
import { CircuitBreakerService } from '../services/circuitBreaker.service';
import { CreateCircuitBreakerDto } from '../dto/circuitBreaker.dto';
@Injectable()
export default class CircuitBreakerScraper {
  constructor(private readonly circuitBreakerService: CircuitBreakerService) {
    // this.scraperObject = {
    //   peService: this.peService,
    // };
  }

  // circuitBreakerScrap = {
  url = 'https://www.dsebd.org/cbul.php';

  async scraper(browser) {
    const page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    // Navigate to the selected page
    await page.goto(this.url);
    // Wait for the required DOM to be rendered
    const scrapeCurrentPage = async () => {
      await page.waitForSelector('.content');
      let circuit_breaker: CreateCircuitBreakerDto[] = [
        {
          code: ' ',
          breaker: ' ',
          tickSize: ' ',
          openAdjPrice: ' ',
          floorPrice: ' ',
          lowerLimit: ' ',
          upperLimit: ' ',
          floorPriceBlockMakret: ' ',
        },
      ];
      circuit_breaker = await page.$$eval(
        'table.table.table-bordered.background-white.text-center > tbody >tr',
        async (text) => {
          const result = text.slice(2).map((te) => {
            const value = te.querySelector('td');
            return {
              // id: value.textContent,
              code: value.nextElementSibling.textContent,
              breaker: value.nextElementSibling.nextElementSibling.textContent,
              tickSize:
                value.nextElementSibling.nextElementSibling.nextElementSibling
                  .textContent,
              openAdjPrice:
                value.nextElementSibling.nextElementSibling.nextElementSibling
                  .nextElementSibling.textContent,
              floorPrice:
                value.nextElementSibling.nextElementSibling.nextElementSibling
                  .nextElementSibling.nextElementSibling.textContent,
              lowerLimit:
                value.nextElementSibling.nextElementSibling.nextElementSibling
                  .nextElementSibling.nextElementSibling.nextElementSibling
                  .textContent,
              upperLimit:
                value.nextElementSibling.nextElementSibling.nextElementSibling
                  .nextElementSibling.nextElementSibling.nextElementSibling
                  .nextElementSibling.textContent,
              floorPriceBlockMakret:
                value.nextElementSibling.nextElementSibling.nextElementSibling
                  .nextElementSibling.nextElementSibling.nextElementSibling
                  .nextElementSibling.nextElementSibling.textContent,
            };
          });
          return result;
        },
      );
      const is_created =
        await this.circuitBreakerService.upsertCircuitBreakerEntity(
          circuit_breaker,
        );

      // console.log('circuit_breaker', circuit_breaker);
      // return circuit_breaker;
    };
    const data = await scrapeCurrentPage();
    //console.log('data...', data);
    // return data;
  }
  // };
}
