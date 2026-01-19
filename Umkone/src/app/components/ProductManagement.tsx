import { useState } from 'react';
import { Product } from '../App';
import { ArrowLeft, Plus, Edit, Trash2, Package } from 'lucide-react';

type ProductManagementProps = {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onBack: () => void;
};

export function ProductManagement({ products, onUpdateProducts, onBack }: ProductManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    sellingPrice: '',
    stock: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Update existing product
      onUpdateProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                unit: formData.unit,
                sellingPrice: parseFloat(formData.sellingPrice),
                stock: parseFloat(formData.stock),
              }
            : p
        )
      );
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        unit: formData.unit,
        sellingPrice: parseFloat(formData.sellingPrice),
        stock: parseFloat(formData.stock),
      };
      onUpdateProducts([...products, newProduct]);
    }

    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      unit: product.unit,
      sellingPrice: product.sellingPrice.toString(),
      stock: product.stock.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      onUpdateProducts(products.filter((p) => p.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', unit: '', sellingPrice: '', stock: '' });
    setEditingProduct(null);
    setShowForm(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl text-gray-800">Manajemen Produk</h1>
              <p className="text-xs text-gray-500">{products.length} produk</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Add Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-blue-600 text-white rounded-2xl p-4 flex items-center justify-center gap-2 mb-4 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Produk Baru</span>
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <h3 className="text-sm text-gray-800 mb-4">
              {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Nama Produk</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="contoh: Kopi Premium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Satuan</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="contoh: Cup, Kg, Buah"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Harga Jual (IDR)</label>
                <input
                  type="number"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="25000"
                  required
                  min="0"
                  step="1"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Stok</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="50"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  {editingProduct ? 'Perbarui' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Product List */}
        <div className="space-y-3">
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Belum ada produk</p>
              <p className="text-xs text-gray-400">Tambahkan produk pertama Anda</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm text-gray-800">{product.name}</h3>
                    <p className="text-xs text-gray-500">Satuan: {product.unit}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Harga Jual</p>
                    <p className="text-sm text-gray-800">{formatCurrency(product.sellingPrice)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Stok</p>
                    <p className="text-sm text-gray-800">{product.stock} {product.unit}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}