import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import MusicPage from './pages/MusicPage';
import GiftsPage from './pages/GiftsPage';
import EventsPage from './pages/EventsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminEventplacePage from './pages/admin/AdminEventplacePage';
import OrdersPage from './pages/admin/OrdersPage';
import ConnectPage from './pages/ConnectPage';
import AddPartnerPage from './pages/partner/AddPartnerPage';
import Dashboard from './pages/admin/Dashboard';
import CreateEventsPage from './pages/CreateEventPage';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage setUser={setUser} />} />
      <Route path="/partner"element={<Layout><AddPartnerPage /></Layout>} />
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/chat" element={<Layout><ChatPage /></Layout>} />
      <Route path="/music" element={<Layout><MusicPage /></Layout>} />
      <Route path="/gifts" element={<Layout><GiftsPage /></Layout>} />
      <Route path="/events" element={<Layout><EventsPage /></Layout>} />
      <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
      <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
      <Route path="/connect" element={<Layout><ConnectPage /></Layout>} />
      <Route path="/events/create" element={<Layout><CreateEventsPage /></Layout>} />
      <Route path="/connect/:inviteId" element={<Layout><ConnectPage /></Layout>} />
        <Route path="/events/create/:eventPlaceId" element={<CreateEventsPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<Layout><Dashboard /></Layout>} />
      <Route path="/admin/eventplace" element={<Layout><AdminEventplacePage /></Layout>} />
      <Route path="/admin/orders" element={<Layout><OrdersPage /></Layout>} />
    </Routes>
  );
}

export default App;