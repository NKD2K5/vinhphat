'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CartItem, getCart, clearCart } from '@/utils/cart';

const PhanDauTrang = dynamic(() => import('../components/PhanDauTrang/PhanDauTrang'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer/Footer'), { ssr: false });

function parsePrice(priceText: string): number {
  if (!priceText) return 0;
  const match = priceText.match(/[\d.,]+/);
  if (!match) return 0;
  const numStr = match[0].replace(/\./g, '').replace(/,/g, '');
  const n = Number(numStr);
  return Number.isFinite(n) ? n : 0;
}

function formatCurrency(amount: number): string {
  if (!amount) return '';
  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  } catch {
    return `${amount} VND`;
  }
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const cart = getCart();
    if (!cart.length) {
      setItems([]);
      return;
    }
    setItems(cart);
  }, [mounted]);

  const totals = useMemo(() => {
    const numericTotal = items.reduce((sum, item) => {
      const unit = parsePrice(item.priceText);
      return sum + unit * item.quantity;
    }, 0);

    return {
      numericTotal,
      displayText: numericTotal ? formatCurrency(numericTotal) : '',
    };
  }, [items]);

  const cartCreatedAt = useMemo(() => {
    if (!items.length) return null;
    const minTs = Math.min(...items.map((i) => i.addedAt));
    return new Date(minTs).toISOString();
  }, [items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) {
      setError('Giỏ hàng đang trống.');
      return;
    }

    if (!customerName || !customerPhone || !shippingAddress) {
      setError('Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ giao hàng.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const code = `ORD-${Date.now().toString(36).toUpperCase()}`;

      const payload = {
        code,
        customerName,
        customerPhone,
        customerEmail,
        shippingAddress,
        note,
        status: 'pending',
        totalAmount: totals.numericTotal,
        totalAmountText: totals.displayText || 'Liên hệ',
        cartCreatedAt,
        items: items.map((item) => {
          const unit = parsePrice(item.priceText);
          const lineTotal = unit * item.quantity;
          return {
            productId: item.productId,
            productSlug: item.slug,
            productName: item.name,
            productImage: item.image,
            unitPriceText: item.priceText,
            quantity: item.quantity,
            lineTotalText: lineTotal ? formatCurrency(lineTotal) : item.priceText,
          };
        }),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
      }

      clearCart();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (!items.length && !success) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <PhanDauTrang />
        <div className="flex-1 container mx-auto px-4 md:px-8 lg:px-16 pt-24 pb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Giỏ hàng đang trống
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Vui lòng chọn sản phẩm trước khi tiến hành đặt hàng.
            </p>
            <Link
              href="/san-pham"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Xem sản phẩm
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <PhanDauTrang />
        <div className="flex-1 container mx-auto px-4 md:px-8 lg:px-16 pt-24 pb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center max-w-xl mx-auto">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Đặt hàng thành công
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Chúng tôi đã nhận được đơn hàng của bạn. Đội ngũ VinhPhat Printing sẽ liên hệ
              lại trong thời gian sớm nhất để xác nhận thông tin và báo giá chi tiết.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                Về trang chủ
              </button>
              <Link
                href="/san-pham"
                className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold"
              >
                Xem thêm sản phẩm
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <PhanDauTrang />
      <div className="flex-1 container mx-auto px-4 md:px-8 lg:px-16 pt-24 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Thông Tin Đặt Hàng
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Họ và tên *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Địa chỉ giao hàng *
              </label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ghi chú thêm (kích thước, chất liệu, số lượng mong muốn...)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Đang gửi đơn hàng...' : 'Đặt hàng ngay'}
            </button>
          </form>

          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Tóm Tắt Đơn Hàng
            </h2>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 mb-4">
              {items.map((item) => (
                <div key={item.productId} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <div className="flex justify-between text-sm font-medium text-gray-900 dark:text-white">
                    <span className="line-clamp-1">{item.name}</span>
                    <span>x{item.quantity}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Giá: {item.priceText || 'Liên hệ'}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tổng số sản phẩm</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {items.reduce((s, x) => s + x.quantity, 0)}
                </span>
              </div>
              {totals.displayText && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tổng tạm tính</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {totals.displayText}
                  </span>
                </div>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Lưu ý: Giá trên chỉ mang tính tham khảo. Đơn giá thực tế có thể thay đổi theo số
                lượng, chất liệu, quy cách in và các yêu cầu khác. Chúng tôi sẽ liên hệ xác nhận
                và gửi báo giá chính thức sau khi nhận được đơn hàng.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
