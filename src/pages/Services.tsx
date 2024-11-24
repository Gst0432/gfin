import React from 'react';
import { useStore } from '../store/useStore';
import { Service } from '../types';
import ServiceForm from '../components/seller/ServiceForm';

export default function Services() {
  const { services, addService, deleteService } = useStore();

  const handleAddService = (service: Omit<Service, 'id' | 'sellerId'>) => {
    const newService = {
      ...service,
      id: crypto.randomUUID(),
      sellerId: 'current-user-id', // In real app, get from auth context
    };
    addService(newService as Service);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Service</h2>
        <ServiceForm onSubmit={handleAddService} />
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Services List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {service.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.price} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(service.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => deleteService(service.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}