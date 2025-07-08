import React from 'react'
import { motion } from 'framer-motion'
import { History, ExternalLink, Copy } from 'lucide-react'

interface Deployment {
  id: string
  contractAddress: string
  txHash: string
  timestamp: Date
  name: string
  symbol: string
}

interface DeploymentHistoryProps {
  deployments: Deployment[]
}

export const DeploymentHistory: React.FC<DeploymentHistoryProps> = ({ deployments }) => {
  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const openExplorer = (type: 'address' | 'tx', value: string) => {
    const baseUrl = 'https://testnet3.explorer.nexus.xyz'
    const url = type === 'address' ? `${baseUrl}/address/${value}` : `${baseUrl}/tx/${value}`
    window.open(url, '_blank')
  }

  if (deployments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-gray-700/50"
      >
        <div className="text-center">
          <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Deployments Yet</h3>
          <p className="text-gray-500 dark:text-gray-500">Your deployed contracts will appear here</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-gray-700/50"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
          <History className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Deployment History</h2>
      </div>

      <div className="space-y-4">
        {deployments.map((deployment, index) => (
          <motion.div
            key={deployment.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/20 dark:bg-gray-700/50 rounded-xl p-6 border border-white/30 dark:border-gray-600/50"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {deployment.name} ({deployment.symbol})
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {deployment.timestamp.toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openExplorer('address', deployment.contractAddress)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Contract:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-mono text-gray-800 dark:text-white">
                    {shortenAddress(deployment.contractAddress)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(deployment.contractAddress)}
                    className="p-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Transaction:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-mono text-gray-800 dark:text-white">
                    {shortenAddress(deployment.txHash)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(deployment.txHash)}
                    className="p-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => openExplorer('tx', deployment.txHash)}
                    className="p-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}