import puppeteer from 'puppeteer';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class startBrowserClass {
  async startBrowser() {
    let browser;
    try {
      console.log('Opening the browser......');
      browser = await puppeteer.launch({
        // headless: false,
        headless: true,
        args: ['--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
      });
    } catch (err) {
      console.log('Could not create a browser instance => : ', err);
    }
    return browser;
  }
}
