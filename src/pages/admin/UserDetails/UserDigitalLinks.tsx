import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { ArrowLeft, Copy, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const UserDigitalLinks = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { users, digitalProductTables } = useStore();
  
  const user = users.find(u => u.id === userId);
  const userTables = digitalProductTables.filter(t => t.sellerId === userId);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Lien copié dans le presse-papiers');
    } catch (error) {
      toast.error('Erreur lors de la copie');
    }
  };

  if (!user) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Utilisateur non trouvé</h3>
              <div className="mt-2">
                <button
                  onClick={() => navigate('/admin/users')}
                  className="text-sm font-medium text-red-800 hover:text-red-900"
                >
                  Retour à la liste des utilisateurs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(`/admin/users/${userId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Retour
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          Liens numériques de {user.name}
        </h1>
      </div>

      {userTables.map((table) => (
        <div key={table.id} className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {table.name}
          </h2>

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
                {table.products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate">
                        {product.link}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => copyToClipboard(product.link)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Copier le lien"
                        >
                          <Copy className="h-5 w-5" />
                        </button>
                        <a
                          href={product.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900"
                          title="Ouvrir le lien"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
                {table.products.length === 0 && (
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
          Aucun tableau de liens numériques
        </div>
      )}
    </div>
  );
};

export default UserDigitalLinks;