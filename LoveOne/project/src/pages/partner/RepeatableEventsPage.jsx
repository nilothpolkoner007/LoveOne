import React, { useEffect, useState } from 'react';

const RepeatableEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRepeatableEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_Backend_url}/api/events/repeatable`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch repeatable events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepeatableEvents();
  }, []);

  return (
    <div className='p-4 max-w-5xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6 text-center'>🎉 Upcoming Events</h1>
      {loading ? (
        <p className='text-center text-gray-500'>Loading...</p>
      ) : events.length === 0 ? (
        <p className='text-center text-gray-500'>No upcoming repeatable events found.</p>
      ) : (
        <div className='grid gap-6 sm:grid-cols-2 md:grid-cols-3'>
          {events.map((event) => (
            <div
              key={event._id}
              className='bg-white shadow-md rounded-2xl p-4 flex flex-col items-center'
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className='w-full h-40 object-cover rounded-lg mb-3'
                />
              )}
              <h2 className='text-xl font-semibold text-center'>{event.title}</h2>
              <p className='text-sm text-gray-600 text-center'>{event.description}</p>
              <p className='text-sm text-gray-800 mt-2'>
                📅 <strong>{new Date(event.adjustedDate).toLocaleDateString()}</strong>
              </p>
              <p className='text-green-600 font-medium mt-1'>⏳ {event.countdown} days left</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepeatableEventsPage;
