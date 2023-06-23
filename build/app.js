"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const Scraper_1 = __importDefault(require("./Controller/Scraper"));
const Shopify_1 = __importDefault(require("./Controller/Shopify"));
const link = "https://theme-dawn-demo.myshopify.com/collections/all";
function go() {
    return __awaiter(this, void 0, void 0, function* () {
        const products = yield Scraper_1.default.scrape(link);
        products.forEach(product => {
            Shopify_1.default.create_product(product);
        });
    });
}
go();
