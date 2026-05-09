import { useState } from 'react';
import toast from 'react-hot-toast';

const ProfileView = () => {
  const [profile, setProfile] = useState({
    name: 'Andi Pratama',
    email: 'andi@marketpulse.io',
    role: 'Pro Trader',
    bio: 'Trading crypto and forex markets since 2018.',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully!', { icon: '✅' });
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <h2 className="text-xl font-bold mb-6" style={{ color: '#f4f4f5' }}>Profile Settings</h2>
      
      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-6 mb-8">
          <div
            className="flex-shrink-0 rounded-2xl flex items-center justify-center text-2xl font-bold"
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #d4af37, #f59e0b)',
              color: '#09090b',
            }}
          >
            {profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: '#f4f4f5' }}>{profile.name}</h3>
            <p className="text-sm" style={{ color: '#a1a1aa' }}>{profile.role}</p>
            <button className="mt-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
              Change Avatar
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: '#a1a1aa' }}>Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: '#a1a1aa' }}>Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: '#a1a1aa' }}>Role</label>
            <input
              type="text"
              name="role"
              value={profile.role}
              onChange={handleChange}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: '#a1a1aa' }}>Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={4}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{ background: '#3b82f6', color: '#fff' }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileView;
