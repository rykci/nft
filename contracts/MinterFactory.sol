// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./MinterBeacon.sol";
import "./Minter.sol";

interface IMinter {
    function mintData(address minter, string memory uri) external returns (uint256);
    function totalSupply() external view returns (uint256);
    function tokenURI(uint256 tokenId) external view  returns (string memory);

    function setContractURI(string memory _newContractURI) external;
    function setName(string memory name_) external;
    function setSymbol(string memory symbol_) external;
}

contract MinterFactory is OwnableUpgradeable{
    MinterBeacon private beacon;

    mapping(address => address) private minterAddressToUser;
    mapping(address => address[]) private userToMinterAddresses;

    function initialize(address initialImplementation) public initializer {
        beacon = new MinterBeacon(initialImplementation);
        __Ownable_init();
    }

    function updateBeaconImplementation(address newImplementation) public onlyOwner {
        beacon.update(newImplementation);
    }

    // creates Minter Beacon Proxy, sets msg.sender to be admin, factory will be admin
    function createMinter(string calldata name, string calldata symbol) public returns (address){
        BeaconProxy minter = new BeaconProxy(address(beacon), abi.encodeWithSelector(Minter(address(0)).initialize.selector, address(this), name, symbol));
        userToMinterAddresses[msg.sender].push(address(minter));
        minterAddressToUser[address(minter)] = (msg.sender);

        Minter(address(minter)).setAdmin(msg.sender);
        Minter(address(minter)).transferOwnership(msg.sender);

        return address(minter); 
    }

    // getter functions

    function getMinterAddresses(address user) public view returns (address[] memory) {
        return userToMinterAddresses[user];
    }

    function getBeacon() public view returns (address) {
        return address(beacon);
    }

    function getImplementation() public view returns (address) {
        return beacon.implementation();
    }

    // minter functions

    modifier isAuthorized(address minter) {
      require(minterAddressToUser[minter] == msg.sender, 'this is not your minter');
      _;
   }

    function mintData(address minter, address user, string calldata uri) public isAuthorized(minter) returns (uint256){
        return IMinter(minter).mintData(user, uri);
    }

    function totalSupply(address minter) public view isAuthorized(minter) returns (uint256){
        return IMinter(minter).totalSupply();
    }

    function tokenURI(address minter, uint256 tokenId) public view isAuthorized(minter) returns (string memory){
        return IMinter(minter).tokenURI(tokenId);
    }

    function setContractURI(address minter,  string memory _newContractURI) public isAuthorized(minter) {
        IMinter(minter).setContractURI(_newContractURI);
    }
    function setName( address minter, string memory name_) public isAuthorized(minter) {
        IMinter(minter).setName(name_);
    }
    function setSymbol( address minter, string memory symbol_) public isAuthorized(minter){
        IMinter(minter).setSymbol(symbol_);
    }
}