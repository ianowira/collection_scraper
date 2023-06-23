import Shopify from 'shopify-api-node'

const handleize = function (str: string): string {
  str = str.toLowerCase()

  const toReplace = ['"', "'", "\\", "(", ")", "[", "]"]

  toReplace.map((char) => {
    str = str.replace(char, "")
  })

  str = str.replace(/\W+/g, "-")

  if (str.charAt(str.length - 1) == "-") str = str.replace(/-+\z/, "")

  if (str.charAt(0) == "-") str = str.replace(/\A-+/, "")

  return str
}

const shopify = new Shopify({
  shopName: process.env.SHOPIFY_SHOP_NAME || '',
  accessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || ''
})

type imageData = {
  id?: number
  src?: string
}

type optionData = {
  name: string
  values: string[]
}

type variantData = {
  title: string | null
  option1: string | null
  option2: string | null
  option3: string | null
  price: string
  compare_at_price: string | null
  sku: string
  weight: number
  weight_unit: string
}

type ProductData = {
  title: string,
  body_html: string
  vendor: string
  product_type: string
  handle: string
  tags: string
  variants: variantData[]
  options: optionData[]
  images: object[]
  image: imageData
}

class Product {
  title: string
  body_html: string
  vendor: string
  product_type: string
  handle: string
  tags: string
  variants: variantData[]
  options: optionData[]
  images: object[]
  image: imageData

  constructor(product: ProductData) {
    this.title = product.title || ''
    this.body_html = product.body_html || ''
    this.vendor = product.vendor || ''
    this.product_type = product.product_type || ''
    this.handle = product.handle || ''
    this.tags = product.tags || ''
    this.variants = []
    this.options = []
    this.images = []
    this.image = {
      src: product.image.src
    }

    this.format_images(product.images)
    this.format_options(product.options)
    this.format_variants(product.variants)
  }

  format_variants(variants: variantData[] | undefined) {
    if (typeof variants === 'undefined') return

    const v = []

    for (let i = 0; i < Object.keys(variants).length; i++) {
      const variant = variants[i]

      v.push({
        title: variant.title,
        option1: variant.option1,
        option2: variant.option2,
        option3: variant.option2,
        price: variant.price,
        compare_at_price: variant.compare_at_price,
        sku: variant.sku,
        weight: variant.weight,
        weight_unit: variant.weight_unit,
      })
    }

    this.variants = v
  }

  format_images(images: object[] | undefined): void {

    if (typeof images === 'undefined') return

    const sanitised_images: object[] = []

    for (let i = 0; i < Object.keys(images).length; i++) {
      const image: any = images[i]
      const image_obj = {
        src: image.src
      }

      sanitised_images.push(image_obj)
    }

    this.images = sanitised_images

  }

  format_options(options: optionData[]): void {
    if (typeof options === 'undefined') return

    const opt = []

    for (let i = 0; i < Object.keys(options).length; i++) {
      const option = options[i];

      opt.push({
        name: option.name,
        values: option.values
      })
    }

    this.options = opt
  }

}

class Shop {
  constructor() { }

  async create_product(imported_product: any) {

    try {

      const product = new Product(imported_product)

      console.log(`Creating ${product.title} product`)

      const create_product_response = await shopify.product.create(product)
      const product_variants = create_product_response.variants

      for (let i = 0; i < product_variants.length; i++) {
        const variant = product_variants[i];
        const handle = handleize(variant.title)
        const images: imageData[] = []

        create_product_response.images.map((image: any, index): void => {
          if (image.src.includes(handle)) images.push(create_product_response.images[index])
        })

        if (images.length) {
          console.log('Updating variant images...')
          let first_image: imageData = images[0]
          shopify.productVariant.update(variant.id, {
            image_id: first_image.id
          })
        }
      }

    } catch (error: unknown) {
      if (typeof error === 'string') {
        console.error('Error updating variant => ', error)
        return
      }

      if (error instanceof Error) {
        console.error('Error updating variant => ', error.message)
        return
      }

      console.error('Unknown error updating variant')
    }

  }
}

export default new Shop
