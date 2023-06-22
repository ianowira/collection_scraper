
export type Product = {
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

export type GetProductResponse = {
  data: Product[]
}

export type GetProductError = {
  message?: string
  error?: unknown
}

export type ProductResponseData = {
  data?: Product[]
  errors?: GetProductError | unknown
}
