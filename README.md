# Nexus Smart Contract Deployer

A comprehensive web application for connecting to Nexus blockchain and deploying smart contracts with an intuitive interface.

## Features

### Wallet Integration
- Connect to Nexus testnet with MetaMask
- Automatic network switching and addition
- Real-time balance updates
- Secure wallet management

### Smart Contract Deployment
- Pre-built contract templates (Storage, ERC-20 Token, NFT)
- Interactive parameter configuration
- One-click deployment to Nexus testnet
- Real-time deployment status
- Contract verification and explorer integration

### Contract Templates

#### Simple Storage
- Basic data storage contract
- Get/set functionality
- Owner management
- Event logging

#### ERC-20 Token
- Standard token implementation
- Configurable name, symbol, decimals
- Transfer and approval functionality
- Mint and burn capabilities

#### Simple NFT
- Basic NFT collection contract
- Configurable collection metadata
- Minting functionality
- Ownership tracking

## Getting Started

### Prerequisites
- Node.js 18+ 
- MetaMask browser extension
- Some Nexus testnet tokens for gas fees

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Smart Contract Development

1. Create a `.env` file based on `.env.example`
2. Add your private key for deployment
3. Compile contracts:
   ```bash
   npm run compile
   ```

4. Deploy contracts:
   ```bash
   npm run deploy
   ```

5. Run tests:
   ```bash
   npm run test
   ```

## Network Configuration

The app is configured for Nexus testnet:
- **Chain ID**: 3940
- **RPC URL**: https://testnet3.rpc.nexus.xyz
- **Explorer**: https://testnet3.explorer.nexus.xyz

## Usage

### Connecting Your Wallet
1. Click "Connect Wallet" 
2. Approve MetaMask connection
3. The app will automatically add Nexus testnet to MetaMask
4. Switch to Nexus testnet if prompted

### Deploying Smart Contracts
1. Switch to the "Smart Contracts" tab
2. Select a contract template
3. Configure contract parameters
4. Review deployment details
5. Click "Deploy Contract"
6. Confirm the transaction in MetaMask
7. View your deployed contract on the explorer

## Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Ethers.js** for blockchain interaction
- **Lucide React** for icons

### Smart Contracts
- **Hardhat** development environment
- **Solidity 0.8.19**
- **TypeChain** for type generation
- **OpenZeppelin** standards compliance

### Key Components
- `useWallet` - Wallet connection and management
- `useContractDeployment` - Contract deployment logic
- `SmartContractDeployer` - Main deployment interface
- `ContractTemplateCard` - Template selection
- `ContractParameterForm` - Parameter configuration
- `ContractDeployment` - Deployment execution

## Security Features

- Client-side parameter validation
- Secure private key handling
- Transaction confirmation prompts
- Error handling and user feedback
- Network verification

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Check the Nexus documentation
- Open an issue on GitHub
- Join the Nexus community Discord