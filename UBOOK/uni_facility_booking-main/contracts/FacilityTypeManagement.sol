// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";


contract FacilityTypeManagement is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    struct FacilityType {
        uint256 typeId;
        string typeName;
        string description;
        uint256 capacity;
        bool isActive;
    }

    mapping(uint256 => FacilityType) public facilityTypes;
    mapping(string => bool) private typeNameExists;
    uint256 private typeIdCounter;

    event FacilityTypeAdded(uint256 indexed typeId, string typeName, address indexed addedBy);
    event FacilityTypeUpdated(uint256 indexed typeId, address indexed updatedBy);
    event FacilityTypeDeleted(uint256 indexed typeId, address indexed deletedBy);

    error TypeNameAlreadyExists(string typeName);
    error TypeNotFound(uint256 typeId);
    error InvalidCapacity();
    error UnauthorizedAccess(address account);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _setRoleAdmin(MANAGER_ROLE, ADMIN_ROLE);
    }

    modifier onlyAuthorized() {
        if (!hasRole(ADMIN_ROLE, msg.sender) && !hasRole(MANAGER_ROLE, msg.sender)) {
            revert UnauthorizedAccess(msg.sender);
        }
       _;
    }

    function addFacilityType(
        string memory _typeName,
        string memory _description,
        uint256 _capacity
    ) external onlyAuthorized returns (uint256) {
        if (typeNameExists[_typeName]) {
            revert TypeNameAlreadyExists(_typeName);
        }
        if (_capacity == 0) {
            revert InvalidCapacity();
        }

        typeIdCounter++;
        facilityTypes[typeIdCounter] = FacilityType({
            typeId: typeIdCounter,
            typeName: _typeName,
            description: _description,
            capacity: _capacity,
            isActive: true
        });

        typeNameExists[_typeName] = true;
        emit FacilityTypeAdded(typeIdCounter, _typeName, msg.sender);
        return typeIdCounter;
    }

    function deleteFacilityType(uint256 _typeId) external onlyAuthorized {
        if (!facilityTypes[_typeId].isActive) {
            revert TypeNotFound(_typeId);
        }

        string memory typeName = facilityTypes[_typeId].typeName;
        typeNameExists[typeName] = false;
        facilityTypes[_typeId].isActive = false;

        emit FacilityTypeDeleted(_typeId, msg.sender);
    }

    function updateFacilityType(
        uint256 _typeId,
        string memory _newTypeName,
        string memory _newDescription,
        uint256 _newCapacity
    ) external onlyAuthorized {
        if (!facilityTypes[_typeId].isActive) {
            revert TypeNotFound(_typeId);
        }
        if (_newCapacity == 0) {
            revert InvalidCapacity();
        }

        string memory oldTypeName = facilityTypes[_typeId].typeName;
        if (keccak256(bytes(_newTypeName)) != keccak256(bytes(oldTypeName))) {
            if (typeNameExists[_newTypeName]) {
                revert TypeNameAlreadyExists(_newTypeName);
            }
            typeNameExists[oldTypeName] = false;
            typeNameExists[_newTypeName] = true;
        }

        facilityTypes[_typeId].typeName = _newTypeName;
        facilityTypes[_typeId].description = _newDescription;
        facilityTypes[_typeId].capacity = _newCapacity;

        emit FacilityTypeUpdated(_typeId, msg.sender);
    }

    function getFacilityType(uint256 _typeId) external view returns (
        string memory typeName,
        string memory description,
        uint256 capacity,
        bool isActive
    ) {
        FacilityType storage facilityType = facilityTypes[_typeId];
        return (
            facilityType.typeName,
            facilityType.description,
            facilityType.capacity,
            facilityType.isActive
        );
    }

    function grantManagerRole(address account) external onlyRole(ADMIN_ROLE) {
        grantRole(MANAGER_ROLE, account);
    }

    function revokeManagerRole(address account) external onlyRole(ADMIN_ROLE) {
        revokeRole(MANAGER_ROLE, account);
    }
}