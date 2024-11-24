import React from 'react';
import { useStore } from '../store/useStore';
import { Product } from '../types';
import ProductForm from '../components/seller/ProductForm';
import { Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import AdComponent from '../components/ads/AdComponent';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct, user } = useStore();
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);

  const handleAddProduct = (productData: Omit<Product, 'id' | 'sellerId'>) => {
    try {
      const newProduct = {
        ...productData,
        id: crypto.randomUUID(),
        sellerId: user?.id || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      addProduct(newProduct as Product);
      toast.success('Produit ajouté avec succès');
    } catch (error) {
      toast.error("Erreur lors de l'ajout du produit");
    }
  };

  const handleUpdateProduct = (productData: Omit<Product, 'id' | 'sellerId'>) => {
    try {
      if (!editingProduct) return;
      updateProduct(editingProduct.id, {
        ...productData,
        updatedAt: new Date().toISOString()
      });
      setEditingProduct(null);
      toast.success('Produit mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du produit');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        deleteProduct(id);
        toast.success('Produit supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression du produit');
      }
    }
  };

  return (
    <div className="space-y-6">
      {!user?.isPremium && <AdComponent slot="products-top" format="horizontal" />}

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
        </h2>
        <ProductForm
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          initialData={editingProduct}
        />
      </div>

      {!user?.isPremium && <AdComponent slot="products-middle" format="rectangle" />}

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Liste des produits</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom du produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix d'achat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix de vente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marge
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.purchasePrice.toLocaleString()} FCFA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sellingPrice.toLocaleString()} FCFA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(product.sellingPrice - product.purchasePrice).toLocaleString()} FCFA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!user?.isPremium && <AdComponent slot="products-bottom" format="horizontal" />}
    </div>
  );
}