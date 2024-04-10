// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./CarbonCreditToken.sol";

contract CarbonCreditTokenFactory {

    constructor() {}

    modifier onlyCsvCore() {
        require(msg.sender == address(csvCore), "Only CsvCore can call this function");
        _;
    }

    function createCarbonCreditToken(address owner, string memory name, string memory symbol) public returns (address) {
        CarbonCreditToken token = new CarbonCreditToken(owner, name, symbol);
        return address(token);
    }
}