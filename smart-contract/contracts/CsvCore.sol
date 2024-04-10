// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// This ERC721 contact will be used for owners/organizations to register their carbon projects as NFT
contract CsvCore is ERC721, Ownable {

    // Mapping of project owners to their token(s)
    mapping(address => address[]) public projectTokensByOwner;

    uint256 private _nextTokenId;
    uint256 private constant START_TOKEN_ID = 1;
    CarbonCreditTokenFactory public carbonCreditTokenFactory;

    event ProjectTokenCreated(address indexed owner, address projectTokenAddress, string name, string symbol);

    constructor () ERC721("CsvCore", "CSV") {}

    function createProject(address owner, string memory name, string memory symbol) public {
        require(msg.sender == tx.origin, "Only EOA can call this function");

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        // Call the CarbonCreditTokenFactory to create a new token for this project
        address projectTokenAddress carbonCreditTokenFactory.createCarbonCreditToken(owner, name, symbol);

        // Store the project token address to the owner's address
        projectTokensByOwner[owner].push(projectTokenAddress);

        // Emit the project token creation event
        emit ProjectTokenCreated(owner, projectTokenAddress, name, symbol);
    }

    function setCarbonCreditTokenFactory(CarbonCreditTokenFactory _carbonCreditTokenFactory) public onlyOwner {
        carbonCreditTokenFactory = _carbonCreditTokenFactory;
    }

}

