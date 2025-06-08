import { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarPlus, Trash2, Pencil, Upload } from 'lucide-react';

interface Milestone {
  _id: string;
  title: string;
  description: string;
  date: string;
  image?: string;
}

export default function MemoriesSection({ coupleId }: { coupleId: string }) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    date: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem('token');

  const fetchMilestones = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_Backend_url}/api/couple-profile/${coupleId}/milestones`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMilestones(res.data);
    } catch (err) {
      console.error('Failed to fetch milestones', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleSubmit = async () => {
    try {
      const endpoint = editingId
        ? `${import.meta.env.VITE_Backend_url}/api/couple-profile/${coupleId}/milestones/${editingId}`
        : `${import.meta.env.VITE_Backend_url}/api/couple-profile/${coupleId}/milestones`;

      const method = editingId ? axios.put : axios.post;

      await method(endpoint, newMilestone, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewMilestone({ title: '', description: '', date: '', image: '' });
      setEditingId(null);
      fetchMilestones();
    } catch (err) {
      console.error('Error saving milestone', err);
    }
  };

  const handleEdit = (milestone: Milestone) => {
    setNewMilestone({ ...milestone });
    setEditingId(milestone._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_Backend_url}/api/couple-profile/${coupleId}/milestones/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMilestones();
    } catch (err) {
      console.error('Failed to delete milestone', err);
    }
  };

 const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
   const file = e.target.files?.[0];
   if (!file) return;

   setUploading(true);
   const formData = new FormData();
   formData.append('file', file);

   try {
     const res = await fetch(`${import.meta.env.VITE_Backend_url}/upload`, {
       method: 'POST',
       body: formData,
     });

     const data = await res.json();
     setNewMilestone((prev) => ({ ...prev, image: data.imageUrl }));
   } catch (error) {
     alert('Image upload failed');
     console.error(error);
   } finally {
     setUploading(false);
   }
 };


  return (
    <div className='bg-white rounded-2xl shadow-lg p-8 mt-8'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
        <CalendarPlus className='text-rose-500' />
        Memories & Milestones
      </h2>

      <div className='grid gap-4 md:grid-cols-2'>
        {milestones.map((m) => (
          <div key={m._id} className='bg-gray-50 p-4 rounded-xl shadow-sm'>
            {m.image && (
              <img
                src={m.image}
                alt={m.title}
                className='h-40 w-full object-cover rounded-md mb-3'
              />
            )}
            <h3 className='text-lg font-semibold'>{m.title}</h3>
            <p className='text-gray-600'>{m.description}</p>
            <p className='text-sm text-gray-500 mt-1'>{new Date(m.date).toLocaleDateString()}</p>
            <div className='flex gap-2 mt-3'>
              <button onClick={() => handleEdit(m)} className='text-blue-500 hover:underline'>
                <Pencil size={18} />
              </button>
              <button onClick={() => handleDelete(m._id)} className='text-red-500 hover:underline'>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-8 border-t pt-6'>
        <h3 className='text-xl font-semibold mb-4'>{editingId ? 'Edit' : 'Add'} Memory</h3>
        <div className='grid gap-4 md:grid-cols-2'>
          <input
            type='text'
            placeholder='Title'
            value={newMilestone.title}
            onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
            className='border p-2 rounded-md'
          />
          <input
            type='date'
            value={newMilestone.date}
            onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
            className='border p-2 rounded-md'
          />
          <div className='flex items-center gap-2'>
            <label
              htmlFor='image-upload'
              className={`flex items-center gap-2 cursor-pointer ${
                uploading ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:underline'
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </label>
            <input
              id='image-upload'
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              hidden
            />
          </div>
          {newMilestone.image && (
            <img
              src={newMilestone.image}
              alt='Uploaded preview'
              className='h-40 w-full object-cover rounded-md col-span-2'
            />
          )}
          <textarea
            placeholder='Description'
            value={newMilestone.description}
            onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
            className='border p-2 rounded-md col-span-2'
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className={`mt-4 px-4 py-2 rounded-lg transition text-white ${
            uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600'
          }`}
        >
          {editingId ? 'Update' : 'Add'} Memory
        </button>
      </div>
    </div>
  );
}
