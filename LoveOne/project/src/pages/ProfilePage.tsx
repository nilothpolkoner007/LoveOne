import { useState, useEffect } from 'react';
import { Camera, Heart, Music, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import MemoriesSection from './partner/MemoriesSection';

function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [showMemories, setShowMemories] = useState(false);
  const currentUserId = localStorage.getItem('userId');

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${import.meta.env.VITE_Backend_url}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const normalize = (v: any) =>
        Array.isArray(v) ? v : typeof v === 'string' ? v.split(',') : [];

      ['partner1', 'partner2'].forEach((key) => {
        data[key].interests = normalize(data[key].interests);
        data[key].favoriteMusic = normalize(data[key].favoriteMusic);
        data[key].giftPreferences = normalize(data[key].giftPreferences);
      });

      data.milestones = (data.milestones || []).map((m: any) => ({
        ...m,
        date: new Date(m.date),
      }));

      setProfile(data);
      setCoupleId(data.coupleId);
      localStorage.setItem('coupleId', data.coupleId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleBreakup = async () => {
    if (!window.confirm('Are you sure you want to break up? 💔')) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_Backend_url}/user/disconnect-partner`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        setProfile(null);
        window.location.reload();
      } else {
        alert(result.message || 'Something went wrong');
      }
    } catch {
      alert('Server error. Please try again.');
    }
  };

  const handleProfileUpload = async (file: File, partnerKey: 'partner1' | 'partner2') => {
    const formData = new FormData();
    formData.append('file', file);

    const uploadRes = await fetch(`${import.meta.env.VITE_Backend_url}/upload`, {
      method: 'POST',
      body: formData,
    });

    const { imageUrl } = await uploadRes.json();

    await fetch(`${import.meta.env.VITE_Backend_url}/user/profile-picture`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: profile[partnerKey]._id,
        imageUrl,
      }),
    });

    setProfile((prev: any) => ({
      ...prev,
      [partnerKey]: {
        ...prev[partnerKey],
        img: [...(prev[partnerKey].img || []), imageUrl],
      },
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className='text-red-500'>{error}</div>;

  const isPartner1 = profile.partner1._id === currentUserId;
  const isPartner2 = profile.partner2._id === currentUserId;
  const self = isPartner1 ? profile.partner1 : profile.partner2;
  const partner = isPartner1 ? profile.partner2 : profile.partner1;
  const relationshipDuration = Math.floor(
    (Date.now() - new Date(profile.anniversary).getTime()) / (1000 * 60 * 60 * 24 * 365),
  );
  const partnerBirthday = new Date(partner.dateOfBirth).toLocaleDateString();

  return (
    <div className='space-y-8'>
      <div className='grid md:grid-cols-2 gap-6'>
        <ProfileCard
          profile={profile.partner1}
          partnerKey='partner1'
          onUpload={handleProfileUpload}
          canEdit={isPartner1}
        />
        <ProfileCard
          profile={profile.partner2}
          partnerKey='partner2'
          onUpload={handleProfileUpload}
          canEdit={isPartner2}
        />
      </div>

      <div className='bg-white rounded-2xl shadow-lg p-8'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-800'>Our Story</h2>
          <div className='flex items-center gap-2 text-rose-500'>
            <Heart className='h-6 w-6' fill='currentColor' />
            <span className='font-semibold'>{relationshipDuration} years together</span>
          </div>
        </div>

        <p className='text-gray-600 text-sm mb-4'>
          Partner’s Birthday: <span className='font-medium'>{partnerBirthday}</span>
        </p>

        {profile.milestones?.map((m: any, i: number) => (
          <div key={i} className='relative flex items-start ml-12 mb-6'>
            <div className='bg-white rounded-xl shadow-sm p-4 w-full'>
              {m.image && (
                <img
                  src={m.image}
                  alt={m.title}
                  className='w-full h-48 object-cover rounded-lg mb-4'
                />
              )}
              <h3 className='text-lg font-semibold text-gray-800'>{m.title}</h3>
              <p className='text-gray-600'>{m.description}</p>
              <p className='text-sm text-gray-500 mt-2'>{m.date.toLocaleDateString()}</p>
            </div>
          </div>
        ))}

        <button
          onClick={() => setShowMemories(true)}
          className='mt-6 w-full bg-gray-100 py-3 rounded-lg hover:bg-gray-200 text-gray-700'
        >
          Add New Milestone
        </button>

        {showMemories && <MemoriesSection coupleId={coupleId} />}
      </div>

      <div className='grid md:grid-cols-3 gap-6'>
        <PreferenceCard
          icon={<Heart />}
          title='Shared Interests'
          items={[...new Set([...self.interests, ...partner.interests])]}
        />
        <PreferenceCard
          icon={<Music />}
          title='Music Tastes'
          items={[...new Set([...self.favoriteMusic, ...partner.favoriteMusic])]}
        />
        <PreferenceCard
          icon={<Gift />}
          title='Gift Preferences'
          items={[...new Set([...self.giftPreferences, ...partner.giftPreferences])]}
        />
      </div>

      <button
        onClick={handleBreakup}
        className='mt-6 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full shadow'
      >
        💔 Break Up
      </button>
    </div>
  );
}

// Image slideshow + upload
function ProfileCard({ profile, partnerKey, onUpload, canEdit }: any) {
  const [imgIndex, setImgIndex] = useState(0);
  const images = profile.img || [];

  const next = () => setImgIndex((i) => (i + 1) % images.length);
  const prev = () => setImgIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
      <div className='relative h-48'>
        {images.length > 0 ? (
          <>
            <img src={images[imgIndex]} alt='profile' className='w-full h-full object-cover' />
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className='absolute left-2 top-1/2 bg-white p-1 rounded-full shadow'
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={next}
                  className='absolute right-2 top-1/2 bg-white p-1 rounded-full shadow'
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </>
        ) : (
          <div className='w-full h-full flex items-center justify-center text-gray-400'>
            No Image
          </div>
        )}

        {canEdit && (
          <label className='absolute bottom-4 right-4 bg-white p-2 rounded-full shadow cursor-pointer'>
            <Camera />
            <input
              type='file'
              accept='image/*'
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file, partnerKey);
              }}
            />
          </label>
        )}
      </div>
      <div className='p-4'>
        <h2 className='text-xl font-bold text-gray-800'>{profile.name}</h2>
        <p className='text-gray-600'>{profile.location}</p>
      </div>
    </div>
  );
}

function PreferenceCard({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className='bg-white rounded-xl shadow p-6'>
      <div className='flex items-center space-x-3 mb-4'>
        {icon}
        <h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
      </div>
      <div className='flex flex-wrap gap-2'>
        {items.map((item, i) => (
          <span key={i} className='px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm'>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;
