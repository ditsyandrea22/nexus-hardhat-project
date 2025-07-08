import { Chain } from 'viem'

export const nexusTestnet = {
  id: 3940,
  name: 'Nexus Testnet',
  network: 'nexus-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Nexus',
    symbol: 'NXS',
  },
  rpcUrls: {
    public: { http: ['https://testnet3.rpc.nexus.xyz'] },
    default: { http: ['https://testnet3.rpc.nexus.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Nexus Explorer', url: 'https://testnet3.explorer.nexus.xyz' },
  },
  testnet: true,
} as const satisfies Chain