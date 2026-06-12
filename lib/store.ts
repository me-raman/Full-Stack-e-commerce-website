import { create } from "zustand";
import { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isDrawerOpen: false,

  addItem: (product, size, color) => {
    const items = get().items;
    const existing = items.find(
      (i) => i.product.id === product.id &&
             i.selected_size === size &&
             i.selected_color === color
    );
    if (existing) {
      set({
        items: items.map((i) =>
          i.product.id === product.id &&
          i.selected_size === size &&
          i.selected_color === color
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      });
    } else {
      set({ items: [...items, { product, quantity: 1, selected_size: size, selected_color: color }] });
    }
    get().openDrawer();
  },

  removeItem: (productId, size, color) => {
    set({
      items: get().items.filter(
        (i) => !(i.product.id === productId &&
                 i.selected_size === size &&
                 i.selected_color === color)
      ),
    });
  },

  updateQuantity: (productId, size, color, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId, size, color);
      return;
    }
    set({
      items: get().items.map((i) =>
        i.product.id === productId &&
        i.selected_size === size &&
        i.selected_color === color
          ? { ...i, quantity }
          : i
      ),
    });
  },

  clearCart: () => set({ items: [] }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  getTotalPrice: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
}));
