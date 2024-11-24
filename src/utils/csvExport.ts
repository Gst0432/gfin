import { Transaction, Expense } from '../types';

export function exportToCSV(data: any[], filename: string) {
  // Convertir les données en format CSV
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','), // En-têtes
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Gérer les valeurs spéciales
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        if (value instanceof Date) {
          return value.toLocaleDateString('fr-FR');
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Créer le blob et télécharger
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}