import { useState } from 'react';
import { LaborCost, OverheadCost } from '../App';
import { ArrowLeft, Plus, Edit, Trash2, Users, Zap } from 'lucide-react';

type ProductionCostManagementProps = {
  laborCosts: LaborCost[];
  overheadCosts: OverheadCost[];
  onUpdateLaborCosts: (laborCosts: LaborCost[]) => void;
  onUpdateOverheadCosts: (overheadCosts: OverheadCost[]) => void;
  onBack: () => void;
};

export function ProductionCostManagement({
  laborCosts,
  overheadCosts,
  onUpdateLaborCosts,
  onUpdateOverheadCosts,
  onBack,
}: ProductionCostManagementProps) {
  const [activeTab, setActiveTab] = useState<'labor' | 'overhead'>('labor');
  
  // Labor Cost Form
  const [showLaborForm, setShowLaborForm] = useState(false);
  const [editingLabor, setEditingLabor] = useState<LaborCost | null>(null);
  const [laborFormData, setLaborFormData] = useState({
    jobType: '',
    hourlyWage: '',
  });

  // Overhead Cost Form
  const [showOverheadForm, setShowOverheadForm] = useState(false);
  const [editingOverhead, setEditingOverhead] = useState<OverheadCost | null>(null);
  const [overheadFormData, setOverheadFormData] = useState({
    name: '',
    amount: '',
    period: 'monthly' as 'daily' | 'weekly' | 'monthly',
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Labor Cost Handlers
  const handleLaborSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingLabor) {
      onUpdateLaborCosts(
        laborCosts.map((l) =>
          l.id === editingLabor.id
            ? {
                ...l,
                jobType: laborFormData.jobType,
                hourlyWage: parseFloat(laborFormData.hourlyWage),
              }
            : l
        )
      );
    } else {
      const newLabor: LaborCost = {
        id: Date.now().toString(),
        jobType: laborFormData.jobType,
        hourlyWage: parseFloat(laborFormData.hourlyWage),
      };
      onUpdateLaborCosts([...laborCosts, newLabor]);
    }

    setLaborFormData({ jobType: '', hourlyWage: '' });
    setEditingLabor(null);
    setShowLaborForm(false);
  };

  const handleEditLabor = (labor: LaborCost) => {
    setEditingLabor(labor);
    setLaborFormData({
      jobType: labor.jobType,
      hourlyWage: labor.hourlyWage.toString(),
    });
    setShowLaborForm(true);
  };

  const handleDeleteLabor = (id: string) => {
    if (confirm('Hapus biaya tenaga kerja ini?')) {
      onUpdateLaborCosts(laborCosts.filter((l) => l.id !== id));
    }
  };

  // Overhead Cost Handlers
  const handleOverheadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingOverhead) {
      onUpdateOverheadCosts(
        overheadCosts.map((o) =>
          o.id === editingOverhead.id
            ? {
                ...o,
                name: overheadFormData.name,
                amount: parseFloat(overheadFormData.amount),
                period: overheadFormData.period,
              }
            : o
        )
      );
    } else {
      const newOverhead: OverheadCost = {
        id: Date.now().toString(),
        name: overheadFormData.name,
        amount: parseFloat(overheadFormData.amount),
        period: overheadFormData.period,
      };
      onUpdateOverheadCosts([...overheadCosts, newOverhead]);
    }

    setOverheadFormData({ name: '', amount: '', period: 'monthly' });
    setEditingOverhead(null);
    setShowOverheadForm(false);
  };

  const handleEditOverhead = (overhead: OverheadCost) => {
    setEditingOverhead(overhead);
    setOverheadFormData({
      name: overhead.name,
      amount: overhead.amount.toString(),
      period: overhead.period,
    });
    setShowOverheadForm(true);
  };

  const handleDeleteOverhead = (id: string) => {
    if (confirm('Hapus biaya overhead ini?')) {
      onUpdateOverheadCosts(overheadCosts.filter((o) => o.id !== id));
    }
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
            <div>
              <h1 className="text-xl text-gray-800">Biaya Produksi</h1>
              <p className="text-xs text-gray-500">Kelola tenaga kerja & overhead</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('labor')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm transition-colors ${
                activeTab === 'labor'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Biaya Tenaga Kerja
            </button>
            <button
              onClick={() => setActiveTab('overhead')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm transition-colors ${
                activeTab === 'overhead'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Biaya Overhead
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Labor Costs Tab */}
        {activeTab === 'labor' && (
          <>
            {!showLaborForm && (
              <button
                onClick={() => setShowLaborForm(true)}
                className="w-full bg-teal-600 text-white rounded-2xl p-4 flex items-center justify-center gap-2 mb-4 hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Tambah Biaya Tenaga Kerja</span>
              </button>
            )}

            {showLaborForm && (
              <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                <h3 className="text-sm text-gray-800 mb-4">
                  {editingLabor ? 'Edit Biaya Tenaga Kerja' : 'Tambah Biaya Tenaga Kerja'}
                </h3>
                <form onSubmit={handleLaborSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Jenis Pekerjaan</label>
                    <input
                      type="text"
                      value={laborFormData.jobType}
                      onChange={(e) =>
                        setLaborFormData({ ...laborFormData, jobType: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      placeholder="contoh: Barista, Tukang Roti"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Upah per Jam (IDR)</label>
                    <input
                      type="number"
                      value={laborFormData.hourlyWage}
                      onChange={(e) =>
                        setLaborFormData({ ...laborFormData, hourlyWage: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      placeholder="20000"
                      required
                      min="0"
                      step="1"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLaborFormData({ jobType: '', hourlyWage: '' });
                        setEditingLabor(null);
                        setShowLaborForm(false);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
                    >
                      {editingLabor ? 'Perbarui' : 'Tambah'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-3">
              {laborCosts.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Belum ada biaya tenaga kerja</p>
                  <p className="text-xs text-gray-400">Tambahkan biaya tenaga kerja untuk melacak upah</p>
                </div>
              ) : (
                laborCosts.map((labor) => (
                  <div key={labor.id} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm text-gray-800">{labor.jobType}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatCurrency(labor.hourlyWage)}/jam
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditLabor(labor)}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLabor(labor.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Overhead Costs Tab */}
        {activeTab === 'overhead' && (
          <>
            {!showOverheadForm && (
              <button
                onClick={() => setShowOverheadForm(true)}
                className="w-full bg-teal-600 text-white rounded-2xl p-4 flex items-center justify-center gap-2 mb-4 hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Tambah Biaya Overhead</span>
              </button>
            )}

            {showOverheadForm && (
              <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                <h3 className="text-sm text-gray-800 mb-4">
                  {editingOverhead ? 'Edit Biaya Overhead' : 'Tambah Biaya Overhead'}
                </h3>
                <form onSubmit={handleOverheadSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Nama Biaya</label>
                    <input
                      type="text"
                      value={overheadFormData.name}
                      onChange={(e) =>
                        setOverheadFormData({ ...overheadFormData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      placeholder="contoh: Listrik, Sewa"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Jumlah (IDR)</label>
                    <input
                      type="number"
                      value={overheadFormData.amount}
                      onChange={(e) =>
                        setOverheadFormData({ ...overheadFormData, amount: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      placeholder="500000"
                      required
                      min="0"
                      step="1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Periode</label>
                    <select
                      value={overheadFormData.period}
                      onChange={(e) =>
                        setOverheadFormData({
                          ...overheadFormData,
                          period: e.target.value as 'daily' | 'weekly' | 'monthly',
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      required
                    >
                      <option value="daily">Harian</option>
                      <option value="weekly">Mingguan</option>
                      <option value="monthly">Bulanan</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setOverheadFormData({ name: '', amount: '', period: 'monthly' });
                        setEditingOverhead(null);
                        setShowOverheadForm(false);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
                    >
                      {editingOverhead ? 'Perbarui' : 'Tambah'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-3">
              {overheadCosts.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center">
                  <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Belum ada biaya overhead</p>
                  <p className="text-xs text-gray-400">Tambahkan biaya overhead untuk melacak pengeluaran</p>
                </div>
              ) : (
                overheadCosts.map((overhead) => (
                  <div key={overhead.id} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm text-gray-800">{overhead.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatCurrency(overhead.amount)}/{overhead.period === 'daily' ? 'hari' : overhead.period === 'weekly' ? 'minggu' : 'bulan'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditOverhead(overhead)}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOverhead(overhead.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
