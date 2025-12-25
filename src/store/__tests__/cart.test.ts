import { useCartStore } from '../cart';
import type { Product, ProductVariant } from '@/types';

// Mock product
const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    slug: 'test-product',
    description: 'Test description',
    categoryId: 1,
    brandId: 1,
    variants: [
        {
            id: 101,
            productId: 1,
            price: 100,
            stock: 10,
            sku: 'TEST-SKU',
            barcode: '1234567890',
            options: [],
            thumbnails: [],
        },
        {
            id: 102,
            productId: 1,
            price: 150,
            stock: 5,
            sku: 'TEST-SKU-2',
            barcode: '1234567891',
            options: [{ id: 1, title: 'Size', value: 'L' }],
            thumbnails: [],
        },
    ],
    images: [],
    rating: 4.5,
    reviewCount: 10,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
};

describe('useCartStore', () => {
    beforeEach(() => {
        // Clear cart before each test
        useCartStore.getState().clearCart();
    });

    describe('addToCart', () => {
        it('should add a product to the cart', () => {
            const { addToCart, items } = useCartStore.getState();

            addToCart(mockProduct, 1);

            const updatedItems = useCartStore.getState().items;
            expect(updatedItems).toHaveLength(1);
            expect(updatedItems[0].product.id).toBe(1);
            expect(updatedItems[0].quantity).toBe(1);
        });

        it('should use the first variant if no variantId is provided', () => {
            const { addToCart } = useCartStore.getState();

            addToCart(mockProduct, 1);

            const updatedItems = useCartStore.getState().items;
            expect(updatedItems[0].variant.id).toBe(101);
        });

        it('should use the specified variant if variantId is provided', () => {
            const { addToCart } = useCartStore.getState();

            addToCart(mockProduct, 1, 102);

            const updatedItems = useCartStore.getState().items;
            expect(updatedItems[0].variant.id).toBe(102);
        });

        it('should increase quantity if product already exists in cart', () => {
            const { addToCart } = useCartStore.getState();

            addToCart(mockProduct, 1);
            addToCart(mockProduct, 2);

            const updatedItems = useCartStore.getState().items;
            expect(updatedItems).toHaveLength(1);
            expect(updatedItems[0].quantity).toBe(3);
        });

        it('should add as separate item if different variant', () => {
            const { addToCart } = useCartStore.getState();

            addToCart(mockProduct, 1, 101);
            addToCart(mockProduct, 1, 102);

            const updatedItems = useCartStore.getState().items;
            expect(updatedItems).toHaveLength(2);
        });
    });

    describe('removeFromCart', () => {
        it('should remove an item from the cart', () => {
            const { addToCart, removeFromCart } = useCartStore.getState();

            addToCart(mockProduct, 1);
            const itemId = useCartStore.getState().items[0].id;

            removeFromCart(itemId);

            const updatedItems = useCartStore.getState().items;
            expect(updatedItems).toHaveLength(0);
        });
    });

    describe('updateQuantity', () => {
        it('should update the quantity of an item', () => {
            const { addToCart, updateQuantity } = useCartStore.getState();

            addToCart(mockProduct, 1);
            const itemId = useCartStore.getState().items[0].id;

            updateQuantity(itemId, 5);

            const updatedItems = useCartStore.getState().items;
            expect(updatedItems[0].quantity).toBe(5);
        });

        it('should remove item if quantity is less than 1', () => {
            const { addToCart, updateQuantity } = useCartStore.getState();

            addToCart(mockProduct, 2);
            const itemId = useCartStore.getState().items[0].id;

            updateQuantity(itemId, 0);

            const updatedItems = useCartStore.getState().items;
            expect(updatedItems).toHaveLength(0);
        });
    });

    describe('clearCart', () => {
        it('should clear all items from the cart', () => {
            const { addToCart, clearCart } = useCartStore.getState();

            addToCart(mockProduct, 1, 101);
            addToCart(mockProduct, 2, 102);

            expect(useCartStore.getState().items).toHaveLength(2);

            clearCart();

            expect(useCartStore.getState().items).toHaveLength(0);
        });
    });

    describe('getItemCount', () => {
        it('should return the total number of items', () => {
            const { addToCart, getItemCount } = useCartStore.getState();

            addToCart(mockProduct, 2, 101);
            addToCart(mockProduct, 3, 102);

            expect(useCartStore.getState().getItemCount()).toBe(5);
        });

        it('should return 0 for empty cart', () => {
            expect(useCartStore.getState().getItemCount()).toBe(0);
        });
    });

    describe('getSubtotal', () => {
        it('should calculate the correct subtotal', () => {
            const { addToCart } = useCartStore.getState();

            addToCart(mockProduct, 2, 101); // 2 × 100 = 200
            addToCart(mockProduct, 1, 102); // 1 × 150 = 150

            expect(useCartStore.getState().getSubtotal()).toBe(350);
        });

        it('should return 0 for empty cart', () => {
            expect(useCartStore.getState().getSubtotal()).toBe(0);
        });
    });

    describe('getItem', () => {
        it('should return the item by id', () => {
            const { addToCart, getItem } = useCartStore.getState();

            addToCart(mockProduct, 1);
            const itemId = useCartStore.getState().items[0].id;

            const item = useCartStore.getState().getItem(itemId);
            expect(item).toBeDefined();
            expect(item?.product.id).toBe(1);
        });

        it('should return undefined for non-existent item', () => {
            const item = useCartStore.getState().getItem('non-existent');
            expect(item).toBeUndefined();
        });
    });
});
