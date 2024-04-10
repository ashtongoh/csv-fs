// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./CarbonCreditToken.sol";

// This core contract acts as factory contract for creating carbon credit projects
contract CsvCore {

    // Mapping of project owners to their token(s)
    mapping(address => address[]) public projectTokensByOwner;

    // To store all the events
    string[] public coreContractEvents;

    // Events
    event ProjectTokenCreated(address indexed owner, address projectTokenAddress);

    function createCarbonCreditToken(address owner) external returns (address){
        require(msg.sender == tx.origin, "Only EOA allowed");

        // Create new instance of CarbonCreditToken
        CarbonCreditToken token = new CarbonCreditToken(owner);

        // Store the project token address to the owner's address
        projectTokensByOwner[owner].push(address(token));

        string memory eventString = string(abi.encodePacked(Strings.toHexString(owner), " ", "created a new project:", " ", Strings.toHexString(address(token))));

        // Store event in coreContractEvents
        coreContractEvents.push(eventString);

        // Emit the project token creation event
        emit ProjectTokenCreated(owner, address(token));

        return address(token);
    }

    function getProjectTokensByOwner(address owner) external view returns (address[] memory) {
        return projectTokensByOwner[owner];
    }

    function getCoreContractEvents() external view returns (string[] memory) {
        return coreContractEvents;
    }
}