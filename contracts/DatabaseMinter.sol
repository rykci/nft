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
    constructor(string memory tokenName, string memory symbol, string memory _initBaseURI) ERC721(tokenName, symbol) {
        setBaseURI(_initBaseURI);
    }


    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // get the current supply of tokens
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    // mint token
    function mintData(address minter, string memory tokenURI)
        public
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
    
    function contractURI() public pure returns (string memory) {
        return "https://calibration-ipfs.filswan.com/ipfs/QmaCZFE51FfGR8YhWduu9TNbgB9tpyVyAUQgY3Dpts6Hfn";
    }
}