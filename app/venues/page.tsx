"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { IoLogOut } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SavedBookings from "@/components/SavedBookings";

const VenuePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [venues, setVenues] = useState([]);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const [token, setToken] = useState<string | null>(null);

  const [visibleVenues, setVisibleVenues] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(1); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser =
          localStorage.getItem("registeredUser") || Cookies.get("registeredUser");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const userToken = userData.accessToken || null;
          setToken(userToken);

          setUserDetails({
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar,
          });

          setIsLoggedIn(true);
        }

        const response = await fetch(
          "https://api.noroff.dev/api/v1/holidaze/venues"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setVenues(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("registeredUser");
    Cookies.remove("registeredUser");
    setUserDetails({
      name: "",
      email: "",
      avatar: "",
    });
    setIsLoggedIn(false);
  };

  const handleBooking = async () => {
    if (!selectedVenue || !startDate || !endDate || !token) {
      console.error("Missing required data for booking:", {
        selectedVenue,
        startDate,
        endDate,
        token,
      });
      return;
    }

    if (endDate <= startDate) {
      console.error("End date must be later than start date");
      return;
    }

    try {
      const bookingData = {
        dateFrom: startDate.toISOString(),
        dateTo: endDate.toISOString(),
        guests: guestCount, 
        venueId: selectedVenue,
      };

      const response = await fetch(
        "https://api.noroff.dev/api/v1/holidaze/bookings",
      {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create booking. Status: ${response.status}`);
      }

      const newBooking = await response.json();

      const existingBookings = JSON.parse(
        localStorage.getItem("bookings") || "[]"
      );
      existingBookings.push(newBooking);
      localStorage.setItem("bookings", JSON.stringify(existingBookings));

      console.log("Booking created:", newBooking);

      window.location.reload(); 
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const handleSelectVenue = (venueId: string) => {
    setSelectedVenue(venueId);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const renderVenues = () => {
    return venues
      .filter((venue) =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, visibleVenues)
      .map((venue) => (
        <div key={venue.id} className="border p-4 flex flex-col shadow-md rounded-md">
          <img
            src={venue.media[0]}
            alt={`Image of ${venue.name}`}
            className="w-full h-48 object-cover rounded-t-md"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{venue.name}</h3>
            <p className="text-sm mb-2">{venue.description}</p>
            <div className="flex items-center mb-2">
              <p className="text-sm font-bold mr-2">${venue.price} / night</p>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-yellow-500 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M9.49 1.736a1 1 0 011.92 0l1.33 4.09h4.41a1 1 0 010 2l-3.55 1.85-3.55 1.85a1 1 0 010 2h-4.41l-1.33-4.09a1 1 0 01-1.92 0l-1.33-4.09H2.75a1 1 0 010-2l3.55-1.85-3.55-1.85a1 1 0 010-2h4.41l1.33-4.09z"
                  />
                </svg>
                <p className="text-sm">{venue.rating}</p>
              </div>
            </div>
            <p className="text-sm mb-2">Max Guests: {venue.maxGuests}</p>
            <p className="text-sm mb-2">
              Location: {venue.location.city}, {venue.location.country}
            </p>
            <div className="text-sm">
              <p className="font-semibold">Facilities:</p>
              <ul className="list-disc pl-4">
                {Object.entries(venue.meta).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value ? "Yes" : "No"}
                  </li>
                ))}
              </ul>
            </div>
            {selectedVenue === venue.id ? (
              <>
                <DatePicker
                  className="mt-1 p-2 rounded-md w-full text-black border-[2px] border-black"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start Date"
                />
                <DatePicker
                  className="mt-1 p-2 rounded-md w-full text-black border-[2px] border-black"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="End Date"
                />

                
                <label htmlFor="guestCount">Number of Guests:</label>
                <select
                  id="guestCount"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value))}
                  className="mt-1 p-2 rounded-md w-full text-black border-[2px] border-black"
                >
                  {[...Array(venue.maxGuests)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>

                <Button onClick={handleBooking} disabled={!selectedVenue || !startDate || !endDate}>
                  Book Now
                </Button>
              </>
            ) : (
              <Button onClick={() => handleSelectVenue(venue.id)}>Select Venue</Button>
            )}
          </div>
        </div>
      ));
  };

  const handleShowMore = () => {
    setVisibleVenues((prev) => prev + 10);
  };

  return (
    <main>
      <Header registeredUser={token} />
      <div className="w-full p-6">
        <div className="flex justify-center items-center font-extrabold">
          <h2>Your Saved Bookings</h2>
        </div>
        <SavedBookings />
        
        <input
          type="text"
          placeholder="Search venues..."
          value={searchQuery}
          onChange={handleSearch}
          className="mt-1 p-2 rounded-md w-full text-black border-[2px] border-black outline-none focus-visible:border-[#FF585D]"
        />

        <div className="w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderVenues()}
        </div>

        {visibleVenues < venues.length && (
          <div className="flex justify-center">
            <Button onClick={handleShowMore}>Show More</Button>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default VenuePage;