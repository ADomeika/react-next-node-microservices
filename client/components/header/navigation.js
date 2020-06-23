import { useState } from 'react'
import Link from 'next/link'

export default () => {
  const [isOpen, setIsOpen] = useState(false)

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
    <nav className="menu">
      <div
        className={`nav-icon ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  )
}
