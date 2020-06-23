import Link from 'next/link'

export default () => {
  return (
    <section className="hero-section">
      <div className="hero__image">
      
      </div>
      <div className="hero__description">
        <h1 className="title">Unique Clothing</h1>
        <p className="subtitle">For everyone!</p>
        <Link href="/shop">
          <a className="call-to-action">Shop Now</a>
        </Link>
      </div>
    </section>
  )
}
