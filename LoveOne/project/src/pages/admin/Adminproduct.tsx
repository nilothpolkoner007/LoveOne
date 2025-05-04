import { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';

interface GiftForm {
  _id?: string;
  name: string;
  price: string;
  description: string;
  stock: string;
  category: string;
  occasion: string;
  featured: boolean;
  images: string[];
}

const AdminGiftProductPage = () => {
  const [form, setForm] = useState<GiftForm>({
    name: '',
    price: '',
    description: '',
    stock: '',
    category: '',
    occasion: '',
    featured: false,
    images: [],
  });

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<GiftForm[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(`${import.meta.env.VITE_Backend_url}/api/products`);
    setProducts(res.data);
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
      price: '',
      description: '',
      stock: '',
      category: '',
      occasion: '',
      featured: false,
      images: [],
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
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        images: editId ? [...form.images, ...imageUrls] : imageUrls,
      };

      if (editId) {
        await axios.put(`${import.meta.env.VITE_Backend_url}/api/products/${editId}`, payload);
      } else {
        await axios.post(`${import.meta.env.VITE_Backend_url}/api/products`, payload);
      }

      alert(`Product ${editId ? 'updated' : 'added'} successfully!`);
      fetchProducts();
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: GiftForm) => {
    setForm({ ...product, price: product.price.toString(), stock: product.stock.toString() });
    setEditId(product._id || null);
    setPreviewUrls(product.images);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      await axios.delete(`${import.meta.env.VITE_Backend_url}/api/products/${id}`);
      fetchProducts();
    }
  };

  return (
    <div className='max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-xl space-y-10'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <h2 className='text-2xl font-bold'>{editId ? 'Edit Product' : 'Add New Gift Product'}</h2>
        <input
          type='text'
          placeholder='Name'
          className='w-full p-2 border rounded'
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type='number'
          placeholder='Price'
          className='w-full p-2 border rounded'
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type='number'
          placeholder='Stock'
          className='w-full p-2 border rounded'
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          required
        />
        <textarea
          placeholder='Description'
          className='w-full p-2 border rounded'
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        ></textarea>
        <div className='grid grid-cols-2 gap-4'>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className='p-2 border rounded'
            required
          >
            <option value=''>Category</option>
            <option value='jewelry'>Jewelry</option>
            <option value='experience'>Experience</option>
            <option value='personalized'>Personalized</option>
          </select>
          <select
            value={form.occasion}
            onChange={(e) => setForm({ ...form, occasion: e.target.value })}
            className='p-2 border rounded'
            required
          >
            <option value=''>Occasion</option>
            <option value='anniversary'>Anniversary</option>
            <option value='birthday'>Birthday</option>
            <option value='date'>Date Night</option>
          </select>
        </div>
        <label className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Featured
        </label>
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
          {loading ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      <div>
        <h2 className='text-xl font-bold mb-4'>All Products</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {products.map((product) => (
            <div key={product._id} className='p-4 border rounded-lg shadow space-y-2'>
              <img
                src={product.images[0]}
                className='w-full h-40 object-cover rounded'
                alt={product.name}
              />
              <h3 className='font-semibold'>{product.name}</h3>
              <p className='text-sm text-gray-600'>₹{product.price}</p>
              <div className='flex gap-2'>
                <button
                  onClick={() => handleEdit(product)}
                  className='text-blue-500 flex items-center gap-1'
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id!)}
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

export default AdminGiftProductPage;
