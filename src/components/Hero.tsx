import React from 'react';
import { Layers, Shield, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="text-center mb-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-4">
          <Layers className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Nexus Blockchain</span>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Connect to the
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {' '}Future
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience the power of Nexus blockchain with seamless wallet integration
          and lightning-fast transactions on our testnet.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-12">
        <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-lg">
          <Shield className="w-8 h-8 text-green-500" />
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Secure</h3>
            <p className="text-sm text-gray-600">End-to-end encryption</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-lg">
          <Zap className="w-8 h-8 text-yellow-500" />
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Fast</h3>
            <p className="text-sm text-gray-600">Lightning speed</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-lg">
          <Layers className="w-8 h-8 text-blue-500" />
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Scalable</h3>
            <p className="text-sm text-gray-600">Unlimited potential</p>
          </div>
        </div>
      </div>
    </div>
  );
};