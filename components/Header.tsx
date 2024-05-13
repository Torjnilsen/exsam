import React from 'react';
import Container from './ui/container';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

interface HeaderProps {
  registeredUser: {
    id: number;
    name: string;
    email: string;
    avatar: string;
   
  } | null | string;
}

const Header: React.FC<HeaderProps> = ({ registeredUser }) => {
  return (
    <header className='sm:flex sm:justify-between py-3 px-4 border-b'>
      <Container>
        <div className='relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full'>
          <div className='flex items-center'>
            <Sheet>
              <SheetTrigger>
                <Menu className="h-6 md:hidden w-6" />
              </SheetTrigger>
              <SheetContent side="left" className='w-[300px] sm:w-[400px] flex flex-col'>
                
                
                  <>
                  <Link href="profilepage">
                    profiles
                  </Link>
                  <Link href="/">
                    Home
                  </Link>
                  <Link href="venues">
                    Venues
                  </Link>
                  <Link href="newistings">
                    Create Venues
                  </Link>
                  <Link href="login">
                    login
                  </Link>
                  <Link href="register">
                    register
                  </Link>
                  
                  
                  
                  </>
                
              </SheetContent>
            </Sheet>
            <Link href="/" className=' ml-4 lg:ml-0'>
              <Image src="/Holidaze.png" width={130} height={130} alt=' auction house logo' className='mx-6 rounded-2xl flex items-center space-x-4 lg:space-x-6 hidden md:block' />
            </Link>
          </div>
          <nav className='mx-6 flex items-center space-x-4 lg:space-x-6 hidden md:block'>
            <Button variant="ghost">
              <Link href="/" className='text-sm font-medium transition-colors'>
              Home
              </Link>
            </Button>
            <Button variant="ghost">
              <Link href="/profilepage" className='text-sm font-medium transition-colors'>
                Profiles
              </Link>
            </Button>
            <Button variant="ghost">
              <Link href="/venues" className='text-sm font-medium transition-colors'>
              Venues
              </Link>
            </Button>
            <Button variant="ghost">
              <Link href="/newistings" className='text-sm font-medium transition-colors'>
              Create Venues
              </Link>
            </Button>
            <Button variant="ghost">
              <Link href="/login" className='text-sm font-medium transition-colors'>
                Login
              </Link>
            </Button>
            <Button variant="ghost">
              <Link href="/register" className='text-sm font-medium transition-colors'>
                Register
              </Link>
            </Button>
          </nav>
        </div>
      </Container>
    </header>
  );
};

export default Header;
