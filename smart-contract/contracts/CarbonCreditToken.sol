// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract CarbonCreditToken is ERC1155, ERC1155Burnable, ERC1155Supply, Ownable {
    
    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

    // Create counter for reporting period
    uint256 public reportingPeriod = 0;
    uint256 public pricePerCredit = 1 gwei;

    // Events
    event CreditsListed(uint256 amount);
    event PricePerCreditSet(uint256 pricePerCredit);
    event CreditsBought(address buyer, uint256 amount);
    event CreditsConsumed(address consumer, uint256 amount);
    event ReportingPeriodUpdated(uint256 reportingPeriod);

    //////////////////////
    // Public functions
    ///////////////////// 

    function buyCredits(uint256 amount) external payable {
        require(msg.sender == tx.origin, "Only EOA allowed");

        uint256 cost = amount * pricePerCredit;
        require(msg.value >= cost, "Incorrect payment");

        // Ensure the contract has enough tokens to sell
        require(
            balanceOf(owner(), reportingPeriod) >= amount,
            "Not enough credits in contract to sell"
        );

        // Transfer tokens from the owner to the buyer
        _safeTransferFrom(owner(), msg.sender, reportingPeriod, amount, "");

        // Handle overpayment
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }

        emit CreditsBought(msg.sender, amount);
    }

    function consumeCredits(uint256 amount) external {
        require(
            balanceOf(msg.sender, reportingPeriod) >= amount,
            "Not enough credits"
        );
        _burn(msg.sender, reportingPeriod, amount);

        emit CreditsConsumed(msg.sender, amount);
    }

    ////////////////////// 
    // Owner functions
    /////////////////////

    function listCredits(uint256 amount) public onlyOwner {
        _mint(owner(), reportingPeriod, amount, "");

        emit CreditsListed(amount);
    }

    function setPricePerCredit(uint256 _pricePerCredit) public onlyOwner {
        pricePerCredit = _pricePerCredit;

        emit PricePerCreditSet(_pricePerCredit);
    }

    function updateReportingPeriod() public onlyOwner {
        reportingPeriod++;

        emit ReportingPeriodUpdated(reportingPeriod);
    }

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, values);
    }
}
