"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Scraper_1 = __importDefault(require("./Controller/Scraper"));
const link = "https://theme-dawn-demo.myshopify.com/collections/all";
const scraper = new Scraper_1.default();
scraper.scrape(link).then(resposne => {
    console.log(resposne);
});
