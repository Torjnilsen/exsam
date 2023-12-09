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

        const url = new URL(`https://api.noroff.dev/api/v1/auction/profiles`);

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
      <Header />

      <section id="feed" className="w-full bg-base-100">
        <div className="text-center py-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">Explore and Connect with Profiles</h1>
          <p className="text-base md:text-lg text-gray-600">
            Discover interesting profiles and connect with others in the community.
          </p>
        </div>
        <div className="md:container md:mx-auto">
          <div className="p-4">
            <input
              type="text"
              placeholder="Search profiles"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full rounded-md p-2 md:p-4 placeholder:text-sm text-base text-black border-[2px] md:border-black outline-none focus-visible:border-[#58D096]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProfiles.slice(0, visibleProfiles).map((profile) => (
              <div key={profile.name} className="p-2 border border-gray-300">
                <div className="card w-full h-auto glass">
                  <div className="flex flex-row py-4">
                    <div className="avatar">
                      <div className="w-12 md:w-16 rounded-full mx-2 md:mx-5">
                        <img
                          className="object-cover w-full h-full"
                          src={profile.avatar}
                          alt={profile.name}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col flex-grow justify-between ml-2">
                      <p className="text-xs md:text-sm capitalize">
                        <h3>
                          <a href={`/profiles/${profile.name}`}>{profile.name}</a>
                        </h3>
                      </p>
                      <p className="text-start mb-2 md:mb-2 overflow-hidden overflow-ellipsis">
                        <span className="whitespace-pre-line text-xs md:text-sm">
                          {profile.email}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="card-body prose">
                    <div className="flex justify-between items-center">
                      <Button
                        onClick={() => toggleFollow(profile.name)}
                        className={`mt-2 px-2 md:px-4 py-2 rounded ${
                          followedProfiles[profile.name] ? 'bg-gray-400' : 'bg-primary'
                        }`}
                      >
                        {followedProfiles[profile.name] ? 'Unfollow' : 'Follow'}
                      </Button>
                    </div>
                    <div className="flex flex-row p-2 md:p-3">
                      <input
                        type="text"
                        placeholder="Type your message"
                        className="rounded-md p-1 md:p-1 placeholder:text-sm text-base text-black border-[2px] md:border-black outline-none focus-visible:border-[#58D096]"
                      />
                      <Button
                        onClick={() => handleSendMessage(profile.name)}
                        className="mt-2 ml-2 px-2 md:px-4 py-2 rounded bg-primary text-white text-xs md:text-sm"
                      >
                        Send message
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleShowMore}
                className="px-2 md:px-4 py-2 rounded bg-primary text-white text-xs md:text-sm"
              >
                Show More
              </Button>
            </div>
          )}
        </div>
        <Footer />
      </section>
    </>
  );
}
