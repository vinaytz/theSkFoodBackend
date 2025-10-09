import { useCartStore } from '@/store/cartStore';
import { CartItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const useCart = () => {
  const {
    items,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    setCartOpen,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  const createCartItem = (
    mealType: 'lunch' | 'dinner',
    sabjisSelected: string[],
    base: 'roti' | 'roti+rice' | 'rice',
    extraRoti: number,
    isSpecial: boolean,
    basePrice: number,
    quantity: number = 1
  ): CartItem => {
    const specialPrice = isSpecial ? 20 : 0;
    const rotiPrice = extraRoti * 10;
    const itemPrice = basePrice + specialPrice + rotiPrice;

    return {
      id: uuidv4(),
      mealType,
      sabjisSelected,
      base,
      extraRoti,
      isSpecial,
      quantity,
      basePrice,
      totalPrice: itemPrice,
    };
  };

  const addMealToCart = (
    mealType: 'lunch' | 'dinner',
    sabjisSelected: string[],
    base: 'roti' | 'roti+rice' | 'rice',
    extraRoti: number,
    isSpecial: boolean,
    basePrice: number,
    quantity: number = 1
  ) => {
    const cartItem = createCartItem(
      mealType,
      sabjisSelected,
      base,
      extraRoti,
      isSpecial,
      basePrice,
      quantity
    );
    addItem(cartItem);
  };

  const getCartSummary = () => {
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    const deliveryFee = totalPrice > 0 ? 20 : 0;
    const tax = Math.round(totalPrice * 0.05); // 5% tax
    const grandTotal = totalPrice + deliveryFee + tax;

    return {
      totalItems,
      subtotal: totalPrice,
      deliveryFee,
      tax,
      grandTotal,
    };
  };

  return {
    items,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    setCartOpen,
    getTotalItems,
    getTotalPrice,
    addMealToCart,
    getCartSummary,
  };
};