// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCreditToken is ERC20, ERC20Burnable, Ownable {

    uint256 public pricePerCredit = 1 gwei;

    // Events
    event CreditsListed(uint256 amount);
    event PricePerCreditSet(uint256 pricePerCredit);
    event CreditsBought(address buyer, uint256 amount);
    event CreditsConsumed(address consumer, uint256 amount);

    constructor(
        address initialOwner,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) Ownable(initialOwner) {}

    // Owner functions to mint and set the price

    function listCredits(uint256 amount) public onlyOwner {
        _mint(owner(), amount);
        emit CreditsListed(amount);
    }

    function setPricePerCredit(uint256 _pricePerCredit) public onlyOwner {
        pricePerCredit = _pricePerCredit;
        emit PricePerCreditSet(_pricePerCredit);
    }

    // Public functions to buy and consume credits

    function buyCredits(uint256 amount) public payable {
        uint256 cost = amount * pricePerCredit;
        require(msg.value >= cost, "Incorrect payment");

        // Ensure the contract has enough tokens to sell
        require(balanceOf(owner()) >= amount, "Not enough credits in contract to sell");

        // Transfer tokens from the owner to the buyer
        _transfer(owner(), msg.sender, amount);

        // Handle overpayment
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }
        emit CreditsBought(msg.sender, amount);
    }

    function consumeCredits(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "Not enough credits");
        _burn(msg.sender, amount);
        emit CreditsConsumed(msg.sender, amount);
    }
}
