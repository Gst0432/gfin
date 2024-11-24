import React from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Search, Plus } from 'lucide-react';
import DocumentGenerator from '../components/documents/DocumentGenerator';
import ItemSelect from '../components/seller/ItemSelect';
import toast from 'react-hot-toast';

export default function Sales() {
  const { user, transactions = [], products = [], services = [], addTransaction } = useStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showSaleModal, setShowSaleModal] = React.useState(false);
  const [saleForm, setSaleForm] = React.useState({
    type: 'product' as 'product' | 'service',
    itemId: '',
    quantity: 1,
    amount: 0,
    description: '',
    paymentMethod: 'cash' as 'cash' | 'mobile' | 'card' | 'transfer' | 'money_transfer',
    buyerDetails: {
      name: '',
      email: '',
      phone: ''
    }
  });

  // Filter user's transactions
  const userTransactions = transactions.filter(t => t.sellerId === user?.id && t.type === 'sale');

  const filteredTransactions = userTransactions.filter(sale => 
    sale.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.buyerDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.buyerDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Find selected product/service
      const selectedItem = saleForm.type === 'product' 
        ? products.find(p => p.id === saleForm.itemId)
        : services.find(s => s.id === saleForm.itemId);

      if (!selectedItem) {
        toast.error('Veuillez sélectionner un produit ou service');
        return;
      }

      // Calculate total amount
      const amount = saleForm.type === 'product'
        ? (selectedItem as typeof products[0]).sellingPrice * saleForm.quantity
        : (selectedItem as typeof services[0]).price;

      const newSale = {
        type: 'sale' as const,
        saleType: saleForm.type,
        amount,
        date: new Date().toISOString(),
        description: saleForm.description || ('name' in selectedItem ? selectedItem.name : selectedItem.title),
        buyerDetails: saleForm.buyerDetails,
        paymentMethod: saleForm.paymentMethod,
        itemId: selectedItem.id,
        sellerId: user?.id || '',
        status: 'completed' as const
      };

      addTransaction(newSale);
      setShowSaleModal(false);
      setSaleForm({
        type: 'product',
        itemId: '',
        quantity: 1,
        amount: 0,
        description: '',
        paymentMethod: 'cash',
        buyerDetails: {
          name: '',
          email: '',
          phone: ''
        }
      });
      toast.success('Vente enregistrée avec succès');
    } catch (error) {
      console.error('Sale error:', error);
      toast.error('Erreur lors de l\'enregistrement de la vente');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Ventes</h2>
            <p className="text-sm text-gray-500">
              Historique des ventes
            </p>
          </div>
          <button
            onClick={() => setShowSaleModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nouvelle Vente
          </button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une vente..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Total:</span>
            <span className="text-lg font-semibold text-blue-600">
              {filteredTransactions.reduce((sum, sale) => sum + sale.amount, 0).toLocaleString()} FCFA
            </span>
          </div>
        </div>

        {/* Sales list */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mode de paiement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((sale) => (
                <tr key={sale.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(sale.date), 'dd MMMM yyyy', { locale: fr })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sale.buyerDetails?.name}</div>
                    <div className="text-xs text-gray-500">{sale.buyerDetails?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {sale.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.amount.toLocaleString()} FCFA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.paymentMethod === 'cash' && 'Espèces'}
                    {sale.paymentMethod === 'mobile' && 'Mobile Money'}
                    {sale.paymentMethod === 'card' && 'Carte bancaire'}
                    {sale.paymentMethod === 'transfer' && 'Virement bancaire'}
                    {sale.paymentMethod === 'money_transfer' && 'Transfert d\'argent'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <DocumentGenerator transaction={sale} />
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Aucune vente enregistrée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* New sale modal */}
        {showSaleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Enregistrer une nouvelle vente
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <select
                      value={saleForm.type}
                      onChange={(e) => setSaleForm(prev => ({ 
                        ...prev, 
                        type: e.target.value as 'product' | 'service',
                        itemId: ''
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="product">Produit</option>
                      <option value="service">Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {saleForm.type === 'product' ? 'Produit' : 'Service'}
                    </label>
                    <ItemSelect
                      type={saleForm.type}
                      items={saleForm.type === 'product' ? products : services}
                      selectedId={saleForm.itemId}
                      onChange={(id) => setSaleForm(prev => ({ ...prev, itemId: id }))}
                    />
                  </div>

                  {saleForm.type === 'product' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Quantité
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={saleForm.quantity}
                        onChange={(e) => setSaleForm(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mode de paiement
                    </label>
                    <select
                      value={saleForm.paymentMethod}
                      onChange={(e) => setSaleForm(prev => ({ 
                        ...prev, 
                        paymentMethod: e.target.value as typeof saleForm.paymentMethod 
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="cash">Espèces</option>
                      <option value="mobile">Mobile Money</option>
                      <option value="card">Carte bancaire</option>
                      <option value="transfer">Virement bancaire</option>
                      <option value="money_transfer">Transfert d'argent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description (optionnelle)
                  </label>
                  <textarea
                    value={saleForm.description}
                    onChange={(e) => setSaleForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Informations client
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nom du client
                      </label>
                      <input
                        type="text"
                        value={saleForm.buyerDetails.name}
                        onChange={(e) => setSaleForm(prev => ({
                          ...prev,
                          buyerDetails: { ...prev.buyerDetails, name: e.target.value }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        value={saleForm.buyerDetails.email}
                        onChange={(e) => setSaleForm(prev => ({
                          ...prev,
                          buyerDetails: { ...prev.buyerDetails, email: e.target.value }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={saleForm.buyerDetails.phone}
                        onChange={(e) => setSaleForm(prev => ({
                          ...prev,
                          buyerDetails: { ...prev.buyerDetails, phone: e.target.value }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowSaleModal(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Enregistrer la vente
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}