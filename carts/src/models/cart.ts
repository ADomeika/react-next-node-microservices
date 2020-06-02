import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface CartAttrs {
  userId: string
  expiresAt: Date
  products: {
    product: string,
    quantity: number
  }[]
}

interface CartDoc extends mongoose.Document {
  userId: string
  expiresAt: Date
  products: {
    product: string,
    quantity: number
  }[]
  version: number
}

interface CartModel extends mongoose.Model<CartDoc> {
  build(attrs: CartAttrs): CartDoc
}

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date
    },
    products: [{
      _id: false,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }]
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

cartSchema.set('versionKey', 'version')

cartSchema.plugin(updateIfCurrentPlugin)

cartSchema.statics.build = (attrs: CartAttrs) => {
  return new Cart(attrs)
}

const Cart = mongoose.model<CartDoc, CartModel>('Cart', cartSchema)

export { Cart }
