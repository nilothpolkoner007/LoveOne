import { useEffect, useState } from 'react';
import axios from 'axios';
import { Gift, Heart, Search, X } from 'lucide-react';

interface GiftItem {
  _id: string;
  name: string;
  price: number;
  images: string[]; // fixed
  category: string;
  occasion: string;
  likes: number;
  description?: string; // added optional field
}

function GiftsPage() {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOccasion, setSelectedOccasion] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<GiftItem | null>(null);
  const [priceRange, setPriceRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchGifts = async () => {
    const res = await axios.get(`${import.meta.env.VITE_Backend_url}/api/products`);
    setGifts(res.data);
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  const handleLike = async (id: string) => {
    await axios.post(`${import.meta.env.VITE_Backend_url}/api/products/${id}/like`);
    fetchGifts();
  };

  const handleSelectProduct = async (id: string) => {
    const res = await axios.get(`${import.meta.env.VITE_Backend_url}/api/products/${id}`);
    setSelectedProduct(res.data);
  };

  const handleOrder = async (gift: GiftItem) => {
    await axios.post('/api/orders', { giftId: gift._id });
    alert(`Order placed for ${gift.name}!`);
  };

  const filteredGifts = gifts.filter((gift) => {
    const categoryMatch = selectedCategory === 'all' || gift.category === selectedCategory;
    const occasionMatch = selectedOccasion === 'all' || gift.occasion === selectedOccasion;
    const priceMatch =
      priceRange === 'all' ||
      (priceRange === 'under50' && gift.price < 50) ||
      (priceRange === '50to100' && gift.price >= 50 && gift.price <= 100) ||
      (priceRange === 'over100' && gift.price > 100);
    const searchMatch = gift.name.toLowerCase().includes(searchTerm.toLowerCase());

    return categoryMatch && occasionMatch && priceMatch && searchMatch;
  });

  return (
    <div className='space-y-8 px-6 py-8'>
      {/* Filters */}
      <div className='bg-white rounded-xl shadow-lg p-6 space-y-4 md:flex md:space-y-0 md:space-x-6'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
          <input
            type='text'
            placeholder='Search for gifts...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500'
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className='rounded-lg border px-4 py-2'
        >
          <option value='all'>All Categories</option>
          <option value='jewelry'>Jewelry</option>
          <option value='experience'>Experiences</option>
          <option value='personalized'>Personalized</option>
        </select>
        <select
          value={selectedOccasion}
          onChange={(e) => setSelectedOccasion(e.target.value)}
          className='rounded-lg border px-4 py-2'
        >
          <option value='all'>All Occasions</option>
          <option value='anniversary'>Anniversary</option>
          <option value='birthday'>Birthday</option>
          <option value='date'>Date Night</option>
        </select>
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className='rounded-lg border px-4 py-2'
        >
          <option value='all'>All Prices</option>
          <option value='under50'>Under $50</option>
          <option value='50to100'>$50 - $100</option>
          <option value='over100'>Over $100</option>
        </select>
      </div>

      {/* Gift Grid */}
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredGifts.map((gift) => (
          <div
            key={gift._id}
            className='bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer'
            onClick={() => handleSelectProduct(gift._id)}
          >
            <img src={gift.images[0]} alt={gift.name} className='w-full h-48 object-cover' />
            <div className='p-4'>
              <h3 className='font-semibold text-gray-800'>{gift.name}</h3>
              <p className='text-rose-500 font-medium mt-2'>${gift.price.toFixed(2)}</p>
              <p className='text-sm text-gray-500 mt-1 capitalize'>Category: {gift.category}</p>
              <div className='mt-4 flex justify-between items-center'>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(gift._id);
                  }}
                  className='flex items-center text-gray-600 hover:text-rose-500 space-x-1'
                >
                  <Heart className='h-5 w-5' />
                  <span>{gift.likes}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOrder(gift);
                  }}
                  className='bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600'
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Product Modal */}
      {selectedProduct && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white max-w-4xl rounded-lg shadow-xl p-6 relative space-y-6 overflow-y-auto max-h-[90vh]'>
            <button
              className='absolute top-4 right-4 text-gray-500 hover:text-red-500'
              onClick={() => setSelectedProduct(null)}
            >
              <X className='w-6 h-6' />
            </button>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                {selectedProduct.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${selectedProduct.name} ${index + 1}`}
                    className='w-full h-64 object-cover rounded-lg shadow'
                  />
                ))}
              </div>
              <div className='space-y-4'>
                <h2 className='text-2xl font-semibold text-gray-800'>{selectedProduct.name}</h2>
                <p className='text-rose-500 text-xl font-bold'>
                  ${selectedProduct.price.toFixed(2)}
                </p>
                <p className='text-gray-600'>
                  {selectedProduct.description || 'No description available.'}
                </p>
                <div className='flex gap-4'>
                  <button className='bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600'>
                    Add to Wishlist
                  </button>
                  <button
                    onClick={() => handleOrder(selectedProduct)}
                    className='bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600'
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GiftsPage;
