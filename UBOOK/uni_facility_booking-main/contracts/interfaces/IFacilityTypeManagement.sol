// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IFacilityTypeManagement {
    // Structs
    struct FacilityType {
        uint256 typeId;
        string typeName;
        string description;
        uint256 capacity;
        bool isActive;
    }

    // Events
    event FacilityTypeAdded(uint256 indexed typeId, string typeName, address indexed addedBy);
    event FacilityTypeUpdated(uint256 indexed typeId, address indexed updatedBy);
    event FacilityTypeDeleted(uint256 indexed typeId, address indexed deletedBy);

    // Errors
    error TypeNameAlreadyExists(string typeName);
    error TypeNotFound(uint256 typeId);
    error InvalidCapacity();
    error UnauthorizedAccess(address account);

    // Core Functions
    function addFacilityType(
        string memory _typeName,
        string memory _description,
        uint256 _capacity
    ) external returns (uint256);

    function deleteFacilityType(uint256 _typeId) external;

    function updateFacilityType(
        uint256 _typeId,
        string memory _newTypeName,
        string memory _newDescription,
        uint256 _newCapacity
    ) external;

    function getFacilityType(uint256 _typeId) external view returns (
        string memory typeName,
        string memory description,
        uint256 capacity,
        bool isActive
    );

    // Role Management Functions
    function grantManagerRole(address account) external;
    function revokeManagerRole(address account) external;
}