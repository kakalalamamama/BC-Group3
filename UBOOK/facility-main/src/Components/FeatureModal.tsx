import { useState } from "react";

function FeatureModal({
  feature,
  onClose,
  bookFacility,
}: {
  feature: any;
  onClose: () => void;
  bookFacility: (
    facilityId: number,
    startTime: number,
    endTime: number
  ) => Promise<void>;
}) {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>("09:00");

  const slots = Array.from({ length: 12 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const handleBook = () => {
    // Start time
    const startDateTime = new Date(`${selectedDate}T${selectedSlot}:00`);
    const startTime = Math.floor(startDateTime.getTime() / 1000);

    // End time (add 1 hour)
    const [hour, minute] = selectedSlot.split(":").map(Number);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(hour + 1);
    const endTime = Math.floor(endDateTime.getTime() / 1000);

    bookFacility(feature.facilityId, startTime, endTime);
  };

  if (!feature) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
          aria-label="Close"
        >
          &times;
        </button>
        <div className="text-5xl mb-4 text-center">{feature.icon}</div>
        <h3 className="text-2xl font-bold mb-2 text-center">{feature.title}</h3>
        <p className="text-gray-300 text-center mb-4">{feature.description}</p>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Select Date:</label>
          <input
            type="date"
            className="w-full p-2 rounded bg-gray-800 text-white"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Select Time Slot:</label>
          <div className="grid grid-cols-3 gap-2">
            {slots.map((slot) => (
              <button
                key={slot}
                className={`py-2 rounded ${
                  selectedSlot === slot
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-blue-700"
                }`}
                onClick={() => setSelectedSlot(slot)}
                type="button"
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleBook}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          type="button"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
export default FeatureModal;