import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, MapPin, Plus, Heart } from 'lucide-react';

interface EventPlace {
  _id: string;
  name: string;
  location: string;
  image?: string;
}

interface Event {
  _id: string;
  title: string;
  date: string;
  type: string;
  description?: string;
  coupleId: string;
  placeId: EventPlace;
}

const CreateEventsPage = () => {
  const { eventPlaceId } = useParams<{ eventPlaceId?: string }>();
  const navigate = useNavigate();
  const coupleId = localStorage.getItem('coupleId');

  const [eventPlaces, setEventPlaces] = useState<EventPlace[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState({
    title: '',
    date: '',
    type: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    if (!coupleId) return navigate('/');
    fetchEventPlaces();
    fetchEvents();
  }, []);

  useEffect(() => {
    if (eventPlaceId) {
      setForm((prev) => ({ ...prev, location: eventPlaceId }));
    }
  }, [eventPlaceId]);

  const fetchEventPlaces = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_Backend_url}/api/eventplaces`);

      // Make sure it's an array
      const places = Array.isArray(res.data) ? res.data : res.data.places || [];

      setEventPlaces(places);
    } catch (err) {
      console.error('Failed to fetch places:', err);
      setEventPlaces([]); // fallback
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_Backend_url}/api/events/${coupleId}`);

      // Handle both array and object with "events" key
      const eventList = Array.isArray(res.data) ? res.data : res.data.events || [];

      setEvents(eventList);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setEvents([]); // Fallback to empty array on error
    }
  };

  const handleSubmit = async () => {
    const { title, date, type, location, description } = form;
    if (!title || !date || !type || !location) return;

    try {
      await axios.post((`${import.meta.env.VITE_Backend_url}/api/events`), {
        title,
        date,
        type,
        placeId: location,
        coupleId,
        description,
      });
      setForm({ title: '', date: '', type: '', location: '', description: '' });
      fetchEvents();
      navigate('/events');
    } catch (err) {
      console.error('Error creating event:', err);
    }
  };

  const upcomingEvents = events
    .filter((e) => new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const daysUntilNext = upcomingEvents.length
    ? Math.ceil((new Date(upcomingEvents[0].date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className='space-y-14 px-4 md:px-10 pb-10 max-w-6xl mx-auto'>
      {/* Countdown Card */}
      {upcomingEvents.length > 0 && (
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
          <div className='p-6 md:flex items-center justify-between'>
            <div>
              <h2 className='text-3xl font-bold text-rose-600'>Next Special Moment</h2>
              <p className='text-gray-500 mt-1'>Get ready to celebrate love 💖</p>
            </div>
            <div className='text-right mt-4 md:mt-0'>
              <p className='text-5xl text-rose-500 font-bold'>{daysUntilNext}</p>
              <p className='text-gray-500'>days left</p>
            </div>
          </div>
          <div className='relative h-60'>
            <img
              src={upcomingEvents[0].placeId?.image}
              className='w-full h-full object-cover'
              alt={upcomingEvents[0].title}
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex items-end text-white'>
              <div>
                <h3 className='text-2xl font-semibold'>{upcomingEvents[0].title}</h3>
                <div className='flex items-center gap-6 mt-2 text-sm text-white/90'>
                  <div className='flex items-center'>
                    <Calendar className='w-4 h-4 mr-1' />
                    {new Date(upcomingEvents[0].date).toLocaleDateString()}
                  </div>
                  <div className='flex items-center'>
                    <MapPin className='w-4 h-4 mr-1' />
                    {upcomingEvents[0].placeId?.location}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Section */}
      <div className='bg-rose-50 rounded-2xl shadow-md p-8 space-y-6'>
        <div className='flex items-center gap-2 text-rose-600 font-semibold text-xl'>
          <Plus className='h-5 w-5' />
          Create a New Event
        </div>
        <div className='grid md:grid-cols-2 gap-4'>
          <input
            type='text'
            placeholder='Event Title'
            className='input-style'
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            type='date'
            className='input-style'
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <select
            className='input-style'
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value=''>Select Event Type</option>
            <option value='anniversary'>Anniversary</option>
            <option value='birthday'>Birthday</option>
            <option value='trip'>Trip</option>
          </select>
          <select
            className='input-style'
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          >
            <option value=''>Select Place</option>
            {eventPlaces.map((place) => (
              <option key={place._id} value={place._id}>
                {place.name} ({place.location})
              </option>
            ))}
          </select>
          <textarea
            className='input-style md:col-span-2'
            placeholder='Event Description (optional)'
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <button
          className='bg-rose-500 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:bg-rose-600 transition'
          onClick={handleSubmit}
        >
          Submit Event
        </button>
      </div>

      {/* Upcoming Events Grid */}
      <div>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>Upcoming Events</h2>
        <div className='grid md:grid-cols-2 gap-6'>
          {upcomingEvents.map((event) => (
            <div
              key={event._id}
              className='bg-white rounded-2xl shadow-lg overflow-hidden transition hover:shadow-xl'
            >
              <div className='h-48 relative'>
                <img
                  src={event.placeId?.image}
                  className='w-full h-full object-cover'
                  alt={event.title}
                />
                {/* Love Icon */}
                <div className='absolute top-3 right-3 text-rose-600 cursor-pointer'>
                  <Heart className='w-6 h-6' />
                </div>
              </div>
              <div className='p-5'>
                <h3 className='text-lg font-semibold text-rose-600'>{event.title}</h3>
                {event.description && <p className='text-gray-600 mt-2'>{event.description}</p>}
                <div className='mt-4 flex items-center text-gray-500 gap-6 text-sm'>
                  <div className='flex items-center'>
                    <Clock className='h-4 w-4 mr-1' />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className='flex items-center'>
                    <MapPin className='h-4 w-4 mr-1' />
                    {event.placeId?.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateEventsPage;
