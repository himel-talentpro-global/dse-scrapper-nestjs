import { Injectable } from '@nestjs/common';
import { PeService } from '../services/pe.service';
import { CreatePeDto } from '../dto/pe.dto';

@Injectable()
export default class PeScrap {
  constructor(private readonly peService: PeService) {}

  url = 'https://www.dsebd.org/latest_PE.php';

  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    // Navigate to the selected page
    for (;;) {
      const response = await page.goto(this.url);
      console.log('retu', response.status());
      if (response.status() == 200) {
        break;
      }
      page = await browser.newPage();
    }

    // Wait for the required DOM to be rendered
    const scrapeCurrentPage = async () => {
      await page.waitForSelector('.content');

      let price_earnings_scrap: CreatePeDto[] = [
        {
          code: '',
          close_price: '',
          ycp: '',
          pe_1: '',
          pe_2: '',
          pe_3: '',
          pe_4: '',
          pe_5: '',
          pe_6: '',
        },
      ];
      price_earnings_scrap = await page.$$eval(
        'table.table.table-bordered.background-white.shares-table.fixedHeader > tbody >tr',
        async (text) => {
          const result = text.map((te) => {
            const value = te.querySelector('td');

            return {
              code: value.nextElementSibling.textContent,
              close_price:
                value.nextElementSibling.nextElementSibling.textContent,
              ycp: value.nextElementSibling.nextElementSibling
                .nextElementSibling.textContent,
              pe_1: value.nextElementSibling.nextElementSibling
                .nextElementSibling.nextElementSibling.textContent,
              pe_2: value.nextElementSibling.nextElementSibling
                .nextElementSibling.nextElementSibling.nextElementSibling
                .textContent,
              pe_3: value.nextElementSibling.nextElementSibling
                .nextElementSibling.nextElementSibling.nextElementSibling
                .nextElementSibling.textContent,
              pe_4: value.nextElementSibling.nextElementSibling
                .nextElementSibling.nextElementSibling.nextElementSibling
                .nextElementSibling.nextElementSibling.textContent,
              pe_5: value.nextElementSibling.nextElementSibling
                .nextElementSibling.nextElementSibling.nextElementSibling
                .nextElementSibling.nextElementSibling.nextElementSibling
                .textContent,
              pe_6: value.nextElementSibling.nextElementSibling
                .nextElementSibling.nextElementSibling.nextElementSibling
                .nextElementSibling.nextElementSibling.nextElementSibling
                .nextElementSibling.textContent,
            };
          });

          return result;
        },
      );
      // await page.close();

      //   //! Database insertion'''''''''''''''''''

      const is_created = await this.peService.upsertPeEntity(
        price_earnings_scrap,
      );
      // console.log('created records', is_created);
      // return price_earnings_scrap;
    };
    const data = await scrapeCurrentPage();
    //console.log('data...', data);
    // return data;
  }
}
