"use client";

// Add this declaration to fix the TypeScript error for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

import Image from "next/image";
import { useState, useRef } from "react";
import { ethers } from "ethers";
import abi from "../../contracts/FacilityBooking.json"; // Adjust the path to your ABI
import FeatureModal from "@/Components/FeatureModal"; // Adjust the path to your FeatureModal component
import DashboardModal from "@/Components/DashboardModal";
import features from "@/data/Features"; // Adjust the path to your features data
import AlertModal from "@/Components/AlertModal"; // Add this import

const contractAddress = "0xEDd35F47A9eba7D98A91B780b455bdbA7bE61b0b"; // Replace with your bookingContract address

const jsonRpcProvider = new ethers.JsonRpcProvider("https://1rpc.io/sepolia");

function getFeatureById(facilityId: string | number) {
  return features
    .flat()
    .find((feature) => String(feature.facilityId) === String(facilityId));
}

export default function Home() {
  const [account, setAccount] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  // Use refs to persist provider and contract across renders
  const providerRef = useRef<ethers.BrowserProvider>(null);
  const contractRef = useRef<ethers.Contract>(null);

  const showAlert = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertOpen(true);
  };

  // call bookingContract method to check facility type availability
  const checkFacilityAvailability = async (
    facilityId: number,
    startTime: number,
    endTime: number
  ) => {
    try {
      console.log(`Checking availability for facility ${facilityId}...`);
      let contract = contractRef.current;
      if (isSignedIn === false) {
        contract = contractRef.current = new ethers.Contract(
          contractAddress,
          abi,
          jsonRpcProvider
        );
      }

      if (!contract) {
        console.error("Contract not initialized.");
        return false;
      }
      const isAvailable = await contract.isAvailable(
        facilityId,
        startTime,
        endTime
      );
      console.log(`Facility ${facilityId} availability:`, isAvailable);
      return isAvailable;
    } catch (error) {
      console.error("Error checking facility availability:", error);
      return false;
    }
  };

  const handlegetUserBookings = async (account: string) => {
    try {
      const contract = contractRef.current;
      if (!contract) throw new Error("Contract not initialized");
      const bookings = await contract.getUserBookings(account);
      setUserBookings(bookings);
    } catch (error) {
      showAlert("Error fetching bookings. Please try again.", "error");
    }
  };

  //call bookFacility method
  const bookFacility = async (
    facilityId: number,
    startTime: number,
    endTime: number
  ) => {
    try {
      const isAvailable = await checkFacilityAvailability(
        facilityId,
        startTime,
        endTime
      );
      if (!isAvailable) {
        showAlert(
          `Facility ${facilityId} is not available for booking.`,
          "error"
        );
        return;
      }
      const contract = contractRef.current;
      if (!contract) throw new Error("Contract not initialized");

      // Pass startTime and endTime directly (both are Unix timestamps)
      if (!isSignedIn) {
        showAlert("Please connect your wallet to book a facility.", "error");
        return;
      }

      const tx = await contract.book(facilityId, startTime, endTime);
      await tx.wait();
      showAlert(
        `Facility ${getFeatureById(facilityId)?.title} booked successfully!`,
        "success"
      );
      setSelectedFeature(null);
      handlegetUserBookings(account);
    } catch (error) {
      showAlert(
        `Error booking facility: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        // request chainId
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        // Check if the chain ID is Sepolia (0xaa36a7)
        if (chainId !== "0xaa36a7") {
          // Sepolia chain ID
          showAlert("Please switch to the Sepolia network.", "error");
          setIsConnecting(false);
          return;
        }
        setAccount(accounts[0]);

        // Get signer and update contractRef to use it
        const provider = new ethers.BrowserProvider(window.ethereum);
        providerRef.current = provider;

        if (provider) {
          console.log("Provider initialized:", provider);
          const signer = await provider.getSigner();
          console.log("Signer obtained:", signer);
          contractRef.current = new ethers.Contract(
            contractAddress,
            abi,
            signer
          );
          setIsSignedIn(true);
          // Fetch user bookings after connecting
          handlegetUserBookings(accounts[0]);
          showAlert("Wallet connected successfully!", "success");
        }
      }
    } catch (error) {
      // console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="grid grid-rows-[80px_1fr_60px] min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header/Navigation */}
      <header className="flex items-center justify-between px-8 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Image
            src="/align-text-center-svgrepo-com.svg"
            alt="Project Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h1 className="text-xl font-bold">FacilityBooking</h1>
        </div>
        <div className="flex items-center gap-2">
          {isSignedIn && (
            <button
              onClick={() => setShowDashboard(true)}
              className="hidden sm:inline-block text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              style={{ display: isSignedIn ? "inline-block" : "none" }}
            >
              Dashboard
            </button>
          )}
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            {account
              ? `${account.slice(0, 6)}...${account.slice(-4)}`
              : isConnecting
              ? "Connecting..."
              : "Connect Wallet"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center p-8 gap-8">
        <div className="max-w-2xl text-center">
          <h2 className="text-4xl font-bold mb-4">Select Your Facility</h2>
          <p className="text-gray-400 mb-8">
            Connect your wallet to start interacting with our decentralized
            platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {features.flat().map((feature, index) => (
            <button
              key={index}
              className="p-6 rounded-xl border border-gray-800 hover:border-blue-500 transition-colors bg-gray-800 hover:bg-gray-700 focus:outline-none"
              onClick={() => setSelectedFeature(feature)}
              type="button"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </button>
          ))}
        </div>
      </main>

      {/* Modal */}
      <FeatureModal
        feature={selectedFeature}
        onClose={() => setSelectedFeature(null)}
        bookFacility={bookFacility}
      />

      {showDashboard && (
        <DashboardModal
          onClose={() => setShowDashboard(false)}
          userBookings={userBookings}
          getFeatureById={getFeatureById}
        />
      )}

      <AlertModal
        open={alertOpen}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertOpen(false)}
      />

      {/* Footer */}
      <footer className="flex items-center justify-center gap-6 border-t border-gray-800 px-8">
        <a
          href="https://docs.yourproject.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Docs
        </a>
        <a
          href="https://github.com/yourproject"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          GitHub
        </a>
        <a
          href="https://discord.gg/yourproject"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Community
        </a>
      </footer>
    </div>
  );
}
