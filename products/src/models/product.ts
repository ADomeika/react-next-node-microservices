import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { ProductSize } from '@admodosdesign/common'

interface ProductAttrs {
  name: string
  price: number
  description: string
  size: ProductSize
  quantity: number
  additionalInfo?: string
  images?: string[]
}

interface ProductDoc extends mongoose.Document {
  name: string
  price: number
  description: string
  size: ProductSize
  quantity: number
  version: number
  cartId?: string
  images?: string[]
  additionalInfo?: string
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    cartId: {
      type: String
    },
    additionalInfo: {
      type: String
    },
    images: {
      type: [String]
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      }
    }
  }
)

productSchema.set('versionKey', 'version')

productSchema.plugin(updateIfCurrentPlugin)

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs)
}

const Product = mongoose.model<ProductDoc, ProductModel>('Product', productSchema)

export { Product }
