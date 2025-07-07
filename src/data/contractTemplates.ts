import { ContractTemplate } from '../types/contracts';

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: 'simple-storage',
    name: 'Simple Storage',
    description: 'A basic smart contract for storing and retrieving data with ownership controls',
    category: 'storage',
    parameters: [
      {
        name: 'initialValue',
        type: 'uint256',
        description: 'Initial value to store in the contract',
        required: true,
        defaultValue: '42'
      }
    ],
    sourceCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SimpleStorage {
    uint256 private storedData;
    address public owner;
    
    event DataStored(uint256 indexed value, address indexed setter);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
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
    
    function increment() public {
        storedData += 1;
        emit DataStored(storedData, msg.sender);
    }
    
    function decrement() public {
        require(storedData > 0, "Cannot decrement below zero");
        storedData -= 1;
        emit DataStored(storedData, msg.sender);
    }
    
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        address previousOwner = owner;
        owner = _newOwner;
        emit OwnershipTransferred(previousOwner, _newOwner);
    }
}`
  },
  {
    id: 'simple-token',
    name: 'ERC-20 Token',
    description: 'A standard ERC-20 token contract with mint and burn functionality',
    category: 'token',
    parameters: [
      {
        name: 'name',
        type: 'string',
        description: 'Token name (e.g., "My Token")',
        required: true,
        defaultValue: 'MyToken'
      },
      {
        name: 'symbol',
        type: 'string',
        description: 'Token symbol (e.g., "MTK")',
        required: true,
        defaultValue: 'MTK'
      },
      {
        name: 'decimals',
        type: 'uint8',
        description: 'Number of decimal places (usually 18)',
        required: true,
        defaultValue: '18'
      },
      {
        name: 'initialSupply',
        type: 'uint256',
        description: 'Initial token supply (without decimals)',
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
    address public owner;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 value);
    event Burn(address indexed from, uint256 value);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _initialSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _initialSupply * 10**_decimals;
        owner = msg.sender;
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_to != address(0), "Cannot transfer to zero address");
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    
    function approve(address _spender, uint256 _value) public returns (bool) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(_to != address(0), "Cannot transfer to zero address");
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Insufficient allowance");
        
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
    
    function mint(address _to, uint256 _value) public onlyOwner {
        require(_to != address(0), "Cannot mint to zero address");
        totalSupply += _value;
        balanceOf[_to] += _value;
        emit Mint(_to, _value);
        emit Transfer(address(0), _to, _value);
    }
    
    function burn(uint256 _value) public {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance to burn");
        balanceOf[msg.sender] -= _value;
        totalSupply -= _value;
        emit Burn(msg.sender, _value);
        emit Transfer(msg.sender, address(0), _value);
    }
}`
  },
  {
    id: 'simple-nft',
    name: 'NFT Collection',
    description: 'A simple NFT contract for creating digital collectibles with metadata support',
    category: 'nft',
    parameters: [
      {
        name: 'name',
        type: 'string',
        description: 'NFT collection name (e.g., "My NFT Collection")',
        required: true,
        defaultValue: 'MyNFT'
      },
      {
        name: 'symbol',
        type: 'string',
        description: 'NFT collection symbol (e.g., "MNFT")',
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
    address public owner;
    
    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => address) public getApproved;
    mapping(address => mapping(address => bool)) public isApprovedForAll;
    mapping(uint256 => string) public tokenURI;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
    }
    
    function mint(address _to, uint256 _tokenId, string memory _tokenURI) public onlyOwner {
        require(_to != address(0), "Cannot mint to zero address");
        require(ownerOf[_tokenId] == address(0), "Token already exists");
        
        ownerOf[_tokenId] = _to;
        balanceOf[_to] += 1;
        totalSupply += 1;
        tokenURI[_tokenId] = _tokenURI;
        
        emit Transfer(address(0), _to, _tokenId);
    }
    
    function transfer(address _to, uint256 _tokenId) public {
        require(_to != address(0), "Cannot transfer to zero address");
        require(ownerOf[_tokenId] == msg.sender, "Not the owner of this token");
        
        ownerOf[_tokenId] = _to;
        balanceOf[msg.sender] -= 1;
        balanceOf[_to] += 1;
        
        emit Transfer(msg.sender, _to, _tokenId);
    }
    
    function approve(address _approved, uint256 _tokenId) public {
        require(ownerOf[_tokenId] == msg.sender, "Not the owner of this token");
        getApproved[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }
    
    function setApprovalForAll(address _operator, bool _approved) public {
        isApprovedForAll[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }
    
    function transferFrom(address _from, address _to, uint256 _tokenId) public {
        require(_to != address(0), "Cannot transfer to zero address");
        require(ownerOf[_tokenId] == _from, "From address is not the owner");
        require(
            msg.sender == _from || 
            getApproved[_tokenId] == msg.sender || 
            isApprovedForAll[_from][msg.sender],
            "Not approved to transfer this token"
        );
        
        ownerOf[_tokenId] = _to;
        balanceOf[_from] -= 1;
        balanceOf[_to] += 1;
        getApproved[_tokenId] = address(0);
        
        emit Transfer(_from, _to, _tokenId);
    }
}`
  }
];