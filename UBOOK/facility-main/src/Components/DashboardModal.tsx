




function DashboardModal({ onClose, userBookings, getFeatureById }: { onClose: () => void, userBookings: any[], getFeatureById: (id: string | number) => { title: string } | undefined }) {
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
        <h2 className="text-2xl font-bold mb-4 text-center">User Dashboard</h2>
        <p className="text-gray-300 text-center mb-4">Welcome to your dashboard!</p>
        <div>
          <h3 className="text-lg font-semibold mb-2">Your Bookings</h3>
          {userBookings && userBookings.length > 0 ? (
            <ul className="space-y-3 max-h-64 overflow-y-auto">
              {userBookings.map((booking, idx) => (
                <li key={idx} className="bg-gray-800 rounded p-3">
                  <div>
                    <span className="font-semibold">Facility ID:</span> {getFeatureById(booking.facilityId)?.title || "Unknown Facility"}
                  </div>
                  <div>
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(Number(booking.startTime) * 1000).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-semibold">Time:</span>{" "}
                    {new Date(Number(booking.startTime) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{" "}
                    {new Date(Number(booking.endTime) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400 text-center">No bookings found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
export default DashboardModal;