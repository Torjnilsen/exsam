"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    venueManager: true 
  });

  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://api.noroff.dev/api/v1/holidaze/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          venueManager: formData.venueManager,
        }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        console.error('HTTP error! Status:', response.status);
        console.error('Error response:', data);
  
        if (Array.isArray(data.errors) && data.errors.length > 0) {
          const errorMessage = data.errors[0]?.message || 'Error registering user. Please try again.';
          setError(errorMessage);
        } else {
          setError('Error registering user. Please try again.');
        }
  
        return;
      }
  
      console.log('User registered successfully:', data);
  
      router.push('/login');
    } catch (error) {
      console.error('Error registering user:', error.message);
      setError('Error registering user. Please try again.');
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen" style={{ backgroundImage: "url('/PRIVATE-HOUSE-IN-OSLO.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="w-full px-6 mt-8">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Register</h3>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <Button type="submit">Register</Button>

          {error && <p className="mb-4 text-red-500">{error}</p>}

          <div>
            <p className="font-semibold">
              Already have an account?
              <Link href="/login">
                <span className="text-[#FF585D] underline">Sign in</span>
              </Link>
            </p>
           
          </div>
        </form>
      </div>
    </main>
  );
};

export default Register;
