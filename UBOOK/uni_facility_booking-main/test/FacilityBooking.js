const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Facility Booking System", function () {
    let FacilityTypeManagement;
    let facilityTypeManager;
    let facilityBooking;
    let owner;
    let manager;
    let user;

    beforeEach(async function () {
        [owner, manager, user] = await ethers.getSigners();

        // Deploy FacilityTypeManagement
        FacilityTypeManagement = await ethers.getContractFactory("FacilityTypeManagement");
        facilityTypeManager = await FacilityTypeManagement.deploy();
        await facilityTypeManager.waitForDeployment();

        
        // Deploy FacilityBooking
        FacilityBooking = await ethers.getContractFactory("FacilityBooking");
        facilityBooking = await FacilityBooking.deploy(await facilityTypeManager.getAddress());
        await facilityBooking.waitForDeployment();

        // Grant manager role
        await facilityTypeManager.grantManagerRole(manager.address);
    });

    describe("FacilityTypeManagement", function () {
        it("Should add a new facility type", async function () {
            const tx = await facilityTypeManager.addFacilityType(
                "Classroom",
                "Standard classroom",
                30
            );
            const receipt = await tx.wait();
            
            expect(receipt).to.emit(facilityTypeManager, "FacilityTypeAdded").withArgs(
                1, // Assuming this is the first type added
                "Classroom",
                "Standard classroom",
                30,
                owner.address
            );
        });

        it("Should not add facility type with duplicate name", async function () {
            await facilityTypeManager.addFacilityType("Classroom", "First classroom", 30);
            await expect(
                facilityTypeManager.addFacilityType("Classroom", "Second classroom", 40)
            ).to.be.revertedWithCustomError(facilityTypeManager, "TypeNameAlreadyExists");
        });

        it("Should update facility type", async function () {
            await facilityTypeManager.addFacilityType("Lab", "Computer Lab", 20);
            const tx = await facilityTypeManager.updateFacilityType(1, "New Lab", "Updated Lab", 25);
            
            const facility = await facilityTypeManager.getFacilityType(1);
            expect(facility.typeName).to.equal("New Lab");
            expect(facility.capacity).to.equal(25);
        });
    });

    describe("FacilityBooking", function () {
        beforeEach(async function () {
            // Add a facility type for testing
            await facilityTypeManager.addFacilityType("Test Room", "Test Description", 30);
        });

        it("Should book a facility", async function () {
            const startTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
            const endTime = startTime + 3600; // 2 hours from now

            await facilityBooking.book(1, startTime, endTime);
            
            const booking = await facilityBooking.bookings(1, 0);
            expect(booking.user).to.equal(owner.address);
            expect(booking.startTime).to.equal(startTime);
            expect(booking.endTime).to.equal(endTime);
        });

        it("Should not book unavailable facility", async function () {
            const startTime = Math.floor(Date.now() / 1000) + 3600;
            const endTime = startTime + 3600;

            await facilityBooking.book(1, startTime, endTime);
            
            await expect(
                facilityBooking.book(1, startTime, endTime)
            ).to.be.revertedWith("Not available");
        });

        it("Should check facility type availability", async function () {
            const isAvailable = await facilityBooking.checkType(1);
            expect(isAvailable).to.be.true;

            // Delete facility type
            await facilityTypeManager.deleteFacilityType(1);
            
            const isAvailableAfterDelete = await facilityBooking.checkType(1);
            expect(isAvailableAfterDelete).to.be.false;
        });

        it("Should cancel booking", async function () {
            const startTime = Math.floor(Date.now() / 1000) + 3600;
            const endTime = startTime + 3600;

            await facilityBooking.book(1, startTime, endTime);
            await facilityBooking.cancel(1, 0);

            const booking = await facilityBooking.bookings(1, 0);
            expect(booking.user).to.equal(ethers.ZeroAddress);
        });

        it("Should allow rebooking after cancellation", async function () {
            const startTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
            const endTime = startTime + 3600; // 2 hours from now

            // First booking
            await facilityBooking.book(1, startTime, endTime);
            
            // Cancel the booking
            await facilityBooking.cancel(1, 0);
            
            // Try to book the same time slot again
            await facilityBooking.book(1, startTime, endTime);
            
            // Verify the new booking
            const booking = await facilityBooking.bookings(1, 1);
            expect(booking.user).to.equal(owner.address);
            expect(booking.startTime).to.equal(startTime);
            expect(booking.endTime).to.equal(endTime);
            expect(booking.facilityId).to.equal(1);
        });
    });
});