'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { CartItem, getCart, updateItemQuantity, removeItemFromCart } from '@/utils/cart';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setItems(getCart());
  }, [mounted]);

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromCart(productId);
    } else {
      updateItemQuantity(productId, quantity);
    }
    setItems(getCart());
  };

  const handleRemove = (productId: string) => {
    removeItemFromCart(productId);
    setItems(getCart());
  };

  if (!mounted) {
    return null;
  }

  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">

      <div className="flex-1 container mx-auto px-4 md:px-8 lg:px-16 pt-20 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Giỏ Hàng Của Bạn
        </h1>

        {isEmpty ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🧺</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Giỏ hàng đang trống
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Hãy xem các sản phẩm của chúng tôi và thêm vào giỏ hàng để đặt in.
            </p>
            <Link
              href="/san-pham"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Xem sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 flex gap-4 items-center"
                >
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={item.image || 'https://placehold.co/200x200/e2e8f0/64748b?text=No+Image'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <Link
                      href={`/san-pham/${item.slug}`}
                      className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Đơn giá: <span className="font-semibold">{item.priceText || 'Liên hệ'}</span>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.productId, Number(e.target.value) || 1)
                          }
                          className="w-14 h-8 text-center border-x border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.productId)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-28">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Thông Tin Đơn Hàng
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Tổng số sản phẩm: <strong>{items.reduce((s, x) => s + x.quantity, 0)}</strong>
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                  Giá in có thể thay đổi tùy thuộc vào số lượng, chất liệu và yêu cầu cụ thể.
                  Sau khi bạn gửi đơn hàng, chúng tôi sẽ liên hệ để tư vấn chi tiết và báo giá
                  chính xác.
                </p>

                <button
                  type="button"
                  onClick={() => router.push('/checkout')}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors mb-3"
                >
                  Tiếp tục đặt hàng
                </button>

                <Link
                  href="/san-pham"
                  className="block w-full text-center py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
                >
                  Tiếp tục xem sản phẩm
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
