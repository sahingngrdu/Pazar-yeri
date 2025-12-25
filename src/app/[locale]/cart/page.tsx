'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { Button } from '@/components/atoms/Button';
import { useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils/formatters';
import { DynamicHeader as Header, DynamicFooter as Footer } from '@/components/shared';


export default function CartPage() {
    const t = useTranslations('cart');
    const tNav = useTranslations('nav');

    const items = useCartStore((state) => state.items);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const clearCart = useCartStore((state) => state.clearCart);
    const getSubtotal = useCartStore((state) => state.getSubtotal);
    const getItemCount = useCartStore((state) => state.getItemCount);

    const subtotal = getSubtotal();
    const shippingCost = subtotal >= 500 ? 0 : 29.99;
    const total = subtotal + shippingCost;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 py-8 md:py-12">
                <div className="container-custom">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
                        {t('title')}
                    </h1>

                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-24 h-24 mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <svg
                                    className="w-12 h-12 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {t('empty')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                                {t('emptyDescription')}
                            </p>
                            <Link href="/" className="btn btn-primary px-8">
                                {tNav('home')}
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {getItemCount()} {t('items')}
                                    </span>
                                    <button
                                        onClick={clearCart}
                                        className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                                    >
                                        {t('clearCart')}
                                    </button>
                                </div>

                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
                                    >
                                        {/* Product Image */}
                                        <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                            {item.product.images[0] ? (
                                                <Image
                                                    src={item.product.images[0].url}
                                                    alt={item.product.name}
                                                    width={96}
                                                    height={96}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/products/${item.product.slug}`}
                                                className="font-medium text-gray-900 dark:text-white hover:text-indigo-600 line-clamp-2"
                                            >
                                                {item.product.name}
                                            </Link>

                                            {item.variant.options && item.variant.options.length > 0 && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {item.variant.options.map((opt) => `${opt.title}: ${opt.value}`).join(', ')}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-4 mt-3">
                                                {/* Quantity Selector */}
                                                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg transition-colors"
                                                        aria-label="Azalt"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                        </svg>
                                                    </button>
                                                    <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg transition-colors"
                                                        aria-label="Artır"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-500 hover:text-red-600 transition-colors"
                                                    aria-label="Kaldır"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right">
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                {formatPrice(item.variant.price * item.quantity)}
                                            </span>
                                            {item.quantity > 1 && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatPrice(item.variant.price)} / adet
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        {t('orderSummary')}
                                    </h2>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">{t('subtotal')}</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatPrice(subtotal)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">{t('shipping')}</span>
                                            <span className={`font-medium ${shippingCost === 0 ? 'text-emerald-600' : 'text-gray-900 dark:text-white'}`}>
                                                {shippingCost === 0 ? t('freeShipping') : formatPrice(shippingCost)}
                                            </span>
                                        </div>

                                        {subtotal < 500 && (
                                            <p className="text-xs text-amber-600 dark:text-amber-400">
                                                {formatPrice(500 - subtotal)} daha ekleyin, ücretsiz kargo kazanın!
                                            </p>
                                        )}

                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                                            <div className="flex justify-between">
                                                <span className="font-semibold text-gray-900 dark:text-white">{t('total')}</span>
                                                <span className="font-bold text-lg text-gray-900 dark:text-white">
                                                    {formatPrice(total)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button className="w-full mt-6" size="lg">
                                        {t('checkout')}
                                    </Button>

                                    <Link
                                        href="/"
                                        className="block text-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-4"
                                    >
                                        {t('continueShopping')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
