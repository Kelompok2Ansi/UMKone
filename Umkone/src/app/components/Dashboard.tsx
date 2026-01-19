import { User, Product, Income, Expense, Screen } from '../App';
import {
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Layers,
  Calculator,
  Settings,
  FileText,
  LogOut,
  Menu,
} from 'lucide-react';
import { useState } from 'react';

type DashboardProps = {
  user: User;
  products: Product[];
  incomes: Income[];
  expenses: Expense[];
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
};

export function Dashboard({ user, products, incomes, expenses, onNavigate, onLogout }: DashboardProps) {
  const [showMenu, setShowMenu] = useState(false);

  // Calculate today's totals
  const today = new Date().toISOString().split('T')[0];
  const todayIncome = incomes
    .filter((i) => i.date === today)
    .reduce((sum, i) => sum + i.amount, 0);
  const todayExpense = expenses
    .filter((e) => e.date === today)
    .reduce((sum, e) => sum + e.amount, 0);
  const todayProfit = todayIncome - todayExpense;

  // Calculate current period (this month)
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthIncome = incomes
    .filter((i) => i.date.startsWith(currentMonth))
    .reduce((sum, i) => sum + i.amount, 0);
  const monthExpense = expenses
    .filter((e) => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + e.amount, 0);
  const monthProfit = monthIncome - monthExpense;

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl text-gray-800">Beranda</h1>
              <p className="text-sm text-gray-500">Selamat datang kembali, {user.name}</p>
            </div>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setShowMenu(false)}>
          <div
            className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 p-4 border-b">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                {user.name[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-4 text-red-600 hover:bg-red-50 rounded-lg mt-4"
            >
              <LogOut className="w-5 h-5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      )}

      <div className="p-4 pb-20">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl text-gray-800">{products.length}</p>
            <p className="text-xs text-gray-500">Produk Aktif</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <p className="text-lg text-gray-800">{formatCurrency(todayIncome)}</p>
            <p className="text-xs text-gray-500">Pendapatan Hari Ini</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <p className="text-lg text-gray-800">{formatCurrency(todayExpense)}</p>
            <p className="text-xs text-gray-500">Pengeluaran Hari Ini</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-lg ${monthProfit >= 0 ? 'bg-emerald-100' : 'bg-orange-100'}`}>
                <DollarSign className={`w-4 h-4 ${monthProfit >= 0 ? 'text-emerald-600' : 'text-orange-600'}`} />
              </div>
            </div>
            <p className="text-lg text-gray-800">{formatCurrency(monthProfit)}</p>
            <p className="text-xs text-gray-500">Laba Bulanan</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-sm text-gray-600 mb-3">Aksi Cepat</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('income')}
              className="bg-green-600 text-white rounded-2xl p-4 flex items-center gap-3 hover:bg-green-700 transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Tambah Pemasukan</span>
            </button>
            <button
              onClick={() => onNavigate('expense')}
              className="bg-red-600 text-white rounded-2xl p-4 flex items-center gap-3 hover:bg-red-700 transition-colors"
            >
              <TrendingDown className="w-5 h-5" />
              <span className="text-sm">Tambah Pengeluaran</span>
            </button>
          </div>
        </div>

        {/* Main Features */}
        <div>
          <h2 className="text-sm text-gray-600 mb-3">Menu Utama</h2>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('products')}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <div className="p-3 bg-blue-100 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-gray-800">Manajemen Produk</p>
                <p className="text-xs text-gray-500">Kelola produk, harga & stok</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('materials')}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <div className="p-3 bg-purple-100 rounded-xl">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-gray-800">Bahan Baku</p>
                <p className="text-xs text-gray-500">Kelola inventori bahan</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('composition')}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <div className="p-3 bg-orange-100 rounded-xl">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-gray-800">Komposisi Produk</p>
                <p className="text-xs text-gray-500">Hubungkan bahan ke produk</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('production-costs')}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <div className="p-3 bg-teal-100 rounded-xl">
                <Settings className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-gray-800">Biaya Produksi</p>
                <p className="text-xs text-gray-500">Biaya tenaga kerja & overhead</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('hpp')}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Calculator className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-gray-800">Hitung HPP</p>
                <p className="text-xs text-gray-500">Hitung harga pokok produksi</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('reports')}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <div className="p-3 bg-emerald-100 rounded-xl">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-gray-800">Laporan</p>
                <p className="text-xs text-gray-500">Lihat laporan keuangan</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}