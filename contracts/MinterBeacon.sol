// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MinterBeacon is Ownable {

    UpgradeableBeacon immutable beacon;

    constructor(address _implementation) {
        beacon = new UpgradeableBeacon(_implementation);
    }

    function update(address newImplementation) public onlyOwner {
        beacon.upgradeTo(newImplementation);
    }

    function implementation() public view returns (address) {
        return beacon.implementation();
    }

}
