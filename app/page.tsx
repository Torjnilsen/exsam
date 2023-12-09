"use client"
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';
import { FaUpload } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [auctionListings, setAuctionListings] = useState([]);
  const [visibleListings, setVisibleListings] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortByDate, setSortByDate] = useState(false);
  const [sortByBids, setSortByBids] = useState(false);
  const [bidAmounts, setBidAmounts] = useState<{ [key: string]: number }>({});
  const [userDetails, setUserDetails] = useState({
    id: 0,
    name: '',
    email: '',
    avatar: '',
    credits: 1000,
  });

  const [listingBids, setListingBids] = useState([]);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [bidMessage, setBidMessage] = useState<{ [key: string]: string | null }>({});
  const [highestBidderUsername, setHighestBidderUsername] = useState<string | null>(null);
  const [highestBidderSellerName, setHighestBidderSellerName] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
  

  const handleLogout = () => {
    localStorage.removeItem('registeredUser');
    Cookies.remove('registeredUser');
    localStorage.removeItem('createdListings');
    setUserDetails({
      id: 0,
      name: '',
      email: '',
      avatar: '',
      credits: 0,
    });
    setIsLoggedIn(false);
  };
  

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
          const newAvatarUrl = reader.result as string;
          setUserDetails((prevUserDetails) => ({
            ...prevUserDetails,
            avatar: newAvatarUrl,
          }));

          const storedUser = localStorage.getItem('registeredUser') || Cookies.get('registeredUser');
       if (storedUser) {
        const userData = JSON.parse(storedUser);
        localStorage.setItem(
          'registeredUser',
          JSON.stringify({
            ...userData,
            avatar: newAvatarUrl,
          })
        );
       }    
      
      };
      reader.readAsDataURL(file);
    }
  };

  
  
  const fetchData = async () => {
    try {
      // Check if window is defined (running on the client side)
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('registeredUser') || Cookies.get('registeredUser');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setToken(userData.token);
          setUserDetails({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar,
            credits: userData.credits,
          });
          setIsLoggedIn(true);
        } else {
          setUserDetails({
            id: 0,
            name: '',
            email: '',
            avatar: '',
            credits: 1000,
          });
        }
      }

      const response = await fetch('https://api.noroff.dev/api/v1/auction/listings?_bids=true');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAuctionListings(data);
    } catch (error: any) {
      console.error('Error fetching auction listings:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  

  const showMoreListings = () => {
    setVisibleListings((prevVisibleListings) => prevVisibleListings + 10);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortByDate = () => {
    setSortByDate(!sortByDate);
  };

  const handleSortByBids = () => {
    setSortByBids(!sortByBids);
  };

  const handleBidSubmission = async (listingId: string) => {
    try {
      const token = Cookies.get('authToken');
      const response = await fetch(`https://api.noroff.dev/api/v1/auction/listings/${listingId}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: bidAmounts[listingId] || 0,
        }),
      });
    
      if (!response.ok) {
        throw new Error('Failed to place bid');
      }
      

      const data = await response.json();

      setBidMessage((prevBidMessages) => ({
        ...prevBidMessages,
        [listingId]: `Bid placed successfully: ${data.message || 'No message received'}`,
      }));
    } catch (error) {
      console.error('Error placing bid:', error.message);

      setBidMessage((prevBidMessages) => ({
        ...prevBidMessages,
        [listingId]: 'Failed placing bid, bid must be greater than existing bid',
      }));
    }
  };

  const handleViewBids = async (listingId: string) => {
    try {
      const response = await fetch(`https://api.noroff.dev/api/v1/auction/listings/${listingId}/bids`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setListingBids(data);
      setSelectedListing(listingId);
  
      
    } catch (error) {
      console.error('Error fetching bids:', error.message);
    }
  };
  const sortedListings = [...auctionListings].sort((a, b) => {
    if (sortByDate) {
      return new Date(a.created).getTime() - new Date(b.created).getTime();
    } else if (sortByBids) {
      return a._count.bids - b._count.bids;
    } else {
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    }
  });

  const filteredListings = sortedListings.filter((listing) =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  );



  return (
    <main key={isLoggedIn ? 'loggedIn' : 'loggedOut'} className="">
      <Header registeredUser={token} />
      <div className="w-full p-6">
        <div className='p-6 '>
          <div className="flex flex-col items-center bg-white p-4 rounded-md shadow-md space-y-4 relative">
            {isLoggedIn && (
              <label htmlFor="avatar" className="cursor-pointer">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={userDetails.avatar || '/profile.png'}
                    alt="User Avatar"
                    className="object-cover w-full h-full"
                  />
                </div>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
              </label>
            )}
            {isLoggedIn ? (
              <div className=''>
                <p className="text-sm font-semibold">{userDetails.name}</p>
                <p className="text-xs font-semibold">{userDetails.email}</p>
                <p className="text-xs font-semibold">Credits: <span className='text-red-400'>{userDetails.credits}   </span></p>
              </div>
            ) : (
              <p className="text-sm font-semibold">Please log in</p>
            )}
            {isLoggedIn && (
              <label htmlFor="avatar" className="cursor-pointer">
                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors
                  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50
                  bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                  <FaUpload /> <p className='p-2'>  Upload New Avatar</p>
                </div>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
              </label>
            )}
            {isLoggedIn ? (
              <Button onClick={handleLogout} className=''>
                <IoLogOut style={{ marginRight: '8px' }} />  <p className='p-2'>Logout</p> 
              </Button>
            ) : (
              <div className="text-sm font-semibold">
                <p>Please log in to access additional features.</p>
              </div>
            )}
          </div>
        </div>
        </div>
        <div className='p-6 mb-4'>
          <input
            type="text"
            placeholder="Search by title"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full h-full rounded-md p-4 placeholder:text-sm text-base text-black border-[2px] border-black outline-none focus-visible:border-[#58D096]"
          />
        </div>
      <div className="flex items-center gap-2 mb-4">
        <label className="mr-2">Sort by Date</label>
        <input
          type="checkbox"
          checked={sortByDate}
          onChange={handleSortByDate}
          className="border-[3px] border-transparent focus-visible:border-[#58D096] "
        />
        <label className='mr-2'>Sort by Bids</label>
        <input 
          type="checkbox"
          checked={sortByBids}
          onChange={handleSortByBids}
          className='border-[3px] border-transparent focus-visible:border-[#58D096] '
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {filteredListings.slice(0, visibleListings).map((listing) => (
          <div key={listing.id} className="border  p-4 flex flex-col">
            <div className='border border-gray-00 p-4 flex flex-col justify-center items-center'>
              <h3 className=''>{listing.title}</h3>
              <img src={listing.media[0]} width={300} height={300} alt='Listing image' className='object-contain  rounded-lg shadow-lg scale-90 hover:scale-100 transition-transform duration-300' />
              <p className='text-md font-medium'>{listing.description}</p>
            </div>
           
            <div className='px-4 py-3 inline-flex items-center justify-between gap-4'>
              <p className='text-md font-semibold'> Created at: <span className='text-xs text-[#047FA4] tracking-wide font-bold'>{listing.created}</span>  </p>
              <p className='text-md font-semibold'>Ends at: <span className='text-xs text-[#047FA4] tracking-wide font-bold'> {listing.endsAt}</span> </p>
            </div>
            <div className='px-4 py-3 inline-flex items-center justify-between gap-4'>
         

            </div>
            <div className='px-4 py-3 flex flex-col items-end justify-end gap-4'>
              <p className='text-md text-[#047FA4]'>Bids: <span className=' text-red-400'>{listing._count.bids}</span>  </p>
              {listing.bids && listing.bids.length > 0 && (
                <p className='text-md text-[#5047FA4]'>Highest Bid: {highestBidderUsername} <span className='text-red-400'>{Math.max(...listing.bids.map(bid => bid.amount))}</span></p>
                
              )}  
                        
              <div className='px-4 py-3 flex flex-col md:flex-row justify-between gap-4'>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  placeholder="Enter bid amount"
                  value={bidAmounts[listing.id] || 0}
                  onChange={(e) => setBidAmounts({ ...bidAmounts, [listing.id]: Number(e.target.value) })}
                  className="border p-2 rounded-md w-32"
                />
                {isLoggedIn ? (
                  <Button onClick={() => handleBidSubmission(listing.id)}>
                    Bid
                  </Button>
                ) : (
                  <div className="bg-gray-300 text-gray-600 py-2 px-4 rounded-md cursor-not-allowed">
                    Log in to Bid
                  </div>
                )}
                {bidMessage[listing.id] && (
                  <p className={`text-sm ${bidMessage[listing.id]?.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
                    {bidMessage[listing.id]}
                  </p>
                )}
              </div>
            </div>
              {selectedListing === listing.id && (
                  <div className="border p-4 mt-4">
                    <h2 className="text-2xl font-semibold mb-4">Bids for Listing {listing.id}</h2>
                    {listing.bids.map((bid) => (
                      <div key={bid.id} className="flex justify-between items-center border-b py-2">
                        <p className="text-md">User ID: {bid.userId}</p>
                        <p className="text-md text-[#047FA4]">Amount: {bid.amount}</p>
                        <p className="text-md">Bidder Name: {bid.bidderName}</p>
                        <p className="text-md text-[#047FA4]">Created At: {bid.created}</p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <div className='hidden'>
          <pre>{Cookies.get('authToken')}</pre>
        </div>
      )}
      <div className="flex items-center justify-center">
        {visibleListings < filteredListings.length && (
          <Button onClick={showMoreListings} className=" mt-5 rounded-2xl">
            Show More Listings
          </Button>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default Home;
