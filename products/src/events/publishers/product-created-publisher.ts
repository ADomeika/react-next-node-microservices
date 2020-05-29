import { Publisher, Subjects, ProductCreatedEvent } from '@admodosdesign/common'

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated
}
