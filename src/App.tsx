import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './hooks/useWallet';
import { Hero } from './components/Hero';
import { ConnectWalletButton } from './components/ConnectWalletButton';
import { WalletCard } from './components/WalletCard';
import { NetworkInfo } from './components/NetworkInfo';
import { SmartContractDeployer } from './components/SmartContractDeployer';

// Import icons individually to avoid loading issues
import { Code2 } from 'lucide-react';
import { Wallet } from 'lucide-react';

function App() {
  const {
    walletState,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    refreshBalance
  } = useWallet();

  const [activeTab, setActiveTab] = useState<'wallet' | 'contracts'>('wallet');
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  // Get signer when wallet is connected
  React.useEffect(() => {
    const getSigner = async () => {
      if (walletState.isConnected && typeof window !== 'undefined' && window.ethereum) {
        try {
          // Get the preferred ethereum provider
          let ethereum = window.ethereum;
          
          if (ethereum?.providers?.length) {
            // Find MetaMask in providers array
            const metaMaskProvider = ethereum.providers.find((provider: any) => provider.isMetaMask);
            if (metaMaskProvider) {
              ethereum = metaMaskProvider;
            } else {
              ethereum = ethereum.providers[0];
            }
          }

          if (ethereum) {
            const provider = new ethers.BrowserProvider(ethereum);
            const signer = await provider.getSigner();
            setSigner(signer);
          }
        } catch (error) {
          console.error('Error getting signer:', error);
          setSigner(null);
        }
      } else {
        setSigner(null);
      }
    };

    getSigner();
  }, [walletState.isConnected]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <Hero />
        
        {/* Navigation Tabs */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-2 inline-flex">
            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'wallet'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Wallet className="w-5 h-5" />
              Wallet
            </button>
            <button
              onClick={() => setActiveTab('contracts')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'contracts'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Code2 className="w-5 h-5" />
              Smart Contracts
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {activeTab === 'wallet' ? (
            // Wallet Tab Content
            walletState.isConnected ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <WalletCard
                  walletState={walletState}
                  onRefresh={refreshBalance}
                  onDisconnect={disconnectWallet}
                />
                <NetworkInfo />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="order-2 lg:order-1">
                  <ConnectWalletButton
                    onConnect={connectWallet}
                    isConnecting={isConnecting}
                    error={error}
                  />
                </div>
                <div className="order-1 lg:order-2">
                  <NetworkInfo />
                </div>
              </div>
            )
          ) : (
            // Smart Contracts Tab Content
            <SmartContractDeployer
              signer={signer}
              isConnected={walletState.isConnected}
            />
          )}
        </div>

        <footer className="mt-20 text-center text-gray-500">
          <p className="text-sm">
            Built for Nexus Blockchain • Testnet Environment • Smart Contract Deployment Ready
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;