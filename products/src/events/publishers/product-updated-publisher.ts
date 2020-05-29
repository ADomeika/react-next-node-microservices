import { Publisher, Subjects, ProductUpdatedEvent } from '@admodosdesign/common'

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated
}
