import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, ProductVariant } from '@/types';

// Simplified CartItem type for the store
interface StoreCartItem {
    id: string; // composed of productId-variantId
    product: Product;
    variant: ProductVariant;
    quantity: number;
}

interface CartState {
    items: StoreCartItem[];
    // Actions
    addToCart: (product: Product, quantity?: number, variantId?: number) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getSubtotal: () => number;
    getItem: (itemId: string) => StoreCartItem | undefined;
}

// Generate unique item ID
function generateItemId(productId: number, variantId: number): string {
    return `${productId}-${variantId}`;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addToCart: (product, quantity = 1, variantId) => {
                const variant = variantId
                    ? product.variants.find((v) => v.id === variantId)
                    : product.variants[0];

                if (!variant) return;

                const itemId = generateItemId(product.id, variant.id);

                set((state) => {
                    const existingItem = state.items.find((item) => item.id === itemId);

                    if (existingItem) {
                        // Update quantity if item exists
                        return {
                            items: state.items.map((item) =>
                                item.id === itemId
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            ),
                        };
                    }

                    // Add new item
                    const newItem: StoreCartItem = {
                        id: itemId,
                        product,
                        variant,
                        quantity,
                    };

                    return { items: [...state.items, newItem] };
                });
            },

            removeFromCart: (itemId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== itemId),
                }));
            },

            updateQuantity: (itemId, quantity) => {
                if (quantity < 1) {
                    get().removeFromCart(itemId);
                    return;
                }

                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === itemId ? { ...item, quantity } : item
                    ),
                }));
            },

            clearCart: () => {
                set({ items: [] });
            },

            getItemCount: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getSubtotal: () => {
                return get().items.reduce(
                    (total, item) => total + item.variant.price * item.quantity,
                    0
                );
            },

            getItem: (itemId) => {
                return get().items.find((item) => item.id === itemId);
            },
        }),
        {
            name: 'pazaryeri-cart',
        }
    )
);
