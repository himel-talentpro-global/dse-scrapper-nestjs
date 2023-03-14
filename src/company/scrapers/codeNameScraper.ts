import { Injectable } from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { CreateCompanyDto } from '../dto/company.dto';

@Injectable()
export default class PageService {
  // scraperObject: any;
  constructor(private readonly companyService: CompanyService) {
    // this.scraperObject = {
    //   companyService: this.companyService,
    // };
  }

  // scraperObject = {
  count = 0;
  url = 'https://www.dsebd.org/company_listing.php';
  async scraper(browser) {
    const page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    // Navigate to the selected page
    await page.goto(this.url);
    // const scrapedData = [];
    // Wait for the required DOM to be rendered
    const scrapeCurrentPage = async () => {
      await page.waitForSelector('.content');
      const companies = [];
      for (let id = 65; id <= 91; id++) {
        //for id A-Z
        // console.log("ID", String.fromCharCode(id));
        let div_ID: string;
        if (id < 90) {
          div_ID = String.fromCharCode(id);
        } else {
          div_ID = 'Additional';
        }

        const company_code_name = await page.$$eval(
          `div#${div_ID} > div.BodyContent > a.ab1`,
          (company_code_name) => {
            company_code_name = company_code_name.map((el) => {
              return {
                Code: el.textContent,
                Name: el.nextElementSibling.textContent.replace(/[\(\)]/gm, ''),
              };
            });
            return company_code_name;
          },
        );
        if (id == 90) {
          console.log('Code Scraping Done');
        }
        companies.push(...company_code_name);
      }
      // console.log("companies", companies);

      //!========================================== Company Detail Scraping =========================

      // Loop through each of those links, open a new page instance and get the relevant data from them

      let link = '';

      const pagePromise = (code): Promise<CreateCompanyDto> =>
        new Promise(async (resolve, reject) => {
          // let dataObj: CreateCompanyDto = {};
          let dataObj = new CreateCompanyDto();
          const newPage = await browser.newPage();
          // console.log("code", code);
          link = `https://www.dsebd.org/displayCompany.php?name=${code}`;
          await newPage.goto(link);
          // await newPage.waitForSelector('h2.BodyHead.topBodyHead');
          dataObj['code'] = code;
          // console.log('Code : ', code);

          dataObj['name'] = await newPage.$eval(
            'div#section-to-print > h2 > i',
            (text) => text.textContent,
          );

          dataObj['last_agm'] = await newPage.$eval(
            'div.col-sm-6.pull-left > i',
            (text) => text.textContent,
          );

          // console.log("last_agm'"); //!..............................................
          try {
            dataObj = await newPage.$$eval(
              'table#company',
              async (table, obj) => {
                //---------------table-1-Market Information---------------

                // console.log('market'); //!.............................
                let baseElement =
                  table[1].querySelector('tbody > tr').nextElementSibling
                    .nextElementSibling.nextElementSibling.nextElementSibling
                    .nextElementSibling.nextElementSibling;

                obj['market_capitalization_mn'] =
                  baseElement.querySelector(
                    'td',
                  ).nextElementSibling.nextElementSibling.textContent;

                // console.log('market_capitalization_mn'); //!.............................

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
                // console.log('total_outstanding_share'); //!.............................

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

                // console.log('bonus_issued_stock_dividend'); //!.............................
                //---------------table-6-Price Earnings (P/E) Ratio Based on latest Audited Financial Statements---------------

                baseElement = table[6]
                  .querySelector('tbody > tr')
                  .nextElementSibling.querySelector('td');

                let round = 0;
                const row = (base_element) => {
                  round++;
                  const year_row = base_element;
                  if (year_row.nextElementSibling !== null) {
                    row(year_row.nextElementSibling); //!-----------> Recursive Call
                  } else {
                    if (round > 1) {
                      obj['pe'] = year_row.textContent;
                      console.log("obj['pe']", obj['pe']);
                    } else {
                      obj['pe'] = null;
                      console.log("obj['pe']", obj['pe']);
                    }
                  }
                };

                row(baseElement); //!-----------> Function Call

                //---------------table-7-Price Earnings (P/E) Ratio Based on latest Audited Financial Statements---------------

                baseElement =
                  table[7].querySelector('tbody > tr').nextElementSibling
                    .nextElementSibling;
                //!===================================
                let round_1 = 0;
                const row_year = (base_element) => {
                  round_1++;
                  const year_row = base_element;
                  if (year_row.nextElementSibling !== null) {
                    console.log(
                      'Not null.......',
                      year_row.querySelector('td'),
                    );

                    row_year(year_row.nextElementSibling); //!-----------> Recursive Call
                  } else {
                    if (round_1 > 1) {
                      obj['eps'] =
                        year_row.querySelector(
                          'td',
                        ).nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent;
                      console.log("obj['eps']", obj['eps']);
                    } else {
                      obj['eps'] = null;
                      console.log("obj['eps']", obj['eps']);
                    }
                  }
                };

                row_year(baseElement); //!-----------> Function Call

                // console.log('eps'); //!.............................

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

                // console.log('category'); //!.............................

                //-----------------------------Shareholding pattern--------------------------

                const ShareHolding_row = (base_element) => {
                  if (
                    base_element.nextElementSibling.querySelector('td')
                      .textContent != 'Remarks'
                  ) {
                    console.log(
                      'base_element.nextElementSibling.textContent',
                      base_element.nextElementSibling.textContent,
                    );

                    return ShareHolding_row(base_element.nextElementSibling);
                  } else {
                    console.log('base_element__return', base_element);
                    return base_element;
                  }
                };

                const Shareholding = ShareHolding_row(
                  baseElement.nextElementSibling.nextElementSibling,
                )
                  .querySelector('td')
                  .nextElementSibling.querySelector('table > tbody > tr');

                console.log('Shareholding.........', Shareholding);

                const ShareholdingArray = Shareholding.textContent
                  .replace(/\s+/g, ' ')
                  .trim()
                  .split(' ');

                obj['ponsor_director'] = ShareholdingArray[1];
                obj['govt'] = ShareholdingArray[3];
                obj['institute'] = ShareholdingArray[5];
                obj['foreign'] = ShareholdingArray[7];
                obj['_public'] = ShareholdingArray[9];

                // console.log('public....'); //!.............................
                //---------------Shareholding Pattern----------------------

                //---------------------table-12-Address of the Company------------------
                baseElement = table[12].querySelector('tbody > tr');

                const addressArray = baseElement.textContent.trim().split('\n');
                // console.log('addressArray', addressArray.length); //!.............................

                if (addressArray.length > 2) {
                  obj['address'] = addressArray[2].replace(/\s+/g, ' ');

                  // console.log('address'); //!.............................

                  obj['phone'] =
                    baseElement.nextElementSibling.nextElementSibling.querySelector(
                      'td',
                    ).nextElementSibling.textContent;

                  obj['email'] =
                    baseElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.querySelector(
                      'td',
                    ).nextElementSibling.textContent;
                } else {
                  obj['address'] = null;
                  obj['phone'] = null;
                  obj['email'] = null;
                }

                return obj;
              },
              dataObj,
            );
          } catch {
            this.count += 1;
            console.log('error........!!!');
          }

          resolve(dataObj);
          await newPage.close();
        });

      // const com = ['ACMEPL', 'AGRANINS', 'SJIBLPBOND', 'AAMRANET']; //TB10Y0126 TB10Y0126

      for (link in companies) {
        // for (link in com) {
        // let currentPageData: CreateCompanyDto = {};
        let currentPageData = new CreateCompanyDto();
        const regex = /TB[0-9]+Y[0-9]+/i;
        const is_true = regex.test(companies[link].Code);
        // const is_true = regex.test(com[link]);
        if (is_true) {
          continue;
        }
        currentPageData = await pagePromise(companies[link].Code);
        // currentPageData = await pagePromise(com[link]);
        //! ============================================= Database Insertion====================
        const result = await this.companyService.upsertCompanyEntity(
          currentPageData,
        ); // inserting into the database.
        //! ============================================= Database Insertion====================

        // console.log('result', result);
        // console.log('Count', this.count);

        // =============================================
        // scrapedData.push(currentPageData);
      }
    };
    const data = await scrapeCurrentPage();
    // console.log('data...', data);
    // return data;
    // },
  }
}
