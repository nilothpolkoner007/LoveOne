import { useState } from 'react';
import { Bell, Lock, User, Globe, Heart, Moon, Sun, Smartphone } from 'lucide-react';

function SettingsPage() {
  const [notifications, setNotifications] = useState({
    messages: true,
    events: true,
    gifts: true,
    milestones: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    showLocation: false,
    showMilestones: true
  });

  const [theme, setTheme] = useState('light');

  return (
    <div className="space-y-8">
      {/* Profile Settings */}
      <SettingsSection
        icon={<User className="h-6 w-6 text-rose-500" />}
        title="Profile Settings"
      >
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-50">
            <span className="font-medium text-gray-800">Edit Profile Information</span>
            <Heart className="h-5 w-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-50">
            <span className="font-medium text-gray-800">Change Profile Picture</span>
            <Heart className="h-5 w-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-50">
            <span className="font-medium text-gray-800">Update Relationship Status</span>
            <Heart className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection
        icon={<Bell className="h-6 w-6 text-rose-500" />}
        title="Notifications"
      >
        <div className="space-y-4">
          <ToggleSetting
            label="Message Notifications"
            description="Get notified when your partner sends you a message"
            checked={notifications.messages}
            onChange={(checked) => setNotifications({ ...notifications, messages: checked })}
          />
          <ToggleSetting
            label="Event Reminders"
            description="Receive reminders for upcoming events and dates"
            checked={notifications.events}
            onChange={(checked) => setNotifications({ ...notifications, events: checked })}
          />
          <ToggleSetting
            label="Gift Suggestions"
            description="Get personalized gift recommendations"
            checked={notifications.gifts}
            onChange={(checked) => setNotifications({ ...notifications, gifts: checked })}
          />
          <ToggleSetting
            label="Milestone Alerts"
            description="Be notified of relationship milestones"
            checked={notifications.milestones}
            onChange={(checked) => setNotifications({ ...notifications, milestones: checked })}
          />
        </div>
      </SettingsSection>

      {/* Privacy */}
      <SettingsSection
        icon={<Lock className="h-6 w-6 text-rose-500" />}
        title="Privacy"
      >
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg">
            <label className="block text-sm font-medium text-gray-800">Profile Visibility</label>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
              className="mt-2 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
              <option value="public">Public</option>
            </select>
          </div>
          <ToggleSetting
            label="Show Location"
            description="Allow others to see your location"
            checked={privacy.showLocation}
            onChange={(checked) => setPrivacy({ ...privacy, showLocation: checked })}
          />
          <ToggleSetting
            label="Show Milestones"
            description="Display relationship milestones on your profile"
            checked={privacy.showMilestones}
            onChange={(checked) => setPrivacy({ ...privacy, showMilestones: checked })}
          />
        </div>
      </SettingsSection>

      {/* Appearance */}
      <SettingsSection
        icon={theme === 'light' ? <Sun className="h-6 w-6 text-rose-500" /> : <Moon className="h-6 w-6 text-rose-500" />}
        title="Appearance"
      >
        <div className="p-4 bg-white rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">Theme</h3>
              <p className="text-sm text-gray-600">Choose your preferred theme</p>
            </div>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </SettingsSection>

      {/* Device Settings */}
      <SettingsSection
        icon={<Smartphone className="h-6 w-6 text-rose-500" />}
        title="Device Settings"
      >
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-50">
            <div>
              <h3 className="font-medium text-gray-800">Manage Devices</h3>
              <p className="text-sm text-gray-600">View and control connected devices</p>
            </div>
            <Heart className="h-5 w-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-50 text-red-500">
            <span className="font-medium">Sign Out from All Devices</span>
            <Heart className="h-5 w-5" />
          </button>
        </div>
      </SettingsSection>
    </div>
  );
}

function SettingsSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        {icon}
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function ToggleSetting({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg">
      <div>
        <h3 className="font-medium text-gray-800">{label}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
      </label>
    </div>
  );
}

export default SettingsPage;