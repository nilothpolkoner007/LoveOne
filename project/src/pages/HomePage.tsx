import { ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className='py-12'>
      {/* Hero Section */}
      <section className='mb-20'>
        <div className='grid md:grid-cols-2 gap-12 items-center'>
          <div>
            <h1 className='text-4xl md:text-5xl font-bold text-gray-800 leading-tight'>
              Celebrate Love, Share Moments, Find the Perfect Gift
            </h1>
            <p className='mt-6 text-lg text-gray-600'>
              Create your own digital space where love flourishes. Share moments, plan surprises,
              and keep your connection strong.
            </p>
            <div className='mt-8 flex space-x-4'>
              <Link
                to='/login'
                className='bg-rose-500 text-white px-8 py-3 rounded-full hover:bg-rose-600 transition-colors flex items-center'
              >
                Join as a Couple <ArrowRight className='ml-2 h-5 w-5' />
              </Link>
              <Link
                to='/gifts'
                className='border-2 border-rose-500 text-rose-500 px-8 py-3 rounded-full hover:bg-rose-50 transition-colors'
              >
                Explore Gifts
              </Link>
            </div>
          </div>
          <div className='relative'>
            <img
              src='https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
              alt='Happy Couple'
              className='rounded-2xl shadow-2xl'
            />
            <div className='absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg'>
              <div className='flex items-center space-x-2'>
                <Heart className='h-5 w-5 text-rose-500' fill='currentColor' />
                <span className='text-gray-800 font-medium'>2,500+ Couples Connected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='mb-20'>
        <h2 className='text-3xl font-bold text-center text-gray-800 mb-12'>
          Everything You Need to Keep Love Growing
        </h2>
        <div className='grid md:grid-cols-3 gap-8'>
          <FeatureCard
            title='Private Chat'
            description='Share your thoughts and feelings in a private space just for two.'
          />
          <FeatureCard
            title='Music Sharing'
            description='Create playlists together and soundtrack your love story.'
          />
          <FeatureCard
            title='Gift Ideas'
            description='Discover and save perfect gift ideas for special occasions.'
          />
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <h2 className='text-3xl font-bold text-center text-gray-800 mb-12'>
          Love Stories from Our Couples Make by Nilothpol Koner
        </h2>
        <div className='grid md:grid-cols-3 gap-8'>
          <TestimonialCard
            image='https://media.licdn.com/dms/image/v2/D4D35AQE1kIMoYaY_Wg/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1723440100468?e=1746975600&v=beta&t=4tg1gCWqQqJifWBJXpXM9fONX2Nwe-BCtj5Nnlh7VRw&auto=format&fit=crop&w=200&q=80'
            name='Nilothpol Koner'
            text='This app has brought us even closer. We love sending surprise gifts!'
          />
          <TestimonialCard
            image='https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
            name='James & Emma'
            text='The shared music feature is amazing! Perfect for our relationship.'
          />
          <TestimonialCard
            image='https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
            name='Lisa & David'
            text='Finally, a place where we can organize all our memories together.'
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function TestimonialCard({ image, name, text }: { image: string; name: string; text: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center space-x-4 mb-4">
        <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <h4 className="font-semibold text-gray-800">{name}</h4>
          <div className="flex text-rose-500">
            {[...Array(5)].map((_, i) => (
              <Heart key={i} className="h-4 w-4" fill="currentColor" />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}

export default HomePage;