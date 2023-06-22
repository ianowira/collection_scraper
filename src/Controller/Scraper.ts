import cheerio from 'cheerio'
import axios from 'axios'

import {
  GetProductResponse,
  ProductResponseData
} from './modules/types'

class Scraper {
  url: URL | undefined
  baseUrl: string | undefined
  total_pages: number

  constructor() {
    this.url = undefined
    this.baseUrl = undefined
    this.total_pages = 1
  }

  buildUrl(link: any): string {
    if (typeof this.baseUrl === 'undefined') return '';
    return this.baseUrl.concat(link)
  }

  getLinks(data: string) {
    const links: string[] = []
    const $ = cheerio.load(data)

    $('.card a').each((index: number, element) => {
      const href = $(element).attr('href')
      const url = this.buildUrl(href)
      
      if (url.length) {
        links.push(url)
      }
    })

    if ($('a.pagination__item.link').length)
      this.total_pages = $('a.pagination__item.link').length

    return links

  }

  async getProducts() {
    try {
      if (typeof this.url === 'undefined') throw new Error("URL is invalid");
      
      const { data } = await axios.request<string>({
        method: 'GET',
        url: this.url.href
      })

      return this.getLinks(data)

    } catch (error) {

      if (axios.isAxiosError(error)) {
        console.error('Error => ', error.message)
        return []
      }

      console.error('Error => ', error)

      return []

    }

  }

  async getProduct(url: string): Promise<ProductResponseData> {

    try {
      const { data } = await axios.request<GetProductResponse>({
        method: 'GET',
        url: `${url}.json`,
        headers: {
          Accept: 'application/json',
        }
      })

      return data

    } catch (error) {

      if (axios.isAxiosError(error)) {
        console.error('Error fetching product => ', error.message)
        return {
          errors: {
            message: error.message
          }
        }
      }

      console.error('Error fetching product => ', error)

      return {
        errors: error
      }

    }

  }

  async scrape(url: string) {

    this.url = new URL(url)
    this.baseUrl = this.url.origin

    console.log('Fetching Products...');

    const products = await this.getProducts()
    const product_data: object[] = []

    console.log('Total pages => ', this.total_pages)

    for (let i = 0; i < products.length; i++) {
      const product_url = products[i];

      const product = await this.getProduct(product_url)

      if (!product.errors) {
        product_data.push(product)
      }

    }

    return product_data
  }

}

export default new Scraper
