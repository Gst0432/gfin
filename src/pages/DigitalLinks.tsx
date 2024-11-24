import React from 'react';
import { useStore } from '../store/useStore';
import { Copy, Plus, Trash2, Edit, ExternalLink, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DigitalLinks = () => {
  const navigate = useNavigate();
  const { user, digitalProductTables = [], addDigitalProductTable, deleteDigitalProductTable, addDigitalProduct, updateDigitalProduct, deleteDigitalProduct } = useStore();

  const [showNewTableForm, setShowNewTableForm] = React.useState(false);
  const [newTableName, setNewTableName] = React.useState('');
  const [editingProduct, setEditingProduct] = React.useState<{
    tableId: string;
    productId: string | null;
    name: string;
    description: string;
    link: string;
  } | null>(null);

  const handleCreateTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.isPremium) {
      toast.error('Cette fonctionnalité est réservée aux utilisateurs premium');
      window.location.href = 'https://vente.paiementpro.net/g-startup/1936';
      return;
    }

    if (newTableName.trim()) {
      addDigitalProductTable({
        id: crypto.randomUUID(),
        name: newTableName,
        sellerId: user?.id || '',
        products: []
      });
      setNewTableName('');
      setShowNewTableForm(false);
      toast.success('Nouveau tableau créé');
    }
  };

  const handleAddProduct = (tableId: string) => {
    if (!user?.isPremium) {
      toast.error('Cette fonctionnalité est réservée aux utilisateurs premium');
      window.location.href = 'https://vente.paiementpro.net/g-startup/1936';
      return;
    }
    setEditingProduct({
      tableId,
      productId: null,
      name: '',
      description: '',
      link: '',
    });
  };

  const handleEditProduct = (tableId: string, product: {
    id: string;
    name: string;
    description: string;
    link: string;
  }) => {
    if (!user?.isPremium) {
      toast.error('Cette fonctionnalité est réservée aux utilisateurs premium');
      window.location.href = 'https://vente.paiementpro.net/g-startup/1936';
      return;
    }
    setEditingProduct({
      tableId,
      productId: product.id,
      name: product.name,
      description: product.description,
      link: product.link,
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const { tableId, productId, name, description, link } = editingProduct;

    if (productId) {
      updateDigitalProduct(tableId, productId, { name, description, link });
      toast.success('Lien mis à jour');
    } else {
      addDigitalProduct(tableId, { name, description, link });
      toast.success('Lien ajouté');
    }

    setEditingProduct(null);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copié dans le presse-papiers');
    } catch (error) {
      toast.error('Erreur lors de la copie');
    }
  };

  const handleDeleteTable = (tableId: string) => {
    if (!user?.isPremium) {
      toast.error('Cette fonctionnalité est réservée aux utilisateurs premium');
      window.location.href = 'https://vente.paiementpro.net/g-startup/1936';
      return;
    }
    if (window.confirm('Voulez-vous vraiment supprimer ce tableau ?')) {
      deleteDigitalProductTable(tableId);
      toast.success('Tableau supprimé');
    }
  };

  const handleDeleteProduct = (tableId: string, productId: string) => {
    if (!user?.isPremium) {
      toast.error('Cette fonctionnalité est réservée aux utilisateurs premium');
      window.location.href = 'https://vente.paiementpro.net/g-startup/1936';
      return;
    }
    if (window.confirm('Voulez-vous vraiment supprimer ce lien ?')) {
      deleteDigitalProduct(tableId, productId);
      toast.success('Lien supprimé');
    }
  };

  const userTables = digitalProductTables.filter(table => table.sellerId === user?.id) || [];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Créer un nouveau tableau
        </h2>
        <form onSubmit={handleCreateTable} className="flex gap-4">
          <input
            type="text"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            placeholder="Nom du tableau"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-white transition-colors ${
              user?.isPremium 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Créer
            <Crown className="h-4 w-4" />
          </button>
        </form>
      </div>

      {!user?.isPremium && (
        <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
          <div className="flex items-center">
            <Crown className="h-5 w-5 text-purple-500 mr-2" />
            <p className="text-sm text-purple-700">
              Passez à la version Premium pour gérer vos liens numériques.{' '}
              <button
                onClick={() => navigate('/subscriptions')}
                className="font-medium underline hover:text-purple-900"
              >
                Découvrir les avantages Premium
              </button>
            </p>
          </div>
        </div>
      )}

      {userTables.map((table) => (
        <div key={table.id} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{table.name}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddProduct(table.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-white transition-colors ${
                  user?.isPremium 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <Plus className="h-4 w-4" />
                Ajouter
                <Crown className="h-3 w-3" />
              </button>
              <button
                onClick={() => handleDeleteTable(table.id)}
                className={`px-3 py-1 rounded-md text-white transition-colors ${
                  user?.isPremium 
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lien
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {table.products?.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <a
                          href={product.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 truncate max-w-xs"
                        >
                          {product.link}
                        </a>
                        <button
                          onClick={() => copyToClipboard(product.link)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProduct(table.id, product)}
                          className={`text-blue-600 hover:text-blue-800 ${!user?.isPremium && 'opacity-50 cursor-not-allowed'}`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <a
                          href={product.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteProduct(table.id, product.id)}
                          className={`text-red-600 hover:text-red-800 ${!user?.isPremium && 'opacity-50 cursor-not-allowed'}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!table.products || table.products.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      Aucun lien dans ce tableau
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {userTables.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
          Aucun tableau créé
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingProduct.productId ? 'Modifier le lien' : 'Ajouter un lien'}
            </h3>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lien
                </label>
                <input
                  type="url"
                  value={editingProduct.link}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, link: e.target.value } : null)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalLinks;