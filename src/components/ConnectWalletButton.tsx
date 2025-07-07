import React from 'react';
import { Wallet, Loader2, AlertCircle } from 'lucide-react';

interface ConnectWalletButtonProps {
  onConnect: () => void;
  isConnecting: boolean;
  error: string | null;
}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
  onConnect,
  isConnecting,
  error
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={onConnect}
        disabled={isConnecting}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md flex items-center justify-center gap-3"
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Supported wallets: MetaMask, Coinbase Wallet, WalletConnect
        </p>
      </div>
    </div>
  );
};