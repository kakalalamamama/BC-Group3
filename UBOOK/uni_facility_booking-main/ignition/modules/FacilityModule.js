const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FacilityModule", (m) => {

    // First deploy FacilityTypeManagement
    const facilityTypeManagement = m.contract("FacilityTypeManagement");

    // Grant manager role to the deployer
  
    // Then deploy FacilityBooking with FacilityTypeManagement address
    const facilityBooking = m.contract(
        "FacilityBooking",
        [],
    );

    return {
        facilityTypeManagement,
        facilityBooking,
    };
});