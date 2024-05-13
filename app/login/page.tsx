"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


const isValidEmail = (email: string): boolean => {
  return email.endsWith('@stud.noroff.no'); 
};

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError('Invalid email address. Please use a valid email ending with "@stud.noroff.no"');
      return;
    }

    try {
      const response = await fetch('https://api.noroff.dev/api/v1/holidaze/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed. Please try again.');
        console.error("Login error:", data); 
        return;
      }

      localStorage.setItem('registeredUser', JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        venueManager: true,
        accessToken: data.accessToken, 
      }));

      console.log('User logged in successfully', data);

   
      router.push('/');

    } catch (error: any) {
      console.error("Error logging in:", error.message);
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen" style={{ backgroundImage: "url('/login.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="w-full px-6 mt-8">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Login</h3>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              className="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              className="mt-1 p-2 border rounded-md w/full"
              required
            />
          </div>
          {error && (
            <p className="text-red-500 mb-4">{error}</p> 
          )}
          <Button type="submit" className="w-full">Login</Button>
          <p className="mt-4 font-semibold">
            Don't have an account?{' '}
            <Link href="/register">
              <span className="text-[#FF585D] underline">Register</span>
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Login;
