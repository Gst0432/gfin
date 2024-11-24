import React from 'react';
import { useStore } from '../store/useStore';
import { User } from '../types';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, updateUser } = useStore();
  const [autoRenew, setAutoRenew] = React.useState(user?.autoRenew || false);
  const [companyInfo, setCompanyInfo] = React.useState({
    name: user?.companyInfo?.name || '',
    address: user?.companyInfo?.address || '',
    phone: user?.companyInfo?.phone || '',
    email: user?.companyInfo?.email || '',
    logo: user?.companyInfo?.logo || ''
  });
  const logoInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpdatePreferences = async () => {
    try {
      if (user) {
        await updateUser(user.id, {
          autoRenew,
          companyInfo
        });
        toast.success('Préférences mises à jour avec succès');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des préférences');
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyInfo(prev => ({
          ...prev,
          logo: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Paramètres du compte</h2>
        
        {user?.isPremium && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Abonnement Premium</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-600">
                Votre abonnement premium est actif jusqu'au{' '}
                {new Date(user.premiumExpiryDate!).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoRenew"
                checked={autoRenew}
                onChange={(e) => setAutoRenew(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="autoRenew" className="ml-2 text-sm text-gray-600">
                Renouvellement automatique
              </label>
            </div>
          </div>
        )}

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de l'entreprise</h3>
          <p className="text-sm text-gray-500 mb-4">
            Ces informations apparaîtront sur vos reçus et factures
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom de l'entreprise
              </label>
              <input
                type="text"
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Nom de votre entreprise"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Adresse
              </label>
              <textarea
                value={companyInfo.address}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, address: e.target.value }))}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Adresse complète"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={companyInfo.phone}
                  onChange={(e) => setCompanyInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="+227 XX XX XX XX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="contact@entreprise.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo de l'entreprise
              </label>
              <div className="flex items-center space-x-4">
                {companyInfo.logo && (
                  <div className="relative w-20 h-20">
                    <img
                      src={companyInfo.logo}
                      alt="Logo de l'entreprise"
                      className="w-20 h-20 object-contain rounded-lg"
                    />
                    <button
                      onClick={() => setCompanyInfo(prev => ({ ...prev, logo: '' }))}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    {companyInfo.logo ? 'Changer le logo' : 'Ajouter un logo'}
                  </button>
                  <p className="mt-1 text-xs text-gray-500">
                    Format recommandé : PNG ou JPEG, max 1MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleUpdatePreferences}
            className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
}