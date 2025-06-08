import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EventsPage() {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch all places
 useEffect(() => {
   axios
     .get(`${import.meta.env.VITE_Backend_url}/api/eventplaces`)
     .then((res) => setPlaces(res.data))
     .catch((err) => console.error('Failed to fetch places', err));
 }, []);
  // Handle click and fetch details
  const handleSelectPlace = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_Backend_url}/api/events/${id}`);
      setSelectedPlace(res.data);
    } catch (err) {
      console.error('Error fetching place detail:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle event creation navigation
  const goToCreateEvent = (eventPlaceId) => {
    navigate(`/events/create/${eventPlaceId}`);
  };

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-semibold text-gray-800'>Event Places</h1>
        <button
          onClick={() => navigate('/events/create')}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
        >
          Go to Event Page
        </button>
      </div>

      <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {places.map((place) => (
          <div
            key={place._id}
            className='bg-white shadow-md rounded-xl overflow-hidden transition hover:shadow-xl'
          >
            <img
              src={place.images?.[0]}
              className='w-full h-40 object-cover cursor-pointer'
              alt={place.name}
              onClick={() => handleSelectPlace(place._id)}
            />
            <div className='p-4'>
              <h2 className='text-lg font-bold text-gray-800'>{place.name}</h2>
              <p className='text-sm text-gray-600'>{place.location}</p>
              <button
                onClick={() => goToCreateEvent(place._id)}
                className='mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700'
              >
                Create Event Here
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail View Modal */}
      {selectedPlace && (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-xl w-full max-w-3xl overflow-y-auto max-h-[90vh] relative'>
            <button
              onClick={() => setSelectedPlace(null)}
              className='absolute top-2 right-2 text-gray-500 hover:text-black text-2xl'
            >
              ✕
            </button>

            <h2 className='text-2xl font-bold mb-2'>{selectedPlace.name}</h2>
            <div className='grid md:grid-cols-2 gap-4'>
              <div>
                <p>
                  <strong>Address:</strong> {selectedPlace.address}
                </p>
                <p>
                  <strong>City:</strong> {selectedPlace.city}
                </p>
                <p>
                  <strong>State:</strong> {selectedPlace.state}
                </p>
                <p>
                  <strong>Location:</strong> {selectedPlace.location}
                </p>
                <p>
                  <strong>Good For:</strong> {selectedPlace.goodfor}
                </p>
                <p>
                  <strong>Type:</strong> {selectedPlace.type}
                </p>
                <p>
                  <strong>Rating:</strong> ⭐ {selectedPlace.ratting}
                </p>
              </div>
              <div>
                <p>
                  <strong>Phone:</strong> {selectedPlace.phone}
                </p>
                <p>
                  <strong>Email:</strong> {selectedPlace.email}
                </p>
                <p>
                  <strong>Website:</strong>{' '}
                  <a
                    href={selectedPlace.website}
                    target='_blank'
                    rel='noreferrer'
                    className='text-blue-600 underline'
                  >
                    {selectedPlace.website}
                  </a>
                </p>
                <p className='mt-2'>
                  <strong>Description:</strong>
                </p>
                <p className='text-gray-700'>{selectedPlace.description}</p>
              </div>
            </div>

            {/* Images */}
            <div className='mt-4 grid grid-cols-2 md:grid-cols-3 gap-2'>
              {selectedPlace.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Image ${idx}`}
                  className='rounded-lg w-full h-32 object-cover'
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 text-white text-lg'>
          Loading details...
        </div>
      )}
    </div>
  );
}
