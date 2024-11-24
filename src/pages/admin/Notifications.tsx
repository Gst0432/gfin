import React from 'react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Check, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications = [], markNotificationAsRead, deleteNotification } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Retour
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          Notifications
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start justify-between p-4 rounded-lg border ${
                  notification.isRead ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${
                    notification.isRead ? 'bg-gray-200' : 'bg-blue-200'
                  }`}>
                    <Bell className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {format(new Date(notification.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => markNotificationAsRead(notification.id)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Marquer comme lu"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Supprimer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucune notification
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;