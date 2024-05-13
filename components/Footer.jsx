import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { BsFacebook } from "react-icons/bs";
import { FaSquareXTwitter } from "react-icons/fa6";
import { GrInstagram } from "react-icons/gr";
import { BiLogoLinkedinSquare } from "react-icons/bi";

const Footer = () => {
  return (
   
      <footer className="bg-gray-700 py-12">
      <div className="container mx-auto flex justify-between items-center">
        <div className="footer-logo">
        <Link href="/" className=' ml-4 lg:ml-0'>
              <Image src="/Holidaze.png" width={130} height={130} alt=' auction house logo' className='mx-6 rounded-2xl  items-center space-x-4 lg:space-x-6 hidden md:block' />
            </Link>
        </div>
        <div className="footer-info max-w-md">
          <h3 className="text-lg font-semibold mb-2">About Holidaze</h3>
          <p className="text-gray-600">Holidaze offers unique travel experiences that allow you to escape the ordinary, explore new destinations, and create unforgettable memories.</p>
        </div>
        <div className="footer-social">
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <ul className="flex space-x-4">
          <BsFacebook />
          <FaSquareXTwitter />
          <GrInstagram />
          <BiLogoLinkedinSquare />
          </ul>
        </div>
      </div>
      <div className="text-center mt-8">
        <p className="text-gray-600">&copy; 2024 Holidaze. All rights reserved.</p>
        <small>Created with ❤️ by Torjus Nilsen</small>

      </div>
    </footer>
  
  
  );
};

export default Footer;



