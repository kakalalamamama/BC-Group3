const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Replace with your deployed FacilityTypeManagement address
    const FacilityTypeManagement = await ethers.getContractFactory("FacilityTypeManagement");
    //Get the address of the deployed FacilityTypeManagement contract
    let facilityTypeManager = (await FacilityTypeManagement).connect(deployer);
    facilityTypeManager = await facilityTypeManager.deploy();
    await facilityTypeManager.waitForDeployment();

    let facilityTypeManagerAddress = await facilityTypeManager.getAddress();
    console.log("FacilityTypeManagement deployed to:", facilityTypeManagerAddress);

    const tx = await facilityTypeManager.addFacilityType(
                "Classroom",
                "Standard classroom",
                30
            );
    const receipt = await tx.wait();

    await verify(facilityTypeManagerAddress, []);
    console.log("FacilityTypeManagement verified");

    // Get the contract factory
    const FacilityBooking = await ethers.getContractFactory("FacilityBooking");

    // Deploy the contract
    const facilityBooking = await FacilityBooking.deploy(facilityTypeManagerAddress);

    // Wait for deployment to finish
    await facilityBooking.waitForDeployment();
    await verify(await facilityBooking.getAddress(), [facilityTypeManagerAddress]);

    console.log("FacilityBooking deployed to:", await facilityBooking.getAddress());
}

const verify = async (contractAddress, args) => {
    console.log("Verifying contract...");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!");
        } else {
            console.log(e);
        }
    }
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});