import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface FavoritesState {
    // Normalized structure for O(1) lookups
    items: Record<string, Product>;
    ids: string[];

    // Actions
    addToFavorites: (product: Product) => void;
    removeFromFavorites: (productId: string | number) => void;
    toggleFavorite: (product: Product) => void;
    isFavorite: (productId: string | number) => boolean;
    clearFavorites: () => void;
    getFavorites: () => Product[];
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            items: {},
            ids: [],

            addToFavorites: (product: Product) => {
                const id = String(product.id);
                set((state) => {
                    if (state.items[id]) return state;
                    return {
                        items: { ...state.items, [id]: product },
                        ids: [...state.ids, id],
                    };
                });
            },

            removeFromFavorites: (productId: string | number) => {
                const id = String(productId);
                set((state) => {
                    const { [id]: removed, ...remainingItems } = state.items;
                    return {
                        items: remainingItems,
                        ids: state.ids.filter((itemId) => itemId !== id),
                    };
                });
            },

            toggleFavorite: (product: Product) => {
                const id = String(product.id);
                const state = get();
                if (state.items[id]) {
                    state.removeFromFavorites(id);
                } else {
                    state.addToFavorites(product);
                }
            },

            isFavorite: (productId: string | number) => {
                const id = String(productId);
                return Boolean(get().items[id]);
            },

            clearFavorites: () => {
                set({ items: {}, ids: [] });
            },

            getFavorites: () => {
                const state = get();
                return state.ids.map((id) => state.items[id]);
            },
        }),
        {
            name: 'favorites-storage',
            partialize: (state) => ({ items: state.items, ids: state.ids }),
        }
    )
);
