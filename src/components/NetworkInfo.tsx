import React from 'react';
import { Globe, ExternalLink, Zap } from 'lucide-react';
import { NEXUS_TESTNET } from '../config/nexus';

export const NetworkInfo: React.FC = () => {
  const openExplorer = () => {
    window.open(NEXUS_TESTNET.explorerUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Network Details</h3>
          <p className="text-sm text-gray-500">Nexus Blockchain</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Network Name</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600">Testnet</span>
            </div>
          </div>
          <p className="text-lg font-semibold text-gray-900">{NEXUS_TESTNET.name}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Chain ID</span>
            <Zap className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-lg font-mono text-gray-900">{NEXUS_TESTNET.chainId}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">RPC URL</span>
          </div>
          <p className="text-sm font-mono text-gray-700 break-all">
            {NEXUS_TESTNET.rpcUrl}
          </p>
        </div>

        <button
          onClick={openExplorer}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Open Explorer
        </button>
      </div>
    </div>
  );
};