import { Injectable } from '@nestjs/common';
import { table } from 'console';

@Injectable()
export default class PageService {
  scraperObject = {
    url: 'https://www.dsebd.org/company_listing.php',

    async scraper(browser) {
      const page = await browser.newPage();
      console.log(`Navigating to ${this.url}...`);
      // Navigate to the selected page
      await page.goto(this.url);
      const scrapedData = [];
      // Wait for the required DOM to be rendered
      async function scrapeCurrentPage() {
        await page.waitForSelector('.content');
        const companies = [];
        for (let id = 65; id <= 90; id++) {
          //for id A-Z
          // console.log("ID", String.fromCharCode(id));
          const company_code_name = await page.$$eval(
            `div#${String.fromCharCode(id)} > div.BodyContent > a.ab1`,
            (company_code_name) => {
              company_code_name = company_code_name.map((el) => {
                return {
                  Code: el.textContent,
                  Name: el.nextElementSibling.textContent.replace(
                    /[\(\)]/gm,
                    '',
                  ),
                };
              });
              // console.log("company_code_name ...1", company_code_name);
              return company_code_name;
            },
          );
          companies.push(...company_code_name);
          // console.log("urls", urls);
        }
        // console.log("companies", companies);

        //!========================================== Company Detail Scraping =========================

        // Loop through each of those links, open a new page instance and get the relevant data from them

        let link = '';
        const pagePromise = (code) =>
          new Promise(async (resolve, reject) => {
            let dataObj = {};
            const newPage = await browser.newPage();
            // console.log("code", code);
            link = `https://www.dsebd.org/displayCompany.php?name=${code}`;
            await newPage.goto(link);
            // await newPage.waitForSelector('h2.BodyHead.topBodyHead');
            dataObj['name'] = await newPage.$eval(
              'div#section-to-print > h2 > i',
              (text) => text.textContent,
            );

            // dataObj['bookPrice'] = await newPage.$$eval(
            //   'table#company',
            //   async (text) => {
            //     console.log('text', text[1]);
            //     const element = Array.from(text[1]);
            //     element.map((i) => {
            //       console.log('item...', i);
            //     });

            //     console.log('text....1', element);
            //   },
            // );
            // =========================

            // dataObj['Market Capitalization (mn)'] = await newPage.$$eval(
            //   'table#company',
            //   async (table) => {
            //     const element =
            //       table[1].querySelector('tbody > tr').nextElementSibling
            //         .nextElementSibling.nextElementSibling.nextElementSibling
            //         .nextElementSibling.nextElementSibling;

            //     return element.querySelector('td').nextElementSibling
            //       .nextElementSibling.textContent;
            //   },
            // );

            //!===============

            dataObj['last_agm'] = await newPage.$eval(
              'div.col-sm-6.pull-left > i',
              (text) => text.textContent,
            );

            dataObj = await newPage.$$eval(
              'table#company',
              async (table, obj) => {
                //---------------table-1-Market Information---------------
                let baseElement =
                  table[1].querySelector('tbody > tr').nextElementSibling
                    .nextElementSibling.nextElementSibling.nextElementSibling
                    .nextElementSibling.nextElementSibling;

                obj['market_capitalization_mn'] =
                  baseElement.querySelector(
                    'td',
                  ).nextElementSibling.nextElementSibling.textContent;

                //---------------table-2-Basic Information---------------

                baseElement = table[2].querySelector('tbody > tr');

                obj['authorized_capital_mn'] =
                  baseElement.querySelector('td').textContent;

                obj['paidup_capital_mn'] =
                  baseElement.nextElementSibling.querySelector(
                    'td',
                  ).textContent;

                obj['type_of_instrument'] =
                  baseElement.nextElementSibling.querySelector(
                    'td',
                  ).nextElementSibling.nextElementSibling.textContent;

                obj['total_outstanding_share'] =
                  baseElement.nextElementSibling.nextElementSibling.nextElementSibling.querySelector(
                    'td',
                  ).textContent;

                obj['face_par_value'] =
                  baseElement.nextElementSibling.nextElementSibling.querySelector(
                    'td',
                  ).textContent;

                obj['sector'] =
                  baseElement.nextElementSibling.nextElementSibling.nextElementSibling.querySelector(
                    'td',
                  ).nextElementSibling.nextElementSibling.textContent;

                //---------------table-3-Last AGM---------------

                baseElement = table[3].querySelector('tbody > tr');

                obj['cash_dividend'] =
                  baseElement.querySelector('td').textContent;

                obj['bonus_issued_stock_dividend'] =
                  baseElement.nextElementSibling.querySelector(
                    'td',
                  ).textContent;
                //---------------table-6-Price Earnings (P/E) Ratio Based on latest Audited Financial Statements---------------

                baseElement = table[6].querySelector('tbody > tr');
                obj['pe'] =
                  baseElement.nextElementSibling.querySelector(
                    'td',
                  ).nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent;

                //---------------table-7-Price Earnings (P/E) Ratio Based on latest Audited Financial Statements---------------

                baseElement = table[7].querySelector('tbody > tr');
                obj['eps'] =
                  baseElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.querySelector(
                    'td',
                  ).nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent;

                //---------------table-10-Other Information of the Company---------------
                baseElement = table[10].querySelector('tbody > tr');

                obj['listing_since'] =
                  baseElement.querySelector(
                    'td',
                  ).nextElementSibling.textContent;

                obj['category'] =
                  baseElement.nextElementSibling.querySelector(
                    'td',
                  ).nextElementSibling.textContent;

                //-----------------------------Shareholding pattern--------------------------
                const Shareholding =
                  baseElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling
                    .querySelector('td')
                    .nextElementSibling.querySelector('table > tbody > tr');
                const ShareholdingArray = Shareholding.textContent
                  .replace(/\s+/g, ' ')
                  .trim()
                  .split(' ');

                obj['ponsor_director'] = ShareholdingArray[1];
                obj['govt'] = ShareholdingArray[3];
                obj['institute'] = ShareholdingArray[5];
                obj['foreign'] = ShareholdingArray[7];
                obj['public'] = ShareholdingArray[9];
                //---------------Shareholding Pattern----------------------

                //---------------------table-12-Address of the Company------------------
                baseElement = table[12].querySelector('tbody > tr');

                const addressArray = baseElement.textContent.trim().split('\n');

                obj['address'] = addressArray[2].replace(/\s+/g, ' ');

                obj['phone'] =
                  baseElement.nextElementSibling.nextElementSibling.querySelector(
                    'td',
                  ).nextElementSibling.textContent;

                obj['email'] =
                  baseElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.querySelector(
                    'td',
                  ).nextElementSibling.textContent;

                console.log(
                  "baseElement.nextElementSibling.querySelector('td').textContent",
                  baseElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.querySelector(
                    'td',
                  ).nextElementSibling.textContent,
                );

                return obj;
              },
              dataObj,
            );

            const date = new Date();
            console.log('date', date);

            //!==============

            resolve(dataObj);
            await newPage.close();
          });
        const compa = ['AAMRANET', 'AAMRATECH', 'ABB1STMF'];

        // compa.map(async(comp)=>{
        // 	// console.log("code", comp.Code);
        // 	let currentPageData = await pagePromise(comp);
        // 	scrapedData.push(currentPageData);
        // 	console.log(currentPageData);
        // })

        for (link in compa) {
          // console.log("companies[link]", companies[link].Code);
          const currentPageData = await pagePromise(companies[link].Code);
          scrapedData.push(currentPageData);
          // console.log(currentPageData);
        }
      }
      const data = await scrapeCurrentPage();
      // console.log('data...', data);
      return data;
    },
  };
}
