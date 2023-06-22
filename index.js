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
const cheerio_1 = __importDefault(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
const baseUrl = 'https://theme-dawn-demo.myshopify.com';
let total_pages = 1;
function buildUrl(link) {
    return baseUrl.concat(link);
}
function getLinks(data) {
    const links = [];
    const $ = cheerio_1.default.load(data);
    $('.card a').each((index, element) => {
        const href = $(element).attr('href');
        const url = buildUrl(href);
        links.push(url);
    });
    if ($('a.pagination__item.link').length)
        total_pages = $('a.pagination__item.link').length;
    return links;
}
function getProducts(page) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data } = yield axios_1.default.request({
                method: 'GET',
                url: `${baseUrl}/collections/all${page ? '?page=' + page : ''}`
            });
            return getLinks(data);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error('Error => ', error.message);
                return [];
            }
            console.error('Error => ', error);
            return [];
        }
    });
}
function getProduct(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data } = yield axios_1.default.request({
                method: 'GET',
                url: `${url}.json`,
                headers: {
                    Accept: 'application/json',
                }
            });
            return data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error('Error fetching product => ', error.message);
                return {
                    errors: {
                        message: error.message
                    }
                };
            }
            console.error('Error fetching product => ', error);
            return {
                errors: error
            };
        }
    });
}
function performScraping() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Fetching Products...');
        const products = yield getProducts();
        const product_data = [];
        console.log('Total products => ', total_pages);
        for (let i = 0; i < products.length; i++) {
            const product_url = products[i];
            const product = yield getProduct(product_url);
            if (!product.errors) {
                product_data.push(product);
            }
        }
        console.log(product_data);
    });
}
performScraping();
