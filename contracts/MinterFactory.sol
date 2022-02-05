// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "./Minter.sol";
import "./MinterBeacon.sol";

contract MinterFactory {
    MinterBeacon immutable beacon;

    mapping(address => address) private minterAddressToUser;
    mapping(address => address[]) private userToMinterAddresses;

    constructor(address initialImplementation) {
        beacon = new MinterBeacon(initialImplementation);
    }

    function createMinter(string calldata name, string calldata symbol) public returns (address){
        BeaconProxy minter = new BeaconProxy(address(beacon), abi.encodeWithSelector(Minter(address(0)).initialize.selector, name, symbol));
        userToMinterAddresses[msg.sender].push(address(minter));
        minterAddressToUser[address(minter)] = (msg.sender);

        return address(minter); 
    }

    // TODO: mintData

    function getMinterAddresses(address user) public view returns (address[] memory) {
        return userToMinterAddresses[user];
    }

    function getBeacon() public view returns (address) {
        return address(beacon);
    }

    function getImplementation() public view returns (address) {
        return beacon.implementation();
    }
}