import { expect } from "chai";
import hre from "hardhat";

describe("CsvCoreTest", function() {
    
    let owner: any;
    let user1: any;
    let csvCoreContract: any;


    beforeEach(async function () {

        [owner, user1] = await hre.ethers.getSigners();

        const _csvCoreContract = await hre.ethers.getContractFactory("CsvCore");
        csvCoreContract = await _csvCoreContract.deploy();

    });

    it("Should be able to create a new token", async function() {

        await csvCoreContract.createCarbonCreditToken(user1.address);
        const balance = await csvCoreContract.getProjectTokensByOwner(user1.address)
        expect(balance.length).to.equal(1);

    });

    it("Should be able to create 2 new tokens", async function() {

        await csvCoreContract.createCarbonCreditToken(user1.address);
        await csvCoreContract.createCarbonCreditToken(user1.address);
        const balance = await csvCoreContract.getProjectTokensByOwner(user1.address)
        expect(balance.length).to.equal(2);

    });

});