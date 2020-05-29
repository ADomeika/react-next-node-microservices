import { Publisher, Subjects, CartCreatedEvent } from '@admodosdesign/common'

export class CartCreatedPublisher extends Publisher<CartCreatedEvent> {
  subject: Subjects.CartCreated = Subjects.CartCreated
}
