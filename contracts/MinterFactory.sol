// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./Minter.sol";

contract MinterFactory is OwnableUpgradeable{
    mapping(address => address) private minterAddressToUser;
    mapping(address => address[]) private userToMinterAddresses;

    function initialize() public initializer {
        __Ownable_init();
    }

    function createMinter(string calldata name, string calldata symbol) public returns (address){
        Minter minter = new Minter(msg.sender, name, symbol); // new Minter instance
        Minter(address(minter)).setAdmin(address(this)); // set factory as admin
        Minter(address(minter)).transferOwnership(msg.sender); // set msg.sender as owner

        userToMinterAddresses[msg.sender].push(address(minter));
        minterAddressToUser[address(minter)] = (msg.sender);

        return address(minter); 
    }

    // getter functions

    function getMinterAddresses(address user) public view returns (address[] memory) {
        return userToMinterAddresses[user];
    }

    // Minter functions

    function mintData(address minterAddress, address to, string memory uri) public returns (uint256){
        require(minterAddressToUser[minterAddress] == msg.sender, 'sender does not own this minter');

        return Minter(minterAddress).mintData(to, uri);
    }

    function totalSupply(address minterAddress) public view returns (uint256){
        return Minter(minterAddress).totalSupply();
    }

    function tokenURI(address minterAddress, uint256 tokenId) public view returns (string memory){
        return Minter(minterAddress).tokenURI(tokenId);
    }
}