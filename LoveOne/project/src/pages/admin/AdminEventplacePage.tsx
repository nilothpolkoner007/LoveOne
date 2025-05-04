// AdminEventplacePage.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';

interface EventplaceForm {
  _id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  location: string;
  goodfor: string;
  type: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  images: string[];
  ratting: number;
}

const AdminEventplacePage = () => {
  const [form, setForm] = useState<EventplaceForm>({
    name: '',
    address: '',
    city: '',
    state: '',
    location: '',
    goodfor: '',
    type: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    images: [],
    ratting: 0,
  });

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventplaces, setEventplaces] = useState<EventplaceForm[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchEventplaces();
  }, []);

  const fetchEventplaces = async () => {
    const res = await axios.get(`${import.meta.env.VITE_Backend_url}/api/eventplaces`);
    setEventplaces(res.data);
  };

  const uploadImageToImgBB = async (file: File) => {
    const apiKey = '3df0df0c62dc81d5a91fdc70cda5b1eb';

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const formData = new FormData();
        formData.append('image', base64);

        try {
          const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (data.success) {
            resolve(data.data.url);
          } else {
            reject('Upload failed');
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [...prev, ...newFiles.map((file) => URL.createObjectURL(file))]);
    e.target.value = '';
  };

  const resetForm = () => {
    setForm({
      name: '',
      address: '',
      city: '',
      state: '',
      location: '',
      goodfor: '',
      type: '',
      phone: '',
      email: '',
      website: '',
      description: '',
      images: [],
      ratting: 0,
    });
    setImages([]);
    setPreviewUrls([]);
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls = await Promise.all(images.map(uploadImageToImgBB));
      const payload = {
        ...form,
        images: editId ? [...form.images, ...imageUrls] : imageUrls,
      };

      if (editId) {
        await axios.put(`${import.meta.env.VITE_Backend_url}/api/eventplaces/${editId}`, payload);
      } else {
        await axios.post(`${import.meta.env.VITE_Backend_url}/api/eventplaces`, payload);
      }

      alert(`Eventplace ${editId ? 'updated' : 'added'} successfully!`);
      fetchEventplaces();
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (eventplace: EventplaceForm) => {
    setForm(eventplace);
    setEditId(eventplace._id || null);
    setPreviewUrls(eventplace.images);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      await axios.delete(`${import.meta.env.VITE_Backend_url}/api/eventplaces/${id}`);
      fetchEventplaces();
    }
  };

  return (
    <div className='max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-xl space-y-10'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <h2 className='text-2xl font-bold'>{editId ? 'Edit Eventplace' : 'Add New Eventplace'}</h2>
        {Object.entries(form).map(
          ([key, value]) =>
            key !== 'images' &&
            key !== 'ratting' &&
            key !== '_id' && (
              <input
                key={key}
                type='text'
                placeholder={key}
                className='w-full p-2 border rounded'
                value={value as string}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required
              />
            ),
        )}
        <input
          type='number'
          placeholder='Rating'
          className='w-full p-2 border rounded'
          value={form.ratting}
          onChange={(e) => setForm({ ...form, ratting: parseFloat(e.target.value) })}
        />
        <input
          type='file'
          multiple
          accept='image/*'
          onChange={handleImageChange}
          className='mb-2'
        />
        {previewUrls.length > 0 && (
          <div className='grid grid-cols-3 gap-4'>
            {previewUrls.map((url, idx) => (
              <div key={idx} className='relative'>
                <img
                  src={url}
                  className='w-full h-32 object-cover rounded'
                  alt={`preview-${idx}`}
                />
                <button
                  type='button'
                  onClick={() => {
                    setPreviewUrls((pre) => pre.filter((_, i) => i !== idx));
                    setImages((img) => img.filter((_, i) => i !== idx));
                  }}
                  className='absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded'
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type='submit'
          disabled={loading}
          className='bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 flex items-center gap-2'
        >
          <PlusCircle size={18} />{' '}
          {loading ? 'Saving...' : editId ? 'Update Eventplace' : 'Add Eventplace'}
        </button>
      </form>

      <div>
        <h2 className='text-xl font-bold mb-4'>All Eventplaces</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {eventplaces.map((ep) => (
            <div key={ep._id} className='p-4 border rounded-lg shadow space-y-2'>
              <img src={ep.images[0]} className='w-full h-40 object-cover rounded' alt={ep.name} />
              <h3 className='font-semibold'>{ep.name}</h3>
              <p className='text-sm text-gray-600'>
                {ep.city}, {ep.state}
              </p>
              <div className='flex gap-2'>
                <button
                  onClick={() => handleEdit(ep)}
                  className='text-blue-500 flex items-center gap-1'
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(ep._id!)}
                  className='text-red-500 flex items-center gap-1'
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminEventplacePage;
