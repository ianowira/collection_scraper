import Scraper from "./Controller/Scraper"

const link = "https://theme-dawn-demo.myshopify.com/collections/all"

Scraper.scrape(link).then(products => {
  console.log(products)
})
