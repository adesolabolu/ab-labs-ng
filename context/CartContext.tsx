'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Template, TEMPLATES } from '@/data/templates';

export interface CartItem {
  template: Template;
  quantity: number;
  setupService: boolean; // Optional turnkey deployment setup (+₦50,000)
}

interface CartContextType {
  items: CartItem[];
  addItem: (template: Template, setupService?: boolean) => void;
  removeItem: (templateId: string) => void;
  toggleSetupService: (templateId: string) => void;
  clearCart: () => void;
  totalCount: number;
  subtotalNgn: number;
  subtotalUsd: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ab_labs_cart');
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        // Default with 1 demo template so the cart is previewable immediately
        const defaultTpl = TEMPLATES[0]; // Lumina Storefront Pro
        if (defaultTpl) {
          setItems([{ template: defaultTpl, quantity: 1, setupService: false }]);
        }
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('ab_labs_cart', JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart to localStorage', e);
      }
    }
  }, [items, isInitialized]);

  const addItem = (template: Template, setupService: boolean = false) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.template.id === template.id);
      if (existing) {
        return prev; // In a digital template marketplace, quantity is typically 1 license per template
      }
      return [...prev, { template, quantity: 1, setupService }];
    });
  };

  const removeItem = (templateId: string) => {
    setItems((prev) => prev.filter((i) => i.template.id !== templateId));
  };

  const toggleSetupService = (templateId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.template.id === templateId ? { ...i, setupService: !i.setupService } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.length;

  const subtotalNgn = items.reduce((sum, item) => {
    const base = item.template.priceNgn;
    const addOn = item.setupService ? 50000 : 0;
    return sum + base + addOn;
  }, 0);

  const subtotalUsd = items.reduce((sum, item) => {
    const base = item.template.priceUsd;
    const addOn = item.setupService ? 35 : 0;
    return sum + base + addOn;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleSetupService,
        clearCart,
        totalCount,
        subtotalNgn,
        subtotalUsd,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
