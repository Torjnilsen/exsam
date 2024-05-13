import React, { useEffect, useState } from "react";

const SavedBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const storedBookings = localStorage.getItem("bookings");
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  if (bookings.length === 0) {
    return <p>No bookings found.</p>;
  }

  return (
    <div className="bookings-list">
      {bookings.map((booking, index) => (
        <div key={index} className="booking border p-4 shadow-md rounded-md">
          <h3>Booking {index + 1}</h3>
          <p>Venue ID: {booking.venueId}</p>
          <p>
            From: {new Date(booking.dateFrom).toLocaleDateString()}
          </p>
          <p>
            To: {new Date(booking.dateTo).toLocaleDateString()}
          </p>
          <p>Guests: {booking.guests}</p>
        </div>
      ))}
    </div>
  );
};

export default SavedBookings;
