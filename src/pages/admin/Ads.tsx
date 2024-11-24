import React from 'react';
import { useStore } from '../../store/useStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AdStats {
  id: string;
  date: string;
  amount: number;
  impressions: number;
  clicks: number;
}

export default function AdminAds() {
  const { showAds, setShowAds } = useStore();
  const [adStats, setAdStats] = React.useState<AdStats[]>([]);

  React.useEffect(() => {
    // Charger les statistiques depuis l'API
    const mockData: AdStats[] = [
      { id: '1', date: '2024-03-01', amount: 50000, impressions: 1000, clicks: 100 },
      { id: '2', date: '2024-03-02', amount: 75000, impressions: 1500, clicks: 150 },
    ];
    setAdStats(mockData);
  }, []);

  const totalRevenue = adStats.reduce((sum, rev) => sum + rev.amount, 0);
  const totalImpressions = adStats.reduce((sum, rev) => sum + rev.impressions, 0);
  const totalClicks = adStats.reduce((sum, rev) => sum + rev.clicks, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Gestion des publicités</h2>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600">Activer les publicités</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showAds}
                onChange={(e) => setShowAds(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-600">Revenus totaux</p>
            <p className="text-2xl font-bold text-blue-900">
              {totalRevenue.toLocaleString()} FCFA
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-green-600">Impressions totales</p>
            <p className="text-2xl font-bold text-green-900">
              {totalImpressions.toLocaleString()}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-yellow-600">Clics totaux</p>
            <p className="text-2xl font-bold text-yellow-900">
              {totalClicks.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={adStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" name="Revenus" fill="#3B82F6" />
              <Bar dataKey="impressions" name="Impressions" fill="#10B981" />
              <Bar dataKey="clicks" name="Clics" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}