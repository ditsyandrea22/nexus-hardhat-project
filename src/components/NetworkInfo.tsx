import React from 'react'
import { motion } from 'framer-motion'
import { Network } from 'lucide-react'

export const NetworkInfo: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
          <Network className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Network Information</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Network:</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-white">Nexus Testnet</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Chain ID:</span>
          <span className="text-sm font-mono text-gray-800 dark:text-white">3940</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Currency:</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-white">NXS</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">Connected</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}