import { ContractTemplate } from '../types/contracts';

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: 'simple-storage',
    name: 'Simple Storage',
    description: 'A basic smart contract for storing and retrieving data',
    category: 'storage',
    parameters: [
      {
        name: 'initialValue',
        type: 'uint256',
        description: 'Initial value to store',
        required: true,
        defaultValue: '0'
      }
    ],
    sourceCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SimpleStorage {
    uint256 private storedData;
    address public owner;
    
    event DataStored(uint256 indexed value, address indexed setter);
    
    constructor(uint256 _initialValue) {
        storedData = _initialValue;
        owner = msg.sender;
        emit DataStored(_initialValue, msg.sender);
    }
    
    function set(uint256 _value) public {
        storedData = _value;
        emit DataStored(_value, msg.sender);
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
}`
  },
  {
    id: 'simple-token',
    name: 'ERC-20 Token',
    description: 'A standard ERC-20 token contract',
    category: 'token',
    parameters: [
      {
        name: 'name',
        type: 'string',
        description: 'Token name',
        required: true,
        defaultValue: 'MyToken'
      },
      {
        name: 'symbol',
        type: 'string',
        description: 'Token symbol',
        required: true,
        defaultValue: 'MTK'
      },
      {
        name: 'decimals',
        type: 'uint8',
        description: 'Token decimals',
        required: true,
        defaultValue: '18'
      },
      {
        name: 'initialSupply',
        type: 'uint256',
        description: 'Initial token supply',
        required: true,
        defaultValue: '1000000'
      }
    ],
    sourceCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SimpleToken {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _initialSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _initialSupply * 10**_decimals;
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}`
  },
  {
    id: 'simple-nft',
    name: 'NFT Collection',
    description: 'A simple NFT contract for creating digital collectibles',
    category: 'nft',
    parameters: [
      {
        name: 'name',
        type: 'string',
        description: 'NFT collection name',
        required: true,
        defaultValue: 'MyNFT'
      },
      {
        name: 'symbol',
        type: 'string',
        description: 'NFT collection symbol',
        required: true,
        defaultValue: 'MNFT'
      }
    ],
    sourceCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SimpleNFT {
    string public name;
    string public symbol;
    uint256 public totalSupply;
    
    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => string) public tokenURI;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    
    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }
    
    function mint(address _to, uint256 _tokenId, string memory _tokenURI) public {
        require(ownerOf[_tokenId] == address(0), "Token already exists");
        ownerOf[_tokenId] = _to;
        balanceOf[_to] += 1;
        totalSupply += 1;
        tokenURI[_tokenId] = _tokenURI;
        emit Transfer(address(0), _to, _tokenId);
    }
}`
  }
];