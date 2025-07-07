import React, { useState } from 'react';
import { Zap, Github, ExternalLink, Sparkles } from 'lucide-react';
import { ContractTemplate } from './types';
import { ThemeProvider } from './contexts/ThemeContext';
import WalletConnect from './components/WalletConnect';
import ContractSelector from './components/ContractSelector';
import ContractDeployer from './components/ContractDeployer';
import NetworkStatus from './components/NetworkStatus';
import ThemeToggle from './components/ThemeToggle';
import AnimatedBackground from './components/AnimatedBackground';
import { useWallet } from './hooks/useWallet';

function AppContent() {
  const { walletState, signer } = useWallet();
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);

  const canDeploy = walletState.isConnected && 
                   walletState.chainId === '3940' && 
                   selectedTemplate !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 relative overflow-hidden transition-colors duration-500">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <header className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-white/20 dark:border-gray-700/30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 p-3 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent transition-colors duration-300">
                  Nexus Smart Contract Deployer
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1 transition-colors duration-300">
                  <Sparkles className="h-3 w-3" />
                  <span>Deploy contracts on Nexus Testnet with confidence</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <ThemeToggle />
              <a
                href="https://docs.nexus.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-105"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="font-medium">Documentation</span>
              </a>
              <a
                href="https://github.com/nexus-network"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 hover:scale-105"
              >
                <Github className="h-4 w-4" />
                <span className="font-medium">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/50 dark:to-purple-900/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-blue-800 dark:text-blue-300 mb-6 animate-bounce-subtle border border-blue-200/50 dark:border-blue-700/50">
            <Sparkles className="h-4 w-4" />
            <span>Professional Smart Contract Deployment</span>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-6 leading-tight transition-colors duration-300">
            Deploy Smart Contracts
            <br />
            <span className="text-4xl">with Confidence</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
            Professional-grade smart contract deployment tool for Nexus testnet. 
            Choose from pre-built templates or deploy your own contracts with advanced gas management and real-time monitoring.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Wallet Connection */}
            <div className="animate-slide-up">
              <WalletConnect />
            </div>

            {/* Contract Selection */}
            <div className="animate-slide-up animation-delay-200">
              <ContractSelector
                selectedTemplate={selectedTemplate}
                onTemplateSelect={setSelectedTemplate}
              />
            </div>

            {/* Contract Deployer */}
            {canDeploy && (
              <div className="animate-slide-up animation-delay-400">
                <ContractDeployer
                  template={selectedTemplate}
                  signer={signer}
                />
              </div>
            )}

            {/* Deployment Requirements */}
            {!canDeploy && (
              <div className="animate-slide-up animation-delay-400">
                <div className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-gray-800/50 dark:to-blue-900/30 backdrop-blur-md rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 text-center relative overflow-hidden transition-colors duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10"></div>
                  <div className="relative space-y-6">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-pulse-slow">
                      <Zap className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Ready to Deploy</h3>
                    <div className="text-gray-600 dark:text-gray-300 space-y-3 max-w-md mx-auto transition-colors duration-300">
                      <div className="flex items-center justify-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-white/20 dark:border-gray-700/30">
                        <div className={`w-3 h-3 rounded-full ${walletState.isConnected ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'} transition-colors duration-300`}></div>
                        <span className="font-medium">Connect your wallet</span>
                      </div>
                      <div className="flex items-center justify-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-white/20 dark:border-gray-700/30">
                        <div className={`w-3 h-3 rounded-full ${selectedTemplate ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'} transition-colors duration-300`}></div>
                        <span className="font-medium">Select a contract template</span>
                      </div>
                      <div className="flex items-center justify-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-white/20 dark:border-gray-700/30">
                        <div className={`w-3 h-3 rounded-full ${walletState.chainId === '3940' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'} transition-colors duration-300`}></div>
                        <span className="font-medium">Switch to Nexus Testnet</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Network Status */}
            <div className="animate-slide-up animation-delay-300">
              <NetworkStatus />
            </div>

            {/* Quick Stats */}
            <div className="animate-slide-up animation-delay-500">
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center space-x-2 transition-colors duration-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Network Stats</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 backdrop-blur-sm rounded-lg border border-blue-200/30 dark:border-blue-700/30">
                    <span className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300">Network:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">Nexus Testnet</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/30 dark:to-pink-900/30 backdrop-blur-sm rounded-lg border border-purple-200/30 dark:border-purple-700/30">
                    <span className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300">Chain ID:</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400 transition-colors duration-300">3940</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/30 dark:to-emerald-900/30 backdrop-blur-sm rounded-lg border border-green-200/30 dark:border-green-700/30">
                    <span className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300">Status:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-600 dark:text-green-400 font-bold transition-colors duration-300">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="animate-slide-up animation-delay-700">
              <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 dark:from-blue-700/90 dark:to-purple-700/90 backdrop-blur-md rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/20">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <span>💡</span>
                  <span>Pro Tips</span>
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start space-x-2 opacity-90 hover:opacity-100 transition-opacity">
                    <span>•</span>
                    <span>Always estimate gas before deployment</span>
                  </li>
                  <li className="flex items-start space-x-2 opacity-90 hover:opacity-100 transition-opacity">
                    <span>•</span>
                    <span>Test contracts thoroughly on testnet</span>
                  </li>
                  <li className="flex items-start space-x-2 opacity-90 hover:opacity-100 transition-opacity">
                    <span>•</span>
                    <span>Keep your private keys secure</span>
                  </li>
                  <li className="flex items-start space-x-2 opacity-90 hover:opacity-100 transition-opacity">
                    <span>•</span>
                    <span>Verify contracts on block explorer</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-white/20 dark:border-gray-700/30 mt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400 transition-colors duration-300">
            <p className="flex items-center justify-center space-x-2">
              <span>&copy; 2024 Nexus Smart Contract Deployer.</span>
              <span>Built for the Nexus ecosystem with</span>
              <span className="text-red-500 animate-pulse">♥</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;