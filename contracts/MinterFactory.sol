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

    // creates Minter Beacon Proxy, sets msg.sender to be admin, factory will be admin
    function createMinter(string calldata name, string calldata symbol) public returns (address){
        Minter minter = new Minter(msg.sender, name, symbol);
        // Minter(address(minter)).setAdmin(address(this)); // set factory as admin
        Minter(address(minter)).transferOwnership(msg.sender); // set msg.sender as owner

        userToMinterAddresses[msg.sender].push(address(minter));
        minterAddressToUser[address(minter)] = (msg.sender);

        return address(minter); 
    }

    // getter functions

    function getMinterAddresses(address user) public view returns (address[] memory) {
        return userToMinterAddresses[user];
    }

}