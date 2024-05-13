"use client"
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

interface Profile {
  name: string;
  email: string;
  avatar: string;
}

export default function ExampleProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [visibleProfiles, setVisibleProfiles] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [followedProfiles, setFollowedProfiles] = useState<Record<string, boolean>>({});
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODEsIm5hbWUiOiJmcm9kbG8iLCJlbWFpbCI6ImZpcnN0Lmxhc3RAc3R1ZC5ub3JvZmYubm8iLCJhdmF0YXIiOm51bGwsImJhbm5lciI6bnVsbCwiaWF0IjoxNjk2NDExMTMyfQ.5rZZV8ic8pB0zNR_fLzZyHmOgteJA4HE5AbB4iPvNNE"; // Replace with your actual access token

        const url = new URL(`https://api.noroff.dev/api/v1/holidaze/profiles`);

        const response = await fetch(url.href, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data: Profile[] = await response.json();

       
        const updatedProfiles = data.map((profile) => ({
          ...profile,
          avatar: getRandomAvatarImage(profile.name),
        }));

        setProfiles(updatedProfiles);
      } catch (error) {
        console.error('Error fetching profiles:', error.message);
      }
    };

    fetchProfiles();
  }, []);

  const getRandomAvatarImage = (profileName: string) => {
    const randomImageId = Math.floor(Math.random() * 1000);
    return `https://source.unsplash.com/random/100x100/?avatar?sig=${randomImageId}&profileName=${profileName}`;
  };

  const toggleFollow = (profileName: string) => {
    setFollowedProfiles((prevState) => ({
      ...prevState,
      [profileName]: !prevState[profileName],
    }));
  };

  const handleShowMore = () => {
    setVisibleProfiles((prevVisible) => prevVisible + 10);
    if (visibleProfiles + 10 >= profiles.length) {
      setHasMore(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleProfiles(10);
    setHasMore(true); 
  };

  const filteredProfiles = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  const handleSendMessage = (profileName: string) => {
    alert(`Message is sent to ${profileName} `)
  }


  return (
    <>
     <Header registeredUser={{ id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'url-to-avatar',  }} />



     <section id="feed" className="w-full bg-white">
  <div className="text-center py-8">
    <h1 className="text-3xl md:text-4xl font-bold mb-4">Connect with Other Users</h1>
    <p className="text-lg text-gray-600">
      Discover interesting profiles and connect with others in the community.
    </p>
    
  </div>
  <div className="container mx-auto">
    <div className="p-4">
      <input
        type="text"
        placeholder="Search profiles"
        value={searchQuery}
        onChange={handleSearch}
        className="w-full h-full rounded-md p-4 placeholder:text-sm text-base text-black border-[2px] border-black outline-none focus-visible:border-[#FF585D]"

      />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredProfiles.slice(0, visibleProfiles).map((profile) => (
        <div key={profile.name} className="p-2">
          <div className="rounded-lg shadow-md bg-white">
            <div className="flex flex-row py-4 px-6 items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  className="object-cover w-full h-full"
                  src={profile.avatar}
                  alt={profile.name}
                />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{profile.name}</h3>
                <p className="text-gray-600">{profile.email}</p>
              </div>
            </div>
            <div className="px-6 pb-4">
              <button
                onClick={() => toggleFollow(profile.name)}
               
                className={`block w-full py-2 rounded bg-primary text-white font-semibold ${
                  followedProfiles[profile.name] ? 'bg-gray-400' : 'hover:bg-primary-dark'
                }`}
              >
                {followedProfiles[profile.name] ? 'Unfollow' : 'Follow'}
              </button>
              <div className="flex mt-4">
                <input
                  type="text"
                  placeholder="Type your message"
                  className="w-full h-full rounded-md p-4 placeholder:text-sm text-base text-black border-[2px] border-black outline-none focus-visible:border-[#FF585D]"
                />
                <button
                  onClick={() => handleSendMessage(profile.name)}
                  className="ml-2 px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary-dark"
                  style={{ backgroundColor: '#FF585D', border: 'none', outline: 'none', cursor: 'pointer' }}
                >
                  Send message
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    {hasMore && (
      <div className="flex justify-center mt-4">
        <button
          onClick={handleShowMore}
          className="px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary-dark"
          style={{ backgroundColor: '#FF585D', border: 'none', outline: 'none', cursor: 'pointer' }}
        >
          Show More
        </button>
      </div>
    )}
  </div>
  <Footer />
</section>

       
      
    </>
  );
}
