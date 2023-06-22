import cheerio from 'cheerio'
import axios from 'axios'

const baseUrl = 'https://theme-dawn-demo.myshopify.com'

let total_pages = 1

function buildUrl(link: any): string {
  return baseUrl.concat(link)
}

function getLinks(data: string) {
  const links: string[] = []
  const $ = cheerio.load(data)

  $('.card a').each((index: number, element) => {
    const href = $(element).attr('href')
    const url = buildUrl(href)
    links.push(url)
  })

  if ($('a.pagination__item.link').length)
    total_pages = $('a.pagination__item.link').length

  return links

}

async function getProducts(page?: number | string) {
  try {
    const { data } = await axios.request<string>({
      method: 'GET',
      url: `${baseUrl}/collections/all${page ? '?page=' + page : ''}`
    })

    return getLinks(data)

  } catch (error) {

    if (axios.isAxiosError(error)) {
      console.error('Error => ', error.message)
      return []
    }

    console.error('Error => ', error)

    return []

  }

}

type Product = {
  id: number
  title: string
  body_html: string
  vendor: string
  product_type: string
  created_at: string
  handle: string
  updated_at: string
  published_at: string
  template_suffix: string
  published_scope: string
  tags: string
  varaints: object[]
  options: object[]
  images: object[]
  image: object
}

type GetProductResponse = {
  data: Product[]
}

type GetProductError = {
  message?: string
  error?: unknown
}

type ProductResponseData = {
  data?: Product[]
  errors?: GetProductError | unknown
}

async function getProduct(url: string): Promise<ProductResponseData> {
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

async function scrape() {

  console.log('Fetching Products...');
  
  const products = await getProducts()
  const product_data: object[] = []

  console.log('Total pages => ', total_pages)

  for (let i = 0; i < products.length; i++) {
    const product_url = products[i];

    const product = await getProduct(product_url)

    if (!product.errors) {
      product_data.push(product)
    }

  }

  console.log(product_data);

}

scrape()
