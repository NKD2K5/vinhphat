'use client';

import { useState, useEffect } from 'react';
import { ProductsAPI, UploadAPI, Product } from '@/lib/csharpApi';

export default function ProductsCSharpPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    stock: 0,
  });
  const [uploading, setUploading] = useState(false);

  // Load products
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductsAPI.getAll();
      setProducts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await UploadAPI.uploadImage(file, 'products');
      
      if (result.success && result.secureUrl) {
        setFormData({ ...formData, imageUrl: result.secureUrl });
        alert('✅ Upload ảnh thành công!');
      } else {
        alert('❌ Lỗi: ' + result.error);
      }
    } catch (err: any) {
      alert('❌ Lỗi upload: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProduct?.id) {
        await ProductsAPI.update(editingProduct.id, formData);
        alert('✅ Cập nhật sản phẩm thành công!');
      } else {
        await ProductsAPI.create(formData);
        alert('✅ Tạo sản phẩm thành công!');
      }
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        category: '',
        stock: 0,
      });
      setEditingProduct(null);
      setShowForm(false);
      loadProducts();
    } catch (err: any) {
      alert('❌ Lỗi: ' + err.message);
    }
  };

  // Handle edit
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    
    try {
      await ProductsAPI.delete(id);
      alert('✅ Xóa sản phẩm thành công!');
      loadProducts();
    } catch (err: any) {
      alert('❌ Lỗi: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">⏳ Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản Lý Sản Phẩm (C# API)</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingProduct(null);
            setFormData({
              name: '',
              description: '',
              price: 0,
              imageUrl: '',
              category: '',
              stock: 0,
            });
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? '❌ Đóng' : '➕ Thêm Sản Phẩm'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          ❌ Lỗi: {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white border rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">
            {editingProduct ? '✏️ Sửa Sản Phẩm' : '➕ Thêm Sản Phẩm Mới'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Tên sản phẩm</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded px-3 py-2"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-2">Giá (VNĐ)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Danh mục</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Số lượng</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Ảnh sản phẩm</label>
              <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                className="w-full border rounded px-3 py-2"
                disabled={uploading}
              />
              {uploading && <p className="text-blue-600 mt-2">⏳ Đang upload...</p>}
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="mt-2 max-w-xs rounded border"
                />
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                disabled={uploading}
              >
                💾 {editingProduct ? 'Cập Nhật' : 'Tạo Mới'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
            <p className="text-lg font-semibold text-blue-600 mb-2">
              {product.price.toLocaleString('vi-VN')} VNĐ
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Danh mục: {product.category} | Còn: {product.stock}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                ✏️ Sửa
              </button>
              <button
                onClick={() => product.id && handleDelete(product.id)}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                🗑️ Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          Chưa có sản phẩm nào. Hãy thêm sản phẩm mới!
        </div>
      )}
    </div>
  );
}
