import Link from 'next/link'

import HeaderTop from './header/header-top'
import Navigation from './header/navigation'

export default ({ cart }) => {
  const amount = cart && cart.products ? cart.products.length : 0

  return (
    <header className="header">
      <HeaderTop amount={amount} />
      <Navigation />
    </header>
  )
}
