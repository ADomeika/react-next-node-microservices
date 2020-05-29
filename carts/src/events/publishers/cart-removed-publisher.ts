import { Publisher, Subjects, CartRemovedEvent } from '@admodosdesign/common'

export class CartRemovedPublisher extends Publisher<CartRemovedEvent> {
  subject: Subjects.CartRemoved = Subjects.CartRemoved
}
