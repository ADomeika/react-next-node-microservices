export default ({ amount }) => (
  <div className="shopping-cart-holder">
    <svg className="header-icon" viewBox="0 0 64 64">
      <g fill="none" stroke="#000" strokeWidth="3">
        <path d="M25 26c0-15.79 3.57-20 8-20s8 4.21 8 20"></path>
        <path d="M14.74 18h36.51l3.59 36.73h-43.7z"></path>
      </g>
    </svg>
    <div className="shopping-cart-amount">{amount}</div>
  </div>
)
