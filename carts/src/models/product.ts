import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { Cart } from './cart'
import { ProductSize } from '@admodosdesign/common'

interface ProductAttrs {
  id: string
  name: string
  price: number
  size: ProductSize
  quantity: number
}

export interface ProductDoc extends mongoose.Document {
  name: string
  price: number
  size: ProductSize
  quantity: number
  version: number
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc
  findByEvent(event: { id: string, version: number }): Promise<ProductDoc | null>
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
    size: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
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
// productSchema.pre('save', function(done) {
//   // @ts-ignore
//   this.$where = {
//     version: this.get('version') - 1
//   }

//   done()
// })

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product({
    _id: attrs.id,
    name: attrs.name,
    price: attrs.price,
    size: attrs.size,
    quantity: attrs.quantity
  })
}

productSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Product.findOne({
    _id: event.id,
    version: event.version - 1
  })
}
const Product = mongoose.model<ProductDoc, ProductModel>('Product', productSchema)

export { Product }
