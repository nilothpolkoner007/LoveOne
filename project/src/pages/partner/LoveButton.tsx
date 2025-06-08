import { useState } from 'react';
import axios from 'axios';
import { Heart } from 'lucide-react';

const LoveButton = () => {
  const [showInput, setShowInput] = useState(false);
  const [partnerCode, setPartnerCode] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleConnect = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${import.meta.env.VITE_Backend_url}/user/connect-partner`,
        { partnerCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setMessage(data.message || 'Partner added successfully!');
      setMessageType('success');
      setPartnerCode('');
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Failed to add partner';
      setMessage(errMsg);
      setMessageType('error');
    }
  };

  return (
    <div className='text-center mt-8'>
      <button
        onClick={() => setShowInput(!showInput)}
        className='bg-pink-500 text-white px-4 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-pink-600 transition'
      >
        <Heart className='w-5 h-5' />
        Add Partner
      </button>

      {showInput && (
        <div className='mt-4 space-y-2'>
          <input
            type='text'
            placeholder='Enter partner code'
            className='w-full border px-3 py-2 rounded'
            value={partnerCode}
            onChange={(e) => setPartnerCode(e.target.value)}
          />
          <button
            onClick={handleConnect}
            className='w-full bg-rose-500 text-white py-2 rounded hover:bg-rose-600'
          >
            Connect ❤️
          </button>
        </div>
      )}

      {message && (
        <p
          className={`mt-3 text-sm ${
            messageType === 'success' ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default LoveButton;
