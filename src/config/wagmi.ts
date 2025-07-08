import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { nexusTestnet } from './chains'

export const wagmiConfig = getDefaultConfig({
  appName: 'Nexus ERC20 Deployer',
  projectId: '34548f090395c08d157465907480cc5d', // Get from https://cloud.walletconnect.com
  chains: [nexusTestnet],
  ssr: false,
})