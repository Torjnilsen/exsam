"use client"
// Login.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.endsWith('@stud.noroff.no')) {
      console.log('Invalid email address. Please use an email ending with "@stud.noroff.no"');
      return;
    }

    try {
      const response = await fetch('https://api.noroff.dev/api/v1/auction/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('HTTP error! Status:', response.status);
        console.error('Error response:', data.errors);
        if (Array.isArray(data.errors) && data.errors.length > 0) {
          const errorMessage = data.errors[0]?.message || 'Error logging in. Please try again ';
          setError(errorMessage);
        } else {
          setError('Error logging in. Please try again.')
        }
        return;
      }

      Cookies.set('authToken', data.accessToken, { expires: 7, path: '/' });

      // Store user details in localStorage
      localStorage.setItem('registeredUser', JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar, // Include other relevant fields
        credits: data.credits,
      }));

      console.log('User logged in successfully', data);

      // Use the useRouter hook to navigate to the home page
      router.push('/');

    } catch (error: any) {
      console.error("Error logging in", error.message);
      setError("Error logging in. Please try again.");
    }
    
  };

  return (
    <main className='flex items-center justify-center min-h-screen bg-[#427981]'>
      <div className='w-full px-6 mt-8'>
        <form onSubmit={handleSubmit} className='max-w-md mx-auto bg-white p-8 rounded-md shadow-md'>
          <h3 className='text-2xl font-bold mb-4 text-gray-800'>Login</h3>
          <div className='mb-4'>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              className='mt-1 p-2 border rounded-md w-full'
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleInputChange}
              className='mt-1 p-2 border rounded-md w-full'
            />
            <Button type='submit'>Login</Button>
            {error && (
              <p className='text-red-400'>{error}</p>
            )}
          </div>
          <p className='font-semibold'>
            Don't have an account?{' '}
            <Link href='/register'>
              <span className='text-[#58d096] underline'>Register</span>
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Login;
