import { useState } from 'react';
import { Product, RawMaterial, ProductMaterial, LaborCost, OverheadCost } from '../App';
import { ArrowLeft, Calculator } from 'lucide-react';

type HPPCalculationProps = {
  products: Product[];
  materials: RawMaterial[];
  productMaterials: ProductMaterial[];
  laborCosts: LaborCost[];
  overheadCosts: OverheadCost[];
  onBack: () => void;
};

export function HPPCalculation({
  products,
  materials,
  productMaterials,
  laborCosts,
  overheadCosts,
  onBack,
}: HPPCalculationProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [productionQuantity, setProductionQuantity] = useState('100');
  const [laborHours, setLaborHours] = useState('8');
  const [selectedLaborId, setSelectedLaborId] = useState<string>(laborCosts[0]?.id || '');
  const [profitMargin, setProfitMargin] = useState('30');

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const selectedLabor = laborCosts.find((l) => l.id === selectedLaborId);

  // Calculate raw material cost
  const productMaterialsList = productMaterials.filter((pm) => pm.productId === selectedProductId);
  const rawMaterialCost = productMaterialsList.reduce((sum, pm) => {
    const material = materials.find((m) => m.id === pm.materialId);
    return sum + (material?.pricePerUnit || 0) * pm.quantity;
  }, 0);

  // Calculate labor cost per unit
  const laborHoursNum = parseFloat(laborHours) || 0;
  const productionQty = parseFloat(productionQuantity) || 1;
  const totalLaborCost = (selectedLabor?.hourlyWage || 0) * laborHoursNum;
  const laborCostPerUnit = totalLaborCost / productionQty;

  // Calculate overhead cost per unit (monthly overhead divided by estimated monthly production)
  const monthlyOverhead = overheadCosts.reduce((sum, o) => {
    let monthlyAmount = o.amount;
    if (o.period === 'daily') monthlyAmount = o.amount * 30;
    if (o.period === 'weekly') monthlyAmount = o.amount * 4;
    return sum + monthlyAmount;
  }, 0);
  const estimatedMonthlyProduction = productionQty * 22; // Assuming 22 working days
  const overheadCostPerUnit = estimatedMonthlyProduction > 0 ? monthlyOverhead / estimatedMonthlyProduction : 0;

  // Calculate HPP
  const hppPerUnit = rawMaterialCost + laborCostPerUnit + overheadCostPerUnit;
  const totalHPP = hppPerUnit * productionQty;

  // Calculate recommended selling price
  const marginPercent = parseFloat(profitMargin) || 0;
  const recommendedPrice = hppPerUnit * (1 + marginPercent / 100);

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
              <h1 className="text-xl text-gray-800">HPP Kalkulator</h1>
              <p className="text-xs text-gray-500">Menghitung Harga Pokok Produksi</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Input Section */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <h3 className="text-sm text-gray-800 mb-4">Detail Produksi</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Pilih Produk</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Banyaknya Produksi</label>
              <input
                type="number"
                value={productionQuantity}
                onChange={(e) => setProductionQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="100"
                min="1"
                step="1"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Jenis Tenaga Kerja</label>
              <select
                value={selectedLaborId}
                onChange={(e) => setSelectedLaborId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                {laborCosts.map((labor) => (
                  <option key={labor.id} value={labor.id}>
                    {labor.jobType} ({formatCurrency(labor.hourlyWage)}/jam)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Jam Kerja (Total)</label>
              <input
                type="number"
                value={laborHours}
                onChange={(e) => setLaborHours(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="8"
                min="0"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Margin Keuntungan yang Diinginkan (%)</label>
              <input
                type="number"
                value={profitMargin}
                onChange={(e) => setProfitMargin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="30"
                min="0"
                step="1"
              />
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <h3 className="text-sm text-gray-800 mb-4">Rincian Biaya per Unit</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-xs text-gray-600">Biaya Bahan Baku</span>
              <span className="text-sm text-gray-800">{formatCurrency(rawMaterialCost)}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-xs text-gray-600">Biaya Tenaga Kerja</span>
              <span className="text-sm text-gray-800">{formatCurrency(laborCostPerUnit)}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-xs text-gray-600">Biaya Overhead</span>
              <span className="text-sm text-gray-800">{formatCurrency(overheadCostPerUnit)}</span>
            </div>

            <div className="flex items-center justify-between py-3 bg-indigo-50 rounded-lg px-3 mt-2">
              <span className="text-sm text-indigo-900">HPP per Unit</span>
              <span className="text-lg text-indigo-900">{formatCurrency(hppPerUnit)}</span>
            </div>
          </div>
        </div>

        {/* Materials Used */}
        {productMaterialsList.length > 0 && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <h3 className="text-sm text-gray-800 mb-3">Bahan yang Digunakan per Unit</h3>
            <div className="space-y-2">
              {productMaterialsList.map((pm) => {
                const material = materials.find((m) => m.id === pm.materialId);
                const cost = (material?.pricePerUnit || 0) * pm.quantity;
                return (
                  <div key={pm.id} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      {material?.name} ({pm.quantity} {material?.unit})
                    </span>
                    <span className="text-gray-800">{formatCurrency(cost)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Total Production Cost */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-4 mb-4 shadow-sm text-white">
          <h3 className="text-sm mb-4">Total Biaya Produksi</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-indigo-100">Banyak Produksi</span>
              <span className="text-sm">{productionQty} units</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-indigo-100">HPP per Unit</span>
              <span className="text-sm">{formatCurrency(hppPerUnit)}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-indigo-500">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total HPP</span>
              <span className="text-2xl">{formatCurrency(totalHPP)}</span>
            </div>
          </div>
        </div>

        {/* Recommended Selling Price */}
        <div className="bg-green-50 rounded-2xl p-4 shadow-sm border border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-green-600" />
            <h3 className="text-sm text-green-900">Harga Jual yang Direkomendasikan</h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-700">HPP per Unit</span>
              <span className="text-green-900">{formatCurrency(hppPerUnit)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-700">Margin Keuntungan ({profitMargin}%)</span>
              <span className="text-green-900">{formatCurrency(hppPerUnit * (marginPercent / 100))}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-green-300">
              <span className="text-sm text-green-900">Harga Jual</span>
              <span className="text-xl text-green-900">{formatCurrency(recommendedPrice)}</span>
            </div>
          </div>

          {selectedProduct && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-700">Harga Jual Saat Ini</span>
                <span className={`text-sm ${selectedProduct.sellingPrice < recommendedPrice ? 'text-red-600' : 'text-green-900'}`}>
                  {formatCurrency(selectedProduct.sellingPrice)}
                </span>
              </div>
              {selectedProduct.sellingPrice < recommendedPrice && (
                <p className="text-xs text-red-600 mt-2">
                  ⚠️ Harga jual saat ini di bawah harga yang direkomendasikan 
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
