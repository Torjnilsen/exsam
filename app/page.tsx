"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { IoLogOut } from "react-icons/io5";
import Footer from "@/components/Footer";
import Link from "next/link";


interface UserDetails {
  id: number; 
  name: string;
  email: string;
  avatar: string;
}

const ProfilePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    id: 0, 
    name: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("registeredUser") || Cookies.get("registeredUser");
    if (storedUser) {
      const userData = JSON.parse(storedUser);

      setUserDetails({
        id: userData.id || 1, 
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar || "/profile.png",
      });

      setIsLoggedIn(true);
    }
  }, []);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAvatar = e.target?.result as string;

        const updatedUser = {
          id: userDetails.id, 
          name: userDetails.name,
          email: userDetails.email,
          avatar: newAvatar,
        };

        setUserDetails(updatedUser);

        localStorage.setItem("registeredUser", JSON.stringify(updatedUser));
        Cookies.set("registeredUser", JSON.stringify(updatedUser), { expires: 7 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("registeredUser");
    Cookies.remove("registeredUser");
    setUserDetails({
      id: 0, 
      name: "",
      email: "",
      avatar: "",
    });
    setIsLoggedIn(false);
  };

  return (
    <div>
      <Header registeredUser={userDetails} /> 
      <main>
        <div className="w-full p-6">
          <div className="flex flex-col items-center bg-white p-4 rounded-md shadow-md space-y-4">
            {isLoggedIn ? (
              <>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img src={userDetails.avatar} alt="User Avatar" />
                  </div>
                  <input
                    type="file"
                    id="avatar-input"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatarChange}
                  />
                  <Button
                    className="mt-2"
                    onClick={() => document.getElementById("avatar-input").click()}
                  >
                    Change Avatar
                  </Button>
                </div>
                <p>{userDetails.name}</p>
                <p>{userDetails.email}</p>
                <Button onClick={handleLogout}>
                  <IoLogOut /> Logout
                </Button>
              </>
            ) : (
              <p>Please log in to view your profile</p>
            )}
          </div>
        </div>
      </main>

      <div
        className="relative sm:h-[40vh] flex items-center justify-center"
        style={{ backgroundImage: "url('/download.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 text-center text-white">
          <p className="text-lg sm:text-2xl font-bold">Not sure where to go? Perfect.</p>
          <Link href="/venues">
            <button
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-full shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl active:scale-90 duration-200 ease-in-out"
            >
              Explore Venues
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
