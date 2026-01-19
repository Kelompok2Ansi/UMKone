import { useState } from 'react';
import { Product, RawMaterial, ProductMaterial, Income, Expense } from '../App';
import { ArrowLeft, Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

type ReportsProps = {
  products: Product[];
  materials: RawMaterial[];
  productMaterials: ProductMaterial[];
  incomes: Income[];
  expenses: Expense[];
  onBack: () => void;
};

export function Reports({
  products,
  materials,
  productMaterials,
  incomes,
  expenses,
  onBack,
}: ReportsProps) {
  const [reportPeriod, setReportPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [activeTab, setActiveTab] = useState<'summary' | 'hpp'>('summary');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate period data
  const now = new Date();
  const periodStart = new Date();
  
  if (reportPeriod === 'week') {
    periodStart.setDate(now.getDate() - 7);
  } else if (reportPeriod === 'month') {
    periodStart.setMonth(now.getMonth() - 1);
  } else {
    periodStart.setFullYear(now.getFullYear() - 1);
  }

  const periodIncomes = incomes.filter((i) => new Date(i.date) >= periodStart);
  const periodExpenses = expenses.filter((e) => new Date(e.date) >= periodStart);

  const totalIncome = periodIncomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = periodExpenses.reduce((sum, e) => sum + e.amount, 0);
  const profit = totalIncome - totalExpense;

  // Group by date for chart
  const dateMap = new Map<string, { income: number; expense: number }>();
  
  periodIncomes.forEach((i) => {
    const existing = dateMap.get(i.date) || { income: 0, expense: 0 };
    dateMap.set(i.date, { ...existing, income: existing.income + i.amount });
  });

  periodExpenses.forEach((e) => {
    const existing = dateMap.get(e.date) || { income: 0, expense: 0 };
    dateMap.set(e.date, { ...existing, expense: existing.expense + e.amount });
  });

  const chartData = Array.from(dateMap.entries())
    .map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      income: data.income,
      expense: data.expense,
      profit: data.income - data.expense,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10); // Last 10 days

  // Calculate HPP for all products
  const productHPPs = products.map((product) => {
    const productMats = productMaterials.filter((pm) => pm.productId === product.id);
    const materialCost = productMats.reduce((sum, pm) => {
      const material = materials.find((m) => m.id === pm.materialId);
      return sum + (material?.pricePerUnit || 0) * pm.quantity;
    }, 0);

    return {
      name: product.name,
      hpp: materialCost,
      sellingPrice: product.sellingPrice,
      margin: product.sellingPrice - materialCost,
      marginPercent: materialCost > 0 ? ((product.sellingPrice - materialCost) / materialCost) * 100 : 0,
    };
  });

  const handleExport = () => {
    const reportData = {
      period: reportPeriod,
      startDate: periodStart.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
      summary: {
        totalIncome,
        totalExpense,
        profit,
      },
      incomes: periodIncomes,
      expenses: periodExpenses,
      productHPPs,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${now.toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl text-gray-800">Laporan</h1>
              <p className="text-xs text-gray-500">Overview Keuangan</p>
            </div>
            <button
              onClick={handleExport}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setReportPeriod('week')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs transition-colors ${
                reportPeriod === 'week'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Minggu Lalu
            </button>
            <button
              onClick={() => setReportPeriod('month')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs transition-colors ${
                reportPeriod === 'month'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Bulan Lalu
            </button>
            <button
              onClick={() => setReportPeriod('year')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs transition-colors ${
                reportPeriod === 'year'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tahun Lalu
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm transition-colors ${
                activeTab === 'summary'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Ringkasan Keuangan
            </button>
            <button
              onClick={() => setActiveTab('hpp')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm transition-colors ${
                activeTab === 'hpp'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Laporan HPP
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Financial Summary Tab */}
        {activeTab === 'summary' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-white rounded-xl p-3 shadow-sm text-center">
                <div className="inline-flex p-2 bg-green-100 rounded-lg mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-xs text-gray-500 mb-1">Pendapatan</p>
                <p className="text-sm text-gray-800">{formatCurrency(totalIncome)}</p>
              </div>

              <div className="bg-white rounded-xl p-3 shadow-sm text-center">
                <div className="inline-flex p-2 bg-red-100 rounded-lg mb-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-xs text-gray-500 mb-1">Pengeluaran</p>
                <p className="text-sm text-gray-800">{formatCurrency(totalExpense)}</p>
              </div>

              <div className="bg-white rounded-xl p-3 shadow-sm text-center">
                <div className={`inline-flex p-2 rounded-lg mb-2 ${profit >= 0 ? 'bg-emerald-100' : 'bg-orange-100'}`}>
                  <DollarSign className={`w-4 h-4 ${profit >= 0 ? 'text-emerald-600' : 'text-orange-600'}`} />
                </div>
                <p className="text-xs text-gray-500 mb-1">Keuntungan</p>
                <p className={`text-sm ${profit >= 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {formatCurrency(profit)}
                </p>
              </div>
            </div>

            {/* Income vs Expense Chart */}
            {chartData.length > 0 && (
              <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                <h3 className="text-sm text-gray-800 mb-4">Tren Pendapatan vs Pengeluaran</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
                    <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Expense" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Profit Chart */}
            {chartData.length > 0 && (
              <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                <h3 className="text-sm text-gray-800 mb-4">Keuntungan/Kerugian Harian</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ fontSize: '12px' }}
                    />
                    <Bar dataKey="profit" fill="#10b981" name="Keuntungan/Kerugian" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Expense Breakdown */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm text-gray-800 mb-3">Kategori Pengeluaran Tertinggi</h3>
              <div className="space-y-2">
                {Object.entries(
                  periodExpenses.reduce((acc, e) => {
                    acc[e.category] = (acc[e.category] || 0) + e.amount;
                    return acc;
                  }, {} as Record<string, number>)
                )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-xs text-gray-600">{category}</span>
                      <span className="text-sm text-gray-800">{formatCurrency(amount)}</span>
                    </div>
                  ))}
                {periodExpenses.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4">Tidak Ada Pengeluaran yang Tercatat</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* HPP Report Tab */}
        {activeTab === 'hpp' && (
          <>
            <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
              <h3 className="text-sm text-gray-800 mb-3">Ringkasan HPP berdasarkan Produk</h3>
              
              {productHPPs.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Tidak Ada produk Dengan Biaya Material</p>
              ) : (
                <div className="space-y-3">
                  {productHPPs.map((item, index) => (
                    <div key={index} className="border border-gray-100 rounded-xl p-3">
                      <h4 className="text-sm text-gray-800 mb-2">{item.name}</h4>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-500">HPP (Material)</p>
                          <p className="text-gray-800">{formatCurrency(item.hpp)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Harga Jual</p>
                          <p className="text-gray-800">{formatCurrency(item.sellingPrice)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Margin</p>
                          <p className={item.margin >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(item.margin)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Margin %</p>
                          <p className={item.marginPercent >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {item.marginPercent.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* HPP Chart */}
            {productHPPs.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm text-gray-800 mb-4">Perbandingan HPP vs Harga Jual</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={productHPPs}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="hpp" fill="#6366f1" name="HPP" />
                    <Bar dataKey="sellingPrice" fill="#10b981" name="Selling Price" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
