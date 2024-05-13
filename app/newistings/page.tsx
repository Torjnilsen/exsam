
"use client"
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';
import { CheckCircle } from 'react-feather';

interface VenueData {
  id?: string;
  name: string;
  description: string;
  media: string | string[];
  price: number;
  maxGuests: number;
  rating?: number;
  meta?: {
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  };
  location?: {
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
    continent?: string;
    lat?: number;
    lng?: number;
  };
}

const CreateListing: React.FC = () => {
  const [formData, setFormData] = useState<VenueData>({
    name: '',
    description: '',
    media: '',
    price: 0,
    maxGuests: 0,
    rating: 0,
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false
    },
    location: {
      address: '',
      city: '',
      zip: '',
      country: '',
      continent: '',
      lat: 0,
      lng: 0
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [createdVenues, setCreatedVenues] = useState<VenueData[]>([]);

  useEffect(() => {
    // Retrieve the access token from localStorage or Cookies
    const storedUser =
      localStorage.getItem("registeredUser") || Cookies.get("registeredUser");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const userToken = userData.accessToken || null;
      setAccessToken(userToken);
    } else {
      console.error("Access token not found. Please make sure you are logged in.");
    }

    // Load stored venues
    const storedVenues = localStorage.getItem('createdVenues');
    if (storedVenues) {
      setCreatedVenues(JSON.parse(storedVenues));
    }
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      meta: {
        ...prevData.meta,
        [name]: checked
      }
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      location: {
        ...prevData.location,
        address: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      if (!accessToken) {
        throw new Error("Access token not available. Please make sure you are logged in.");
      }
  
      let mediaArray = Array.isArray(formData.media) ? formData.media : [formData.media];
      const price = typeof formData.price === 'string' ? parseFloat(formData.price) : 0;
const maxGuests = typeof formData.maxGuests === 'string' ? parseInt(formData.maxGuests) : 0;

  
      if (isNaN(price)) {
        throw new Error("Price must be a number");
      }
  
      if (isNaN(maxGuests)) {
        throw new Error("Max guests must be a number");
      }
  
  
      // Rest of the code remains unchanged
  

      const requestUrl = formData.id
        ? `https://api.noroff.dev/api/v1/holidaze/venues/${formData.id}` // Update existing venue
        : 'https://api.noroff.dev/api/v1/holidaze/venues'; // Create new venue

      const method = formData.id ? 'PUT' : 'POST';

      const response = await fetch(requestUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...formData,
          price,
          maxGuests,
          media: mediaArray
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (formData.id) {
          setSuccessMessage('Venue updated successfully!');
        } else {
          setCreatedVenues((prevVenues) => [...prevVenues, responseData]);
          setSuccessMessage('Venue created successfully!');
          localStorage.setItem('createdVenues', JSON.stringify([...createdVenues, responseData]));
        }
      } else {
        const errorMessage = await response.text();
        setError(`Error ${formData.id ? 'updating' : 'creating'} venue: ${errorMessage}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(`Error ${formData.id ? 'updating' : 'creating'} venue: ${error.message}`);
      } else {
        setError(`An unknown error occurred`);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateVenue = async (id: string, price: number, maxGuests: number) => {
    try {
      if (!accessToken) {
        throw new Error("Access token not available. Please make sure you are logged in.");
      }

      const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/venues/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          price,
          maxGuests
        }),
      });

      if (response.ok) {
        setSuccessMessage('Venue updated successfully!');
        // Refresh venue data after update
        const updatedVenues = createdVenues.map(venue => {
          if (venue.id === id) {
            return { ...venue, price, maxGuests };
          }
          return venue;
        });
        setCreatedVenues(updatedVenues);
      } else {
        const errorMessage = await response.text();
        setError(`Error updating venue: ${errorMessage}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(`Error updating venue: ${error.message}`);
      } else {
        setError(`An unknown error occurred`);
      }
    }
  };

  const deleteVenue = async (id: string) => {
    try {
      const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/venues/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete venue');
      }
  
      // Remove the deleted venue from local storage
      const updatedVenues = createdVenues.filter(venue => venue.id !== id);
      localStorage.setItem('createdVenues', JSON.stringify(updatedVenues));
  
      // Remove the deleted venue from the state
      setCreatedVenues(updatedVenues);
      setSuccessMessage('Venue deleted successfully');
      setError(null);
    } catch (error) {
      setSuccessMessage(null);
      setError(error.message);
    }
  };
  
  

  const populateFormWithVenue = (venue: VenueData) => {
    setFormData(venue);
  };


  return (
    <main className="">
     <Header registeredUser={accessToken} />
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundImage: "url('/PRIVATE-HOUSE-IN-OSLO.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <h3 className="flex justify-center items-center p-6 font-extrabold">New Venue</h3>

          <div className="mb-4">
            <label htmlFor="name" className="block text-black font-extrabold">
              Venue Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 p-2 rounded-md w-full text-black border-[2px] border-black outline-none focus-visible:border-[#FF585D]"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-black font-extrabold">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 p-2 rounded-md w-full text-black border-[2px] border-black outline-none focus-visible:border-[#FF585D]"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-white font-extrabold">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="mt-1 p-2 rounded-md w-full text-black border-[2px] border-black outline-none focus-visible:border-[#FF585D]"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="maxGuests" className="block text-white font-extrabold">
              Maximum Guests
            </label>
            <input
              type="number"
              id="maxGuests"
              name="maxGuests"
              value={formData.maxGuests}
              onChange={handleInputChange}
              className="mt-1 p-2 rounded-md w-full text-black border-[2px] border-black outline-none focus-visible:border-[#FF585D]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-white font-extrabold">
              Additional Features
            </label>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="wifi"
                name="wifi"
                checked={formData.meta?.wifi}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label className='text-white' htmlFor="wifi">Wifi</label>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="parking"
                name="parking"
                checked={formData.meta?.parking}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label className='text-white' htmlFor="parking">Parking</label>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="breakfast"
                name="breakfast"
                checked={formData.meta?.breakfast}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label className='text-white' htmlFor="breakfast">Breakfast</label>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="pets"
                name="pets"
                checked={formData.meta?.pets}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label className='text-white' htmlFor="pets">Pets Allowed</label>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="media" className="block text-white font-extrabold">
              Media (Image URL)
            </label>
            <input
              type="text"
              id="media"
              name="media"
              value={formData.media}
              onChange={handleInputChange}
              className="mt-1 p-2 rounded-md w-full text-black border-[2px] border-black outline-none focus-visible:border-[#FF585D]"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="location" className="block text-white font-extrabold">
              Location
            </label>
            <input
  type="text"
  id="location"
  name="location"
  value={formData.location.address}  
  onChange={handleLocationChange}    
  placeholder="Address"
  className="mt-1 p-2 rounded-md w-full text-black border-[2px] border-black outline-none focus-visible:border-[#FF585D]"
/>
          </div>

          <div className='flex justify-center items-center'>
            <Button className="bg-ff585d text-white px-4 py-2 rounded-md flex items-center"
              style={{ backgroundColor: '#FF585D', border: 'none', outline: 'none', cursor: 'pointer' }} type="submit">Publish Venue
            </Button>
          </div>
        </form>
      </div>
      {successMessage && (
        <div className='flex items-center justify-center mt-4'>
          <p className='text-green-600 text-center mt-4'>{successMessage}</p>
          <div className='p-2 mt-2'>
            <CheckCircle className='text-green-600 mr-2' size={20} />
          </div>
        </div>
      )}
      {error && (
        <div className='flex items-center justify-center mt-4'>
          <p className='text-red-600 text-center mt-4'>{error}</p>
        </div>
      )}
   
      <h3 className=' flex justify-center font-extrabold'>Your Venues</h3>
      {createdVenues.length > 0 && (
        <div className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {createdVenues.map((venue, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <img src={venue.media[0]} alt={`Image of ${venue.name}`} className="w-full h-56 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-xl mb-2">{venue.name}</h3>
                <p className="text-gray-700 text-base">{venue.description}</p>
                <div className="flex items-center mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <p className="text-gray-700 text-base mt-2">Price: ${venue.price} per night</p>
                <input
                  type="number"
                  value={venue.price}
                  onChange={(e) => updateVenue(venue.id, parseFloat(e.target.value), venue.maxGuests)}
                  className="mt-1 p-2 rounded-md w-full text-black border-[2px] border-black outline-none focus-visible:border-[#FF585D]"
                />
          </div>
          <div className="flex items-center mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <p className="text-gray-700 text-base mt-2">Max Guests: {venue.maxGuests}</p>
                <input
                  type="number"
                  value={venue.maxGuests}
                  onChange={(e) => updateVenue(venue.id, venue.price, parseInt(e.target.value))}
                  className="mt-1 p-2 rounded-md w-full text-black border-[2px] border-black outline-none focus-visible:border-[#FF585D]"
                />
          </div>
          <div className="flex items-center mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <p className="text-gray-600 ml-2">Location: {venue.location.address}, {venue.location.city}, {venue.location.country}</p>
          </div>
          <div className="flex items-center mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <p className="text-gray-600 ml-2">Rating: {venue.rating || 'N/A'}</p>
          </div>
          <div className="flex items-center mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            
            <p className="text-gray-600 ml-2">Amenities: {venue.meta.wifi && 'Wifi'} {venue.meta.parking && 'Parking'} {venue.meta.breakfast && 'Breakfast'} {venue.meta.pets && 'Pets Allowed'}</p>
            <p className='text-green-600 text-center mt-4'>{successMessage}</p>
          </div>
                <div className="flex justify-between mt-4">
                  <Button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                    onClick={() => populateFormWithVenue(venue)}>
                    Update
                  </Button>
                  <Button className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md"
                    onClick={() => deleteVenue(venue.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </main>
  );
};
export default CreateListing;
