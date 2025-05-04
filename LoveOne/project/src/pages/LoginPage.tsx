import { useState } from 'react';
import { Heart, Mail, Lock, ArrowRight, User, UsersIcon } from 'lucide-react';
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = ({ setUser }: { setUser: (user: any) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [name, setName] = useState('');
 const [message, setMessage] = useState('');
 const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

   try {
     const url = isLogin ? `${import.meta.env.VITE_Backend_url}/user/login` : `${import.meta.env.VITE_Backend_url}/user/register`;

     const payload = isLogin ? { email, password } : { name, email,birthday,gender, password };

     const { data } = await axios.post(url, payload);
     console.log('Success:', data);
     setMessage(data.message || 'Success!');
     setMessageType('success');
      localStorage.setItem('userId', data.user._id);
       localStorage.setItem('token', data.token); // Store token
       localStorage.setItem('isAdmin', data.isAdmin); // Store admin status
       setUser(data);

 if (data.user.isAdmin) {
    navigate('/admin');
    return;
  }

  // ✅ Check for couple
  try {
    const partnerRes = await fetch(`${import.meta.env.VITE_Backend_url}/user/connections`, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });

    if (partnerRes.status === 200) {
      navigate('/chat'); // ✅ couple exists
    } else {
      navigate('/partner'); // ❌ no partner yet
    }
  } catch (err) {
    console.error('❌ Error checking partner:', err);
    navigate('/partner'); // fallback
  }
   } catch (err) {
     console.error('❌ Error:', err);
     console.log(err);
     setMessage(err.response.data.message || 'Error');
     setMessageType('error');
   }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-xl max-w-4xl w-full overflow-hidden'>
        <div className='grid md:grid-cols-2'>
          {message && (
            <p
              className={`mt-4 text-center text-sm ${
                messageType === 'error' ? 'text-red-500' : 'text-green-600'
              }`}
            >
              {message}
            </p>
          )}
          {/* Image Section */}
          <div className='hidden md:block relative'>
            <img
              src='https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
              alt='Love'
              className='h-full w-full object-cover'
            />
            <div className='absolute inset-0 bg-rose-500 bg-opacity-20' />
          </div>

          {/* Form Section */}
          <div className='p-8 md:p-12'>
            <div className='flex items-center space-x-2 mb-8'>
              <Heart className='h-8 w-8 text-rose-500' />
              <span className='text-2xl font-semibold text-gray-800'>Couple Space</span>
            </div>

            <h2 className='text-3xl font-bold text-gray-800 mb-8'>
              {isLogin ? 'Welcome Back!' : 'Create Your Account'}
            </h2>

            <form className='space-y-6' onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <div className='grid grid-cols-2 gap-4'>
                    <Input
                      label='Your Name'
                      placeholder='John'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      icon={<User className='h-5 w-5 text-gray-400' />}
                    />
                    <Input
                      label='Your Birthday'
                      type='date'
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      icon={<User className='h-5 w-5 text-gray-400' />}
                    />
                    <div className='flex flex-col space-y-1'>
                      <label className='text-sm font-medium text-gray-700'>Your Gender</label>
                      <div className='relative'>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                          <option value=''>Select Gender</option>
                          <option value='Male'>Male</option>
                          <option value='Female'>Female</option>
                          <option value='Other'>Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <Input
                label='Email'
                type='email'
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className='h-5 w-5 text-gray-400' />}
              />
              <Input
                label='Password'
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className='h-5 w-5 text-gray-400' />}
              />

              <button
                type='submit'
                className='w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition-colors flex items-center justify-center'
              >
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className='ml-2 h-5 w-5' />
              </button>
            </form>

            <p className='mt-6 text-center text-gray-600'>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className='text-rose-500 hover:text-rose-600 font-medium'
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  type = 'text',
  placeholder,
  icon,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>{label}</label>
      <div className='relative'>
        {icon && (
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full rounded-lg border border-gray-300 ${
            icon ? 'pl-10' : 'pl-4'
          } pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );

}

export default LoginPage;
