"use client"
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';
import { CheckCircle } from 'react-feather';

interface FormData {
  title: string;
  description: string;
  endsAt: string;
  tags: string[];
  media: string;
}

const CreateListing: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    endsAt: '',
    tags: [],
    media: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [createdListings, setCreatedListings] = useState<any[]>([]);

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      setAccessToken(token);
    } else {
      console.error("Access token not found. Please make sure you are logged in.");
    }

    // Retrieve created listings from local storage
    const storedListings = localStorage.getItem('createdListings');
    if (storedListings) {
      setCreatedListings(JSON.parse(storedListings));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prevData) => ({ ...prevData, tags: value.split(',') }));
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prevData) => ({ ...prevData, media: value }));
  };

  const formatDateTime = (value: string): string => {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!accessToken) {
        throw new Error("Access token not available. Please make sure you are logged in.");
      }

      const response = await fetch('https://api.noroff.dev/api/v1/auction/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...formData,
          endsAt: formatDateTime(formData.endsAt),
          media: [formData.media],
        }),
      });

      const responseData = await response.json();
      if (response.ok) {
        setCreatedListings((prevListings) => [...prevListings, responseData]);
        setSuccessMessage('Listing created successfully!');
        console.log('listing created successfully', responseData);

        // Store updated listings in local storage
        localStorage.setItem('createdListings', JSON.stringify([...createdListings, responseData]));
      } else {
        const errorMessage = await response.text();
        setError(`Error creating listing: ${errorMessage}`);
      }
    } catch (error) {
      setError(`Error creating listing: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="">
      <Header />
      <div className="w-full px-6">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <h3 className='flex justify-center items-center p-6 font-bold'>New listing</h3>

          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="endsAt" className="block text-sm font-medium text-gray-700">
              Ends At
            </label>
            <input
              type="datetime-local"
              id="endsAt"
              name="endsAt"
              value={formData.endsAt}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags.join(',')}
              onChange={handleTagChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="media" className="block text-sm font-medium text-gray-700">
              Media (Image URL)
            </label>
            <input
              type="text"
              id="media"
              name="media"
              value={formData.media}
              onChange={handleMediaChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className='flex justify-center items-center'>
            <Button className='' type="submit">Publish Listing</Button>
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
          {createdListings.length > 0 && (
  <div className='mt-4 p-4 border border-gray-100'>
    <h3 className='text-lg font-extrabold mb-1'>Your Listings</h3>
    {createdListings.map((listing, index) => (
      <div key={index} className="mt-4 p-4 border border-gray-200 rounded">
        <h4 className='text-lg font-semibold'>Title: {listing.title}</h4>
        <p className='font-semibold'>Description: <span className='font-bold'>{listing.description}</span></p>
        <p className='font-semibold'>Tags: <span className='text-[#047FA4]'> {listing.tags.join(', ')}</span></p>
        <p className='font-semibold'>Created At: <span className='text-[#047FA4]'>{listing.created}</span></p>
        <p className='font-semibold'>Ends At: <span className='text-[#047FA4]'>{listing.endsAt}</span></p>
        <p className='font-semibold'>Bids Count: <span className='text-red-500'> {listing._count.bids}</span></p>

        {listing.media[0] && (
          <div className="mt-2 ">
            <img
              src={listing.media[0]}
              alt="Listing Media"
              className="max-w-full rounded-lg shadow-lg"
              style={{ maxHeight: '300px' }}
            />
          </div>
        )}
      </div>
    ))}
  </div>
)}

        </form>
      </div>
      <Footer />
    </main>
  );
};

export default CreateListing;
