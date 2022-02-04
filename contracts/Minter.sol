// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

/// @custom:security-contact ryuen@nbai.io
contract Minter is Initializable, ERC721Upgradeable, ERC721URIStorageUpgradeable, OwnableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;

    string public baseURI;
    string public contractURI;

    /// @custom:oz-upgrades-unsafe-allow constructor
    //constructor() initializer {}

    function initialize(string memory _name, string memory _symbol) initializer public {
        __ERC721_init(_name, _symbol);
        __ERC721URIStorage_init();
        __Ownable_init();
    }

    function mintData(address minter, string memory uri)
        public
        onlyOwner
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
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // setter functions

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }


    function setContractURI(string memory _newContractURI) public onlyOwner {
        contractURI = _newContractURI;
    }

    // get the current supply of tokens
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
}
