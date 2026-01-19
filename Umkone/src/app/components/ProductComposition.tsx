import { useState } from 'react';
import { Product, RawMaterial, ProductMaterial } from '../App';
import { ArrowLeft, Plus, Trash2, Package } from 'lucide-react';

type ProductCompositionProps = {
  products: Product[];
  materials: RawMaterial[];
  productMaterials: ProductMaterial[];
  onUpdateProductMaterials: (productMaterials: ProductMaterial[]) => void;
  onBack: () => void;
};

export function ProductComposition({
  products,
  materials,
  productMaterials,
  onUpdateProductMaterials,
  onBack,
}: ProductCompositionProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    materialId: '',
    quantity: '',
  });

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const productMaterialsList = productMaterials.filter((pm) => pm.productId === selectedProductId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProductMaterial: ProductMaterial = {
      id: Date.now().toString(),
      productId: selectedProductId,
      materialId: formData.materialId,
      quantity: parseFloat(formData.quantity),
    };

    onUpdateProductMaterials([...productMaterials, newProductMaterial]);
    setFormData({ materialId: '', quantity: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus bahan dari produk?')) {
      onUpdateProductMaterials(productMaterials.filter((pm) => pm.id !== id));
    }
  };

  const getMaterialName = (materialId: string) => {
    return materials.find((m) => m.id === materialId)?.name || '';
  };

  const getMaterialUnit = (materialId: string) => {
    return materials.find((m) => m.id === materialId)?.unit || '';
  };

  const getMaterialPrice = (materialId: string) => {
    return materials.find((m) => m.id === materialId)?.pricePerUnit || 0;
  };

  const calculateMaterialCost = (materialId: string, quantity: number) => {
    const price = getMaterialPrice(materialId);
    return price * quantity;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalMaterialCost = productMaterialsList.reduce(
    (sum, pm) => sum + calculateMaterialCost(pm.materialId, pm.quantity),
    0
  );

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
              <h1 className="text-xl text-gray-800">Komposisi Produk</h1>
              <p className="text-xs text-gray-500">Hubungkan bahan ke produk</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Product Selector */}
        <div className="mb-4">
          <label className="block text-xs text-gray-600 mb-2">Pilih Produk</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full px-3 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Info */}
        {selectedProduct && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-800">{selectedProduct.name}</h3>
                <p className="text-xs text-gray-500">
                  {selectedProduct.unit} • {formatCurrency(selectedProduct.sellingPrice)}
                </p>
              </div>
            </div>
            {productMaterialsList.length > 0 && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">Total Biaya Bahan per Unit</p>
                <p className="text-lg text-gray-800">{formatCurrency(totalMaterialCost)}</p>
              </div>
            )}
          </div>
        )}

        {/* Add Material Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-orange-600 text-white rounded-2xl p-4 flex items-center justify-center gap-2 mb-4 hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Bahan</span>
          </button>
        )}

        {/* Add Material Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <h3 className="text-sm text-gray-800 mb-4">Tambah Bahan ke Produk</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Pilih Bahan</label>
                <select
                  value={formData.materialId}
                  onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  required
                >
                  <option value="">Pilih bahan</option>
                  {materials
                    .filter(
                      (m) => !productMaterialsList.some((pm) => pm.materialId === m.id)
                    )
                    .map((material) => (
                      <option key={material.id} value={material.id}>
                        {material.name} ({material.unit})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Jumlah per Unit Produk
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  placeholder="0.02"
                  required
                  min="0"
                  step="0.001"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ materialId: '', quantity: '' });
                    setShowForm(false);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
                >
                  Tambah
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Materials List */}
        <div className="space-y-3">
          <h3 className="text-sm text-gray-600">Bahan yang Digunakan</h3>
          {productMaterialsList.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Belum ada bahan</p>
              <p className="text-xs text-gray-400">Tambahkan bahan ke produk ini</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Bahan</th>
                    <th className="px-4 py-3 text-right text-xs text-gray-600">Jml</th>
                    <th className="px-4 py-3 text-right text-xs text-gray-600">Biaya</th>
                    <th className="px-4 py-3 text-right text-xs text-gray-600"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productMaterialsList.map((pm) => (
                    <tr key={pm.id}>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-800">{getMaterialName(pm.materialId)}</p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="text-sm text-gray-800">
                          {pm.quantity} {getMaterialUnit(pm.materialId)}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="text-sm text-gray-800">
                          {formatCurrency(calculateMaterialCost(pm.materialId, pm.quantity))}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(pm.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
