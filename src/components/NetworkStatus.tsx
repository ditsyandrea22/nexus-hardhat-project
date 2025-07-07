import React from 'react';
import { Globe, CheckCircle, AlertCircle, Zap, Activity } from 'lucide-react';
import { NEXUS_TESTNET } from '../config/nexus';

const NetworkStatus: React.FC = () => {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-500 dark:to-blue-500 p-3 rounded-xl shadow-lg transition-colors duration-300">
          <Globe className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white transition-colors duration-300">Network Information</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Nexus Testnet Status</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/30 dark:to-emerald-900/30 backdrop-blur-sm rounded-xl border border-green-200 dark:border-green-700/30">
          <div className="relative">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
          </div>
          <div>
            <p className="font-bold text-gray-800 dark:text-white transition-colors duration-300">{NEXUS_TESTNET.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Chain ID: {NEXUS_TESTNET.chainId}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 backdrop-blur-sm rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-blue-200/30 dark:border-blue-700/30">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors duration-300">RPC Endpoint</p>
            </div>
            <p className="font-mono text-sm text-gray-800 dark:text-gray-200 break-all bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20 dark:border-gray-700/30 transition-colors duration-300">
              {NEXUS_TESTNET.rpcUrl}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/30 dark:to-pink-900/30 backdrop-blur-sm rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-purple-200/30 dark:border-purple-700/30">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors duration-300">Block Explorer</p>
            </div>
            <a
              href={NEXUS_TESTNET.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline break-all bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-3 py-2 rounded-lg block transition-all duration-300 border border-white/20 dark:border-gray-700/30"
            >
              {NEXUS_TESTNET.explorerUrl}
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/30 dark:to-orange-900/30 backdrop-blur-sm border-2 border-yellow-200 dark:border-yellow-700/30 rounded-xl p-4 animate-pulse-subtle">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800 dark:text-yellow-300 font-semibold mb-1 transition-colors duration-300">
                <strong>Testnet Notice</strong>
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 transition-colors duration-300">
                This is a test network. Tokens have no real value and are used for development purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;