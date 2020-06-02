import Link from 'next/link'
import ShoppingCart from '../styles/components/svgs/shopping-cart'
import Search from '../styles/components/svgs/search'

export default ({ currentUser }) => {
  const socialIcons = [

  ]
    .map(({ icon, href }) => (
      <div>
      </div>
    ))

  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
  ]
    .map(({ label, href }) => (
      <li key={label} className="nav-item">
        <Link href={href}>
          <a className="nav-link">{label}</a>
        </Link>
      </li>
    ))

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <div>
          <ShoppingCart />
        </div>
        <Link href="/">
          <a className="navbar-brand">MoDo's Design</a>
        </Link>
        <div>
          <Search />
          <ShoppingCart />
        </div>
      </div>
      <div className="navbar-bottom">
        <ul className="nav d-flex align-items-center">
          {links}
        </ul>
      </div>
    </nav>
  )
}
