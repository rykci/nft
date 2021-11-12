// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract DatabaseMinter is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    string public baseURI;

    // set contract name and ticker. 
    constructor(string memory tokenName, string memory symbol) ERC721(tokenName, symbol) {
        setBaseURI("http://192.168.88.41:5050/ipfs/");
    }


    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    //get the current supply of tokens
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    
    function mintData(address minter, string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(minter, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        return newTokenId;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }
    
    // This will payout the owner the contract balance.
    // Do not remove this otherwise you will not be able to withdraw the funds.
    // =============================================================================
  function withdraw() public payable onlyOwner {
      (bool os, ) = payable(owner()).call{value: address(this).balance}("");
    require(os);
  }
}