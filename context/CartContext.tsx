import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useAuth } from './AuthContext';

type CartItem = {
  productId: number;
  variantId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  increaseQuantity: (variantId: number) => void;
  decreaseQuantity: (variantId: number) => void;
  removeFromCart: (variantId: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  loading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'APP_CART_STORAGE';

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const API_BASE = 'http://192.168.100.101:8000/api';
    const { token } = useAuth();

    // -----------------------------
    // 1️⃣ Load cart from storage on app start
    // -----------------------------
    useEffect(() => {
        const loadCart = async () => {
        try {
            const storedCart = await AsyncStorage.getItem(STORAGE_KEY);

            if (storedCart) {
            setCart(JSON.parse(storedCart));
            }
        } catch (error) {
            console.log('Failed to load cart:', error);
        } finally {
            setLoading(false);
        }
        };

        loadCart();
    }, []);

    // -----------------------------
    // 2️⃣ Save cart whenever it changes
    // -----------------------------
    useEffect(() => {
        const saveCart = async () => {
        try {
            await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(cart)
            );
        } catch (error) {
            console.log('Failed to save cart:', error);
        }
        };

        if (!loading) {
        saveCart();
        }
    }, [cart, loading]);

    // -----------------------------
    // 3️⃣ Cart Logic
    // -----------------------------
    const addToCart = async (item: CartItem) => {
        try {
            const res = await fetch(`${API_BASE}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_id: item.productId,
                variant_id: item.variantId,
                quantity: 1,
            }),
            });

            const data = await res.json();
            setCart(data.cart);
        } catch (err) {
            console.log('Add failed', err);
        }
    };


    const syncCartFromServer = async () => {
        try {
            const res = await fetch(`${API_BASE}/cart`);
            const data = await res.json();
            setCart(data.cart);
        } catch (err) {
            console.log('Sync failed', err);
        }
    };

    useEffect(() => {
     syncCartFromServer();
    }, []);


    const increaseQuantity = async (variantId: number) => {
        try {
            const res = await fetch(`${API_BASE}/cart/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                variant_id: variantId,
                action: 'increase',
            }),
            });

            const data = await res.json();
            setCart(data.cart);
        } catch (err) {
            console.log('Update failed', err);
        }
    };


    const decreaseQuantity = (variantId: number) => {
        setCart((prevCart) =>
        prevCart
            .map((item) =>
            item.variantId === variantId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0)
        );
    };

  const removeFromCart = (variantId: number) => {
        setCart((prevCart) =>
        prevCart.filter((item) => item.variantId !== variantId)
        );
    };

    const clearCart = () => {
        setCart([]);
    };

  // -----------------------------
  // 4️⃣ Derived values
  // -----------------------------
    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

   return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}