// SPDX-License-Identifier: MIT
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
}