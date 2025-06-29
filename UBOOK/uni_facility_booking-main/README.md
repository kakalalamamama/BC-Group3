# Backend – Hardhat Smart Contracts

This directory contains the **Solidity smart contracts**, **deployment scripts**, and **tests** for the Facility Booking DApp.

## Contracts

- `FacilityBooking.sol` – Core logic for booking, checking availability
- `FacilityTypeManagement.sol` – Manage types of facilities

## ▶Getting Started

```bash
npm install
npx hardhat compile
npx hardhat test
```

To deploy locally:

```bash
npx hardhat node
npx hardhat run scripts/deployFacilityBooking.js --network localhost
```

## Structure

- `contracts/` – Smart contract source code
- `scripts/` – Deployment scripts
- `test/` – Contract tests
- `ignition/` – Hardhat Ignition modules for modular deployment
- `artifacts/` & `cache/` – Auto-generated build outputs

## Integration

After deployment, copy ABI files from:

```
/artifacts/contracts/*.json
```

Into frontend `/frontend/contracts/` to allow interaction with the deployed contracts.

## Testing

```bash
npx hardhat test
```

Tests are written in JavaScript using Chai.


