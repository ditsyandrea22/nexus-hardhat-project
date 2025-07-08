import React, { useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { wagmiConfig } from './config/wagmi'
import { WalletStatus } from './components/WalletStatus'
import { DeploymentForm } from './components/DeploymentForm'
import { DeploymentHistory } from './components/DeploymentHistory'
import { ThemeToggle } from './components/ThemeToggle'
import { NetworkInfo } from './components/NetworkInfo'
import { Code, Zap } from 'lucide-react'

import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

interface Deployment {
  id: string
  contractAddress: string
  txHash: string
  timestamp: Date
  name: string
  symbol: string
}

function App() {
  const [deployments, setDeployments] = useState<Deployment[]>([])

  const handleDeploymentSuccess = (contractAddress: string, txHash: string) => {
    // In a real app, you'd get these from the form data
    const deployment: Deployment = {
      id: Date.now().toString(),
      contractAddress,
      txHash,
      timestamp: new Date(),
      name: 'New Token', // You'd pass this from the form
      symbol: 'NTK' // You'd pass this from the form
    }
    setDeployments(prev => [deployment, ...prev])
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-colors duration-500">
            <ThemeToggle />
            
            <div className="container mx-auto px-4 py-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Nexus ERC20 Deployer
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Deploy your own ERC20 tokens on the Nexus testnet with a few clicks. 
                  Connect your wallet and start building the future of decentralized finance.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <WalletStatus />
                  
                  <DeploymentForm onDeploymentSuccess={handleDeploymentSuccess} />
                  
                  <DeploymentHistory deployments={deployments} />
                </div>
                
                <div className="space-y-8">
                  <NetworkInfo />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Quick Guide</h3>
                    </div>
                    
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-start space-x-2">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">1</div>
                        <p>Connect your wallet using the button above</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">2</div>
                        <p>Fill in your token details (name, symbol, supply)</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">3</div>
                        <p>Click deploy and confirm the transaction</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">4</div>
                        <p>View your deployed contract in the history</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App