// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./interfaces/IFacilityTypeManagement.sol";

contract FacilityBooking {
    IFacilityTypeManagement public manager;

    struct Booking {
        address user;
        uint256 startTime;
        uint256 endTime;
        uint256 facilityId;
    }

    mapping(uint256 => Booking[]) public bookings;
    mapping(uint256 => uint256) public availability;

    error TypeNotAvailable(uint256 facilityId);
    error TypeNotFound(uint256 facilityId);

    constructor(address _manager) {
        require(_manager != address(0), "Invalid manager address");
        manager = IFacilityTypeManagement(_manager);
    }

    function checkType(uint256 facilityId) public view returns (bool) {
        try manager.getFacilityType(facilityId) returns (
            string memory,
            string memory,
            uint256,
            bool isActive
        ) {
            return isActive;
        } catch {
            return false;
        }
    }

    function book(uint256 facilityId, uint256 startTime, uint256 endTime) external {
        require(startTime < endTime, "Invalid time");
        require(isAvailable(facilityId, startTime, endTime), "Not available");
        
        if (!checkType(facilityId)) {
            revert TypeNotAvailable(facilityId);
        }

        bookings[facilityId].push(Booking(msg.sender, startTime, endTime, facilityId));
        availability[facilityId] += (endTime - startTime);
    }

    function cancel(uint256 facilityId, uint256 bookingIndex) external {
        Booking storage booking = bookings[facilityId][bookingIndex];
        require(msg.sender == booking.user, "Not owner");

        availability[facilityId] -= (booking.endTime - booking.startTime);
        delete bookings[facilityId][bookingIndex];
    }

    function isAvailable(uint256 facilityId, uint256 startTime, uint256 endTime) 
        public 
        view 
        returns (bool) 
    {
        for (uint256 i = 0; i < bookings[facilityId].length; i++) {
            Booking memory booking = bookings[facilityId][i];
            if ((startTime >= booking.startTime && startTime < booking.endTime) || 
                (endTime > booking.startTime && endTime <= booking.endTime)) {
                return false;
            }
        }
        return true;
    }
}