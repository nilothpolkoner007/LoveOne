import { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Heart, Share2, Plus } from 'lucide-react';

interface Song {
  id: number;
  title: string;
  artist: string;
  cover: string;
  mood: string;
}

function MusicPage() {
  const [currentMood, setCurrentMood] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);

  const moods = [
    { id: 'all', name: 'All Songs' },
    { id: 'romantic', name: 'Romantic' },
    { id: 'missing', name: 'Missing You' },
    { id: 'date', name: 'Date Night' },
    { id: 'chill', name: 'Chill' },
  ];

  const songs: Song[] = [
    {
      id: 1,
      title: "Perfect",
      artist: "Ed Sheeran",
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      mood: "romantic"
    },
    {
      id: 2,
      title: "All of Me",
      artist: "John Legend",
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      mood: "romantic"
    },
    {
      id: 3,
      title: "A Thousand Years",
      artist: "Christina Perri",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      mood: "romantic"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Mood Selector */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => setCurrentMood(mood.id)}
            className={`px-6 py-3 rounded-full whitespace-nowrap ${
              currentMood === mood.id
                ? 'bg-rose-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {mood.name}
          </button>
        ))}
      </div>

      {/* Now Playing */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <img
            src={songs[0].cover}
            alt={songs[0].title}
            className="w-full rounded-lg shadow-xl"
          />
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{songs[0].title}</h2>
              <p className="text-gray-600">{songs[0].artist}</p>
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-center space-x-6">
              <button className="text-gray-600 hover:text-gray-800">
                <SkipBack className="h-8 w-8" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-4 bg-rose-500 text-white rounded-full hover:bg-rose-600"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8" />
                )}
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                <SkipForward className="h-8 w-8" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-full">
                <Heart className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-full">
                <Share2 className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-full">
                <Plus className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Song List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map((song) => (
          <div
            key={song.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img
              src={song.cover}
              alt={song.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-800">{song.title}</h3>
              <p className="text-gray-600">{song.artist}</p>
              <div className="mt-4 flex justify-between items-center">
                <button className="text-rose-500 hover:text-rose-600">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600">
                  <Play className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MusicPage;