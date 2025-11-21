import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  locationId: string;
  locationName: string;
  locationImage: string;
  
  // THÊM 2 DÒNG NÀY
  productId?: number;     // ID sản phẩm cụ thể
  productName?: string;   // Tên sản phẩm (VD: Phòng Deluxe)
  category: string;

  checkInDate: string;
  checkOutDate: string | null; // Null nếu là nhà hàng/vé
  numGuests: number;
  quantity: number; // Số lượng sản phẩm (ví dụ 2 phòng, 5 vé)
  
  specialReq?: string;
  unitPrice: number; // Giá đơn vị
  totalPrice: number; // Tổng tiền của item này
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vivuviet_cart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('vivuviet_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems(prev => [...prev, item]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('vivuviet_cart');
  };

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const getItemCount = () => {
    return items.length;
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, getTotalAmount, getItemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
