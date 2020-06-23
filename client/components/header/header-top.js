import Link from 'next/link'

export default ({ amount }) => {
  return (
    <div className="header-top">
      <div className="header-top__logo">
        <Link href="/">
          <a className="logo__link">
            MoDo's Design
          </a>
        </Link>
      </div>
      <div className="header-top__search">search</div>
      <div className="header-top__cart">
        <Link href="/cart">
          <a className="cart__link">
            <i className="cart__icon fa fa-shopping-cart"></i>
            <span className="cart__amount">{amount}</span>
          </a>
        </Link>
      </div>
    </div>
  )
}
