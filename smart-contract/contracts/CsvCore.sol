// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./CarbonCreditToken.sol";

// This core contract acts as factory contract for creating carbon credit projects
contract CsvCore {

    // Mapping of project owners to their token(s)
    mapping(address => address[]) public projectTokensByOwner;

    // Events
    event ProjectTokenCreated(address indexed owner, address projectTokenAddress);

    function createCarbonCreditToken(address owner) external {
        require(msg.sender == tx.origin, "Only EOA allowed");

        // Create new instance of CarbonCreditToken
        CarbonCreditToken token = new CarbonCreditToken(owner);

        // Store the project token address to the owner's address
        projectTokensByOwner[owner].push(address(token));

        // Emit the project token creation event
        emit ProjectTokenCreated(owner, address(token));
    }
}