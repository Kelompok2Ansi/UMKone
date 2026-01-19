import { useState } from 'react';
import { Expense } from '../App';
import { ArrowLeft, Plus, Trash2, TrendingDown, Calendar } from 'lucide-react';

type ExpenseRecordingProps = {
  expenses: Expense[];
  onUpdateExpenses: (expenses: Expense[]) => void;
  onBack: () => void;
};

export function ExpenseRecording({ expenses, onUpdateExpenses, onBack }: ExpenseRecordingProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newExpense: Expense = {
      id: Date.now().toString(),
      date: formData.date,
      category: formData.category,
      amount: parseFloat(formData.amount),
      notes: formData.notes || undefined,
    };

    onUpdateExpenses([newExpense, ...expenses]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: '',
      amount: '',
      notes: '',
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this expense record?')) {
      onUpdateExpenses(expenses.filter((e) => e.id !== id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  // Calculate totals
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const todayExpense = expenses
    .filter((e) => e.date === new Date().toISOString().split('T')[0])
    .reduce((sum, e) => sum + e.amount, 0);

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
              <h1 className="text-xl text-gray-800">Catatan Pengeluaran</h1>
              <p className="text-xs text-gray-500">{expenses.length} records</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 text-white shadow-sm">
            <p className="text-xs mb-1 text-red-100">Pengeluaran Hari Ini</p>
            <p className="text-lg">{formatCurrency(todayExpense)}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white shadow-sm">
            <p className="text-xs mb-1 text-orange-100">Total Pengeluaran</p>
            <p className="text-lg">{formatCurrency(totalExpense)}</p>
          </div>
        </div>

        {/* Add Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-red-600 text-white rounded-2xl p-4 flex items-center justify-center gap-2 mb-4 hover:bg-red-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Pengeluaran</span>
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <h3 className="text-sm text-gray-800 mb-4">Tambah Pengeluaran Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Tanggal</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Kategori</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  placeholder="contoh: bahan mentah, keperluan d.l.l"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Jumlah (Rp)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  placeholder="200000"
                  required
                  min="0"
                  step="1"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Catatan (Opsional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none"
                  placeholder="Catatan tambahan...."
                  rows={2}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      date: new Date().toISOString().split('T')[0],
                      category: '',
                      amount: '',
                      notes: '',
                    });
                    setShowForm(false);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Expense List */}
        <div className="space-y-3">
          <h3 className="text-sm text-gray-600">Riwayat Pengeluaran</h3>
          {expenses.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <TrendingDown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Belum ada riwayat pengeluaran</p>
              <p className="text-xs text-gray-400">Mulai mencatat pengeluaranmu</p>
            </div>
          ) : (
            expenses.map((expense) => (
              <div key={expense.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm text-gray-800">{expense.category}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{formatDate(expense.date)}</p>
                    </div>
                    {expense.notes && (
                      <p className="text-xs text-gray-500 mt-1">{expense.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-lg text-red-600">{formatCurrency(expense.amount)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
