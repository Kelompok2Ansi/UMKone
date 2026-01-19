import { useState } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { ProductManagement } from './components/ProductManagement';
import { RawMaterialManagement } from './components/RawMaterialManagement';
import { ProductComposition } from './components/ProductComposition';
import { ProductionCostManagement } from './components/ProductionCostManagement';
import { HPPCalculation } from './components/HPPCalculation';
import { IncomeRecording } from './components/IncomeRecording';
import { ExpenseRecording } from './components/ExpenseRecording';
import { Reports } from './components/Reports';

export type User = {
  id: string;
  email: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  unit: string;
  sellingPrice: number;
  stock: number;
};

export type RawMaterial = {
  id: string;
  name: string;
  unit: string;
  pricePerUnit: number;
};

export type ProductMaterial = {
  id: string;
  productId: string;
  materialId: string;
  quantity: number;
};

export type LaborCost = {
  id: string;
  jobType: string;
  hourlyWage: number;
};

export type OverheadCost = {
  id: string;
  name: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly';
};

export type Income = {
  id: string;
  date: string;
  source: string;
  amount: number;
  notes?: string;
};

export type Expense = {
  id: string;
  date: string;
  category: string;
  amount: number;
  notes?: string;
};

export type Screen = 
  | 'auth'
  | 'dashboard'
  | 'products'
  | 'materials'
  | 'composition'
  | 'production-costs'
  | 'hpp'
  | 'income'
  | 'expense'
  | 'reports';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [user, setUser] = useState<User | null>(null);
  
  // Mock data states
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Kopi Premium', unit: 'Cup', sellingPrice: 25000, stock: 50 },
    { id: '2', name: 'Kue Coklat', unit: 'Potong', sellingPrice: 35000, stock: 20 },
  ]);
  
  const [materials, setMaterials] = useState<RawMaterial[]>([
    { id: '1', name: 'Biji Kopi', unit: 'kg', pricePerUnit: 150000 },
    { id: '2', name: 'Gula', unit: 'kg', pricePerUnit: 15000 },
    { id: '3', name: 'Tepung', unit: 'kg', pricePerUnit: 12000 },
    { id: '4', name: 'Bubuk Kakao', unit: 'kg', pricePerUnit: 80000 },
  ]);
  
  const [productMaterials, setProductMaterials] = useState<ProductMaterial[]>([
    { id: '1', productId: '1', materialId: '1', quantity: 0.02 },
    { id: '2', productId: '1', materialId: '2', quantity: 0.01 },
    { id: '3', productId: '2', materialId: '3', quantity: 0.1 },
    { id: '4', productId: '2', materialId: '4', quantity: 0.05 },
  ]);
  
  const [laborCosts, setLaborCosts] = useState<LaborCost[]>([
    { id: '1', jobType: 'Barista', hourlyWage: 20000 },
    { id: '2', jobType: 'Tukang Roti', hourlyWage: 25000 },
  ]);
  
  const [overheadCosts, setOverheadCosts] = useState<OverheadCost[]>([
    { id: '1', name: 'Listrik', amount: 500000, period: 'monthly' },
    { id: '2', name: 'Sewa', amount: 3000000, period: 'monthly' },
    { id: '3', name: 'Air', amount: 200000, period: 'monthly' },
  ]);
  
  const [incomes, setIncomes] = useState<Income[]>([
    { id: '1', date: '2026-01-07', source: 'Penjualan Produk', amount: 500000, notes: 'Penjualan harian' },
    { id: '2', date: '2026-01-06', source: 'Penjualan Produk', amount: 450000 },
  ]);
  
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', date: '2026-01-07', category: 'Bahan Baku', amount: 200000, notes: 'Restock biji kopi' },
    { id: '2', date: '2026-01-06', category: 'Utilitas', amount: 50000, notes: 'Listrik' },
  ]);

  const handleLogin = (email: string, password: string) => {
    // Mock authentication
    setUser({ id: '1', email, name: 'Pemilik Usaha' });
    setCurrentScreen('dashboard');
  };

  const handleRegister = (email: string, password: string, name: string) => {
    // Mock registration
    setUser({ id: '1', email, name });
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('auth');
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="size-full bg-gray-50">
      {currentScreen === 'dashboard' && (
        <Dashboard
          user={user}
          products={products}
          incomes={incomes}
          expenses={expenses}
          onNavigate={setCurrentScreen}
          onLogout={handleLogout}
        />
      )}
      {currentScreen === 'products' && (
        <ProductManagement
          products={products}
          onUpdateProducts={setProducts}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}
      {currentScreen === 'materials' && (
        <RawMaterialManagement
          materials={materials}
          onUpdateMaterials={setMaterials}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}
      {currentScreen === 'composition' && (
        <ProductComposition
          products={products}
          materials={materials}
          productMaterials={productMaterials}
          onUpdateProductMaterials={setProductMaterials}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}
      {currentScreen === 'production-costs' && (
        <ProductionCostManagement
          laborCosts={laborCosts}
          overheadCosts={overheadCosts}
          onUpdateLaborCosts={setLaborCosts}
          onUpdateOverheadCosts={setOverheadCosts}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}
      {currentScreen === 'hpp' && (
        <HPPCalculation
          products={products}
          materials={materials}
          productMaterials={productMaterials}
          laborCosts={laborCosts}
          overheadCosts={overheadCosts}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}
      {currentScreen === 'income' && (
        <IncomeRecording
          incomes={incomes}
          onUpdateIncomes={setIncomes}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}
      {currentScreen === 'expense' && (
        <ExpenseRecording
          expenses={expenses}
          onUpdateExpenses={setExpenses}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}
      {currentScreen === 'reports' && (
        <Reports
          products={products}
          materials={materials}
          productMaterials={productMaterials}
          incomes={incomes}
          expenses={expenses}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}
    </div>
  );
}
