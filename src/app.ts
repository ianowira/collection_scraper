import 'dotenv/config'

import Scraper from "./Controller/Scraper"
import Shop from './Controller/Shopify'

const link = "https://theme-dawn-demo.myshopify.com/collections/all"

async function go() {

  const products = await Scraper.scrape(link)

  products.forEach(product => {
    Shop.create_product(product)
  })
}

go()
