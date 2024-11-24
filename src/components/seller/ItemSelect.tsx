import React from 'react';
import { Product, Service } from '../../types';
import { Search } from 'lucide-react';

interface ItemSelectProps {
  type: 'product' | 'service';
  items: (Product | Service)[];
  selectedId: string;
  onChange: (id: string) => void;
}

export default function ItemSelect({ type, items, selectedId, onChange }: ItemSelectProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const filteredItems = React.useMemo(() => {
    return items.filter(item => {
      const searchStr = searchTerm.toLowerCase();
      const name = 'name' in item ? item.name : (item as Service).title;
      return name.toLowerCase().includes(searchStr);
    });
  }, [items, searchTerm]);

  const selectedItem = items.find(item => item.id === selectedId);
  const displayValue = selectedItem
    ? 'name' in selectedItem
      ? selectedItem.name
      : (selectedItem as Service).title
    : '';

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (items.length === 0) {
    return (
      <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-md">
        Aucun {type === 'product' ? 'produit' : 'service'} disponible.{' '}
        <a href={`/app/${type === 'product' ? 'products' : 'services'}`} className="text-blue-600 hover:text-blue-800">
          Ajouter un {type === 'product' ? 'produit' : 'service'}
        </a>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="mt-1 relative rounded-md shadow-sm cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="text"
          className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 cursor-pointer bg-white"
          placeholder={`Sélectionner un ${type === 'product' ? 'produit' : 'service'}`}
          value={displayValue}
          readOnly
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
          <div className="p-2 border-b">
            <div className="relative">
              <input
                type="text"
                className="block w-full rounded-md border-gray-300 pl-8 pr-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <ul className="max-h-60 overflow-auto py-1">
            {filteredItems.map((item) => {
              const isProduct = 'sellingPrice' in item;
              const price = isProduct ? item.sellingPrice : (item as Service).price;
              const name = isProduct ? item.name : (item as Service).title;
              const margin = isProduct ? item.sellingPrice - item.purchasePrice : null;
              const marginPercentage = isProduct ? ((margin! / item.purchasePrice) * 100).toFixed(1) : null;

              return (
                <li
                  key={item.id}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    item.id === selectedId ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    onChange(item.id);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{name}</span>
                    <span className="text-blue-600 font-medium">
                      {price.toLocaleString()} FCFA
                    </span>
                  </div>
                  {isProduct && marginPercentage && (
                    <div className="text-sm text-gray-500 mt-1">
                      Marge: {marginPercentage}%
                    </div>
                  )}
                </li>
              );
            })}
            {filteredItems.length === 0 && (
              <li className="px-3 py-2 text-gray-500 text-center">
                Aucun résultat trouvé
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}