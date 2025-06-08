import { useEffect, useRef, useState } from 'react';
import { Send, Image as ImageIcon, Smile, Menu } from 'lucide-react';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_Backend_url);

interface Partner {
  _id: string;
  name: string;
  avatar_url: string;
}

interface Message {
  content: string;
  imageUrl?: string;
  sender_id: string;
  created_at: string;
}

interface Connection {
  roomId: string;
  partner: Partner;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [currentPartner, setCurrentPartner] = useState<Connection | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (!id) return console.warn('userId not found');
    setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const register = () => {
      socket.emit('register_user', { userId });
    };

    socket.on('connect', register);
    socket.on('receive_message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    if (socket.connected) register();

    return () => {
      socket.off('connect', register);
      socket.off('receive_message');
    };
  }, [userId]);

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_Backend_url}/user/connections`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          setConnections(data);
          setCurrentPartner(data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch connections:', err);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!currentPartner?.roomId || !userId) return;

    (async () => {
      socket.emit('join_chat', { userId, roomId: currentPartner.roomId });
      try {
        const res = await fetch(
          `${import.meta.env.VITE_Backend_url}/chat/${currentPartner.roomId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    })();
  }, [currentPartner, userId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId || !currentPartner?.roomId) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_Backend_url}/chat/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      const msg: Message = {
        content: '',
        imageUrl: data.imageUrl,
        sender_id: userId,
        created_at: new Date().toISOString(),
      };
      socket.emit('send_message', { roomId: currentPartner.roomId, message: msg });
      setMessages((prev) => [...prev, msg]);
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  const handleDeleteMessage = async (msg: Message) => {
    if (!currentPartner || !userId) return;
    if (!window.confirm('Delete this message?')) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_Backend_url}/chat/message`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: currentPartner.roomId,
          sender_id: userId,
          created_at: msg.created_at,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setMessages((prev) => prev.filter((m) => m.created_at !== msg.created_at));
      }
    } catch (err) {
      console.error('Delete message failed:', err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId || !currentPartner?.roomId) return;

    const msg: Message = {
      content: newMessage,
      sender_id: userId,
      created_at: new Date().toISOString(),
    };
    socket.emit('send_message', { roomId: currentPartner.roomId, message: msg });
    setMessages((prev) => [...prev, msg]);
    setNewMessage('');
  };

  if (!connections.length) {
    return <div className='p-6 text-center text-gray-500'>No partner connections found</div>;
  }

  return (
    <div className='h-screen flex flex-col sm:flex-row min-h-screen min-w-full'>
      {/* Mobile Header */}
      <div className='sm:hidden flex justify-between items-center p-4 border-b bg-white'>
        <h2 className='text-lg font-bold'>Chat</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className='h-6 w-6' />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } sm:block w-full sm:w-64 bg-white border-r border-gray-200 absolute sm:relative z-20 h-full`}
      >
        <nav className='p-4 h-full overflow-y-auto'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4'>Partners</h2>
          <ul className='space-y-2'>
            {connections.map((conn) => (
              <li key={conn.partner._id}>
                <button
                  onClick={() => {
                    setCurrentPartner(conn);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center space-x-2 w-full p-2 rounded-lg text-left ${
                    currentPartner?.partner._id === conn.partner._id
                      ? 'bg-rose-100'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <img
                    src={
                      conn.partner.avatar_url ||
                      `https://ui-avatars.com/api/?name=${conn.partner.name}`
                    }
                    alt={conn.partner.name}
                    className='w-10 h-10 rounded-full'
                  />
                  <span className='font-medium'>{conn.partner.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Chat Window */}
      <div className='flex-1 flex flex-col bg-white min-h-0'>
        {currentPartner ? (
          <>
            {/* Header */}
            <header className='p-4 border-b border-gray-200 flex items-center space-x-4 shrink-0'>
              <img
                src={
                  currentPartner.partner.avatar_url ||
                  `https://ui-avatars.com/api/?name=${currentPartner.partner.name}`
                }
                alt={currentPartner.partner.name}
                className='w-10 h-10 rounded-full'
              />
              <div>
                <h2 className='font-semibold text-gray-800'>{currentPartner.partner.name}</h2>
                <p className='text-sm text-gray-500'>Online</p>
              </div>
            </header>

            {/* Messages */}
            <main className='flex-1 overflow-y-auto p-4 space-y-4 min-h-0'>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div className='relative group'>
                    <div
                      className={`max-w-[70%] p-4 rounded-2xl ${
                        msg.sender_id === userId
                          ? 'bg-rose-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {msg.imageUrl && (
                        <img src={msg.imageUrl} alt='sent' className='rounded-lg max-w-xs mb-2' />
                      )}
                      {msg.content && <p>{msg.content}</p>}
                      <p className='text-xs mt-1 text-gray-300'>
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    {msg.sender_id === userId && (
                      <button
                        onClick={() => handleDeleteMessage(msg)}
                        className='absolute -top-2 -right-2 bg-white border p-1 rounded-full shadow hidden group-hover:block'
                      >
                        ❌
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </main>

            {/* Input */}
            <div className=''>
              <form onSubmit={handleSendMessage} className='p-4 border-t border-gray-200 shrink-0'>
                <div className='flex items-center space-x-4'>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload}
                    className='hidden'
                    id='imageInput'
                  />
                  <label htmlFor='imageInput' className='p-2 text-gray-500 cursor-pointer'>
                    <ImageIcon className='h-6 w-6' />
                  </label>
                  <button type='button' className='p-2 text-gray-500'>
                    <Smile className='h-6 w-6' />
                  </button>
                  <input
                    type='text'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder='Type a message...'
                    className='flex-1 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500'
                  />
                  <button type='submit' className='p-3 bg-rose-500 text-white rounded-full'>
                    <Send className='h-5 w-5' />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className='flex-1 flex items-center justify-center text-gray-500'>
            Select a partner to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
