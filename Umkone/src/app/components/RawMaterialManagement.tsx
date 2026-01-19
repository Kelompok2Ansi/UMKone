import { useState } from 'react';
import { RawMaterial } from '../App';
import { ArrowLeft, Plus, Edit, Trash2, Layers } from 'lucide-react';

type RawMaterialManagementProps = {
  materials: RawMaterial[];
  onUpdateMaterials: (materials: RawMaterial[]) => void;
  onBack: () => void;
};

export function RawMaterialManagement({ materials, onUpdateMaterials, onBack }: RawMaterialManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    pricePerUnit: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMaterial) {
      // Update existing material
      onUpdateMaterials(
        materials.map((m) =>
          m.id === editingMaterial.id
            ? {
                ...m,
                name: formData.name,
                unit: formData.unit,
                pricePerUnit: parseFloat(formData.pricePerUnit),
              }
            : m
        )
      );
    } else {
      // Add new material
      const newMaterial: RawMaterial = {
        id: Date.now().toString(),
        name: formData.name,
        unit: formData.unit,
        pricePerUnit: parseFloat(formData.pricePerUnit),
      };
      onUpdateMaterials([...materials, newMaterial]);
    }

    resetForm();
  };

  const handleEdit = (material: RawMaterial) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name,
      unit: material.unit,
      pricePerUnit: material.pricePerUnit.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus bahan ini?')) {
      onUpdateMaterials(materials.filter((m) => m.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', unit: '', pricePerUnit: '' });
    setEditingMaterial(null);
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
              <h1 className="text-xl text-gray-800">Bahan Baku</h1>
              <p className="text-xs text-gray-500">{materials.length} bahan</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Add Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-purple-600 text-white rounded-2xl p-4 flex items-center justify-center gap-2 mb-4 hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Bahan Baku</span>
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <h3 className="text-sm text-gray-800 mb-4">
              {editingMaterial ? 'Edit Bahan' : 'Tambah Bahan Baku'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Nama Bahan</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="contoh: Biji Kopi"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Satuan</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="contoh: kg, liter, buah"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Harga per Satuan (IDR)</label>
                <input
                  type="number"
                  value={formData.pricePerUnit}
                  onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="150000"
                  required
                  min="0"
                  step="1"
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
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                >
                  {editingMaterial ? 'Perbarui' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Material List */}
        <div className="space-y-3">
          {materials.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Belum ada bahan</p>
              <p className="text-xs text-gray-400">Tambahkan bahan baku pertama Anda</p>
            </div>
          ) : (
            materials.map((material) => (
              <div key={material.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm text-gray-800">{material.name}</h3>
                    <p className="text-xs text-gray-500">Satuan: {material.unit}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(material)}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(material.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Harga per {material.unit}</p>
                  <p className="text-sm text-gray-800">{formatCurrency(material.pricePerUnit)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}