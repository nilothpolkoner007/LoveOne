import { useState } from 'react';
import { Copy } from 'lucide-react';
import axios from 'axios';
import LoveButton from './LoveButton';

const AddPartnerPage = () => {
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${import.meta.env.VITE_Backend_url}/user/generate-partner-link`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const generatedLink = `${import.meta.env.VITE_Backend_url}/join-partner?code=${data.code}`;
      setLink(generatedLink);
      const code = data.code;
      setLink(code)
    } catch (err) {
      console.error('Error generating link:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-100 to-white px-4'>
      <div className='bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center'>
        <h2 className='text-2xl font-bold mb-4 text-gray-800'>Invite Your Partner 💞</h2>
        <p className='text-gray-600 mb-6'>
          Click the button below to generate a unique link for your partner to join.
        </p>
        <button
          onClick={handleGenerateLink}
          className='bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg mb-4 transition-all'
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Link'}
        </button>

        {link && (
          <div className='mt-6 p-4 bg-gray-100 rounded-lg text-left relative'>
            <input value={link} readOnly className='w-full bg-transparent outline-none' />
            <button
              onClick={handleCopy}
              className='absolute top-3 right-3 text-pink-500'
              title='Copy'
            >
              <Copy />
            </button>
            {copied && <p className='text-green-500 text-sm mt-2'>Link copied to clipboard!</p>}
          </div>
        )}
       
      </div>
      <div>
        <h1 className='text-3xl font-bold text-center'>Welcome to Couple Space 💑</h1>
        <LoveButton />
      </div>
    </div>
  );
};
          
export default AddPartnerPage;
