import React from 'react';
import { Wallet } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 blur-xl opacity-50"></div>
        <div className="relative flex items-center justify-center h-10 w-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg">
          <Wallet className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="ml-3 flex items-baseline">
        <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">G</span>
        <span className="text-2xl font-bold tracking-tight text-white">-FINANCE</span>
      </div>
    </div>
  );
}