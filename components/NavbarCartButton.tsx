'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function NavbarCartButton() {
  const { totalCount } = useCart();

  return (
    <Link
      href="/cart"
      className="cart-button-wrapper inline-block"
      aria-label="View Cart"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        textDecoration: 'none',
        position: 'relative',
        cursor: 'pointer'
      }}
    >
      <img
        src="/assets/6ab9f95d525e130282d24a88_cart-icon%20(2).svg"
        loading="lazy"
        alt="Shopping cart"
        className="cart-icon"
      />
      <div
        className="cart-number"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '18px',
          height: '18px',
          borderRadius: '999px',
          fontSize: '11px',
          fontWeight: 700
        }}
      >
        {totalCount}
      </div>
    </Link>
  );
}
