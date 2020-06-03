import Link from 'next/link'

import Instagram from './svgs/instagram'
import Facebook from './svgs/facebook'
import Gmail from './svgs/gmail'

import ShoppingCart from './svgs/shopping-cart'
import Search from './svgs/search'

export default ({ cart }) => {
  const amount = cart && cart.products ? cart.products.length : 0
  const socialLinks = [{
    href: 'https://www.instagram.com/modosdesign/',
    image: <Instagram />
  }, {
    href: 'https://www.facebook.com/MoDosDesign/',
    image: <Facebook />
  }, {
    href: 'mailto:modos.design.info@gmail.com',
    image: <Gmail />
  }]
    .map(({ href, image }) => (
      <a
        key={href}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        className="social-link"
      >{image}</a>
    ))

  const links = [
    { label: 'Sign Up', href: '/auth/signup' },
    { label: 'Sign In', href: '/auth/signin' },
    { label: 'Shop', href: '/shop' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' }
  ]
    .map(({ label, href }) => (
      <li key={label} className="nav-item">
        <Link href={href}>
          <a className="nav-link">{label}</a>
        </Link>
      </li>
    ))

  return (
    <header className="header">
      <div className="container">
        <div className="header-top">
          <div className="header-social-links">
            {socialLinks}
          </div>
          <div className="header-brand">
            <Link href="/">
              <a>MoDo's Design</a>
            </Link>
          </div>
          <div className="header-widgets">
            <div className="header-widget">
              <Search />
            </div>
            <div className="header-widget">
              <Link href="/cart">
                <a>
                  <ShoppingCart amount={amount} />
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div className="header-bottom">
          <nav role="mobile-navigation" className="mobile-navigation">
            <div className="mobile-menu-toggle">
              <input type="checkbox" />
              <span></span>
              <span></span>
              <span></span>
              <ul className="mobile-menu">
                {links}
              </ul>
            </div>
          </nav>
          <nav className="navigation">
            <ul className="menu">
              {links}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
