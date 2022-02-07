// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @custom:security-contact ryuen@nbai.io
contract Minter is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    string private _name;
    string private _symbol;
    string public baseURI;
    string public contractURI;

    mapping (address => bool) isAdmin;

    /// @custom:oz-upgrades-unsafe-allow constructor
    //constructor() initializer {}

    constructor (address _admin, string memory name_, string memory symbol_)  ERC721(name_, symbol_) {
        require(_admin != address(0));
        isAdmin[_admin] = true;

        _name = name_;
        _symbol = symbol_;
    }

    modifier onlyAdmin {
        require(isAdmin[msg.sender], "this sender is not an admin");
        _;
    }

    function setAdmin(address _address) public onlyOwner {
        isAdmin[_address] = true;
    }

    function removeAdmin(address _address) public onlyOwner {
        isAdmin[_address] = false;
    }

    function mintData(address minter, string memory uri)
        public
        onlyAdmin
        returns (uint256)
    {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(minter, tokenId);
        _setTokenURI(tokenId, uri);

        return tokenId;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // setter functions

    function setBaseURI(string memory _newBaseURI) public onlyAdmin {
        baseURI = _newBaseURI;
    }


    function setContractURI(string memory _newContractURI) public onlyAdmin {
        contractURI = _newContractURI;
    }

    // get the current supply of tokens
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    // getter and setter for name and symbol
    function name() public view override(ERC721) returns (string memory) {
        return _name;
    }

    function symbol() public view override(ERC721) returns (string memory) {
        return _symbol;
    }

    function setName(string memory name_) public onlyAdmin {
        _name = name_;
    }

    function setSymbol(string memory symbol_) public onlyAdmin {
        _symbol = symbol_;
    }
}
