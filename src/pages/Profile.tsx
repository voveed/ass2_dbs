import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Upload, User, Save, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { toast } from 'sonner@2.0.3';
import { getSession, uploadAvatar, updateProfile, getPreferenceTags } from '../utils/api';

export default function Profile() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [nationality, setNationality] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [availablePreferences, setAvailablePreferences] = useState<string[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
    loadPreferences();
  }, []);

  const loadUserData = async () => {
    try {
      const session = await getSession();
      if (!session?.user) {
        setLocation('/auth');
        return;
      }
      setUser(session.user);
      setFullName(session.user.fullName || '');
      setCity(session.user.city || '');
      setDistrict(session.user.district || '');
      setNationality(session.user.nationality || '');
      setSelectedPreferences(session.user.preferences || []);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadPreferences = async () => {
    try {
      const prefs = await getPreferenceTags();
      setAvailablePreferences(prefs);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;

    setUploading(true);
    try {
      const result = await uploadAvatar(avatarFile);
      toast.success('Avatar updated successfully!');
      setUser({ ...user, avatar: result.avatarUrl });
      setAvatarFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updates: any = {
        fullName,
        city,
        district,
      };

      if (user.role === 'tourist') {
        updates.nationality = nationality;
        updates.preferences = selectedPreferences;
      }

      await updateProfile(updates);
      toast.success('Profile updated successfully!');
      await loadUserData();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const togglePreference = (pref: string) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences(selectedPreferences.filter(p => p !== pref));
    } else {
      if (selectedPreferences.length >= 10) {
        toast.error('You can select up to 10 preferences');
        return;
      }
      setSelectedPreferences([...selectedPreferences, pref]);
    }
  };

  const cancelAvatarChange = () => {
    setAvatarFile(null);
    setPreviewUrl(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-[#00E5FF]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      {/* Header */}
      <div className="border-b border-[#00E5FF]/20 bg-[#1A1B1E]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/dashboard')}
              className="text-[#00E5FF] hover:text-[#00FFC6] hover:bg-[#00E5FF]/10"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <h1 className="text-[#00E5FF] neon-text">My Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Avatar Section */}
        <Card className="p-6 mb-6 bg-[#1A1B1E] border-[#00E5FF]/30">
          <h2 className="text-[#00E5FF] mb-4">Profile Picture</h2>
          <div className="flex items-start gap-6">
            <Avatar className="w-32 h-32 border-2 border-[#00E5FF]/50">
              <AvatarImage src={previewUrl || user?.avatar || ''} />
              <AvatarFallback className="bg-[#00E5FF]/20 text-[#00E5FF]">
                <User className="w-16 h-16" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <Label htmlFor="avatar" className="text-white/80 mb-2 block">
                Upload New Avatar
              </Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="bg-[#0A0A0B] border-[#00E5FF]/30 text-white mb-3"
              />
              {avatarFile && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleUploadAvatar}
                    disabled={uploading}
                    className="bg-[#00E5FF] text-black hover:bg-[#00FFC6]"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                  <Button
                    onClick={cancelAvatarChange}
                    variant="outline"
                    className="border-[#FF1744] text-[#FF1744] hover:bg-[#FF1744]/10"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
              <p className="text-white/50 mt-2">
                Max size: 5MB. Formats: JPG, PNG, GIF
              </p>
            </div>
          </div>
        </Card>

        {/* Profile Information */}
        <Card className="p-6 mb-6 bg-[#1A1B1E] border-[#00E5FF]/30">
          <h2 className="text-[#00E5FF] mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white/80">Email</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-[#0A0A0B]/50 border-[#00E5FF]/20 text-white/50"
              />
            </div>

            <div>
              <Label htmlFor="fullName" className="text-white/80">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-[#0A0A0B] border-[#00E5FF]/30 text-white"
              />
            </div>

            <div>
              <Label htmlFor="role" className="text-white/80">Role</Label>
              <Input
                id="role"
                value={user?.role?.replace('_', ' ').toUpperCase() || ''}
                disabled
                className="bg-[#0A0A0B]/50 border-[#00E5FF]/20 text-white/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-white/80">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-[#0A0A0B] border-[#00E5FF]/30 text-white"
                />
              </div>

              <div>
                <Label htmlFor="district" className="text-white/80">District</Label>
                <Input
                  id="district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="bg-[#0A0A0B] border-[#00E5FF]/30 text-white"
                />
              </div>
            </div>

            {user?.role === 'tourist' && (
              <div>
                <Label htmlFor="nationality" className="text-white/80">Nationality</Label>
                <Input
                  id="nationality"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="bg-[#0A0A0B] border-[#00E5FF]/30 text-white"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Preferences (for tourists only) */}
        {user?.role === 'tourist' && (
          <Card className="p-6 mb-6 bg-[#1A1B1E] border-[#00E5FF]/30">
            <h2 className="text-[#00E5FF] mb-2">Travel Preferences</h2>
            <p className="text-white/60 mb-4">
              Select up to 10 preferences to help us recommend locations you'll love. 
              These will update automatically based on your bookings every 30 days.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {availablePreferences.map((pref) => (
                <Badge
                  key={pref}
                  onClick={() => togglePreference(pref)}
                  className={`cursor-pointer transition-all ${
                    selectedPreferences.includes(pref)
                      ? 'bg-[#00E5FF] text-black hover:bg-[#00FFC6] border-[#00E5FF]'
                      : 'bg-[#0A0A0B] text-white/70 hover:bg-[#00E5FF]/20 border-[#00E5FF]/30'
                  } border`}
                >
                  {pref}
                </Badge>
              ))}
            </div>
            <p className="text-white/50">
              Selected: {selectedPreferences.length}/10
            </p>
            {user.lastPreferenceUpdate && (
              <p className="text-white/40 mt-2">
                Last auto-update: {new Date(user.lastPreferenceUpdate).toLocaleDateString()}
              </p>
            )}
          </Card>
        )}

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => setLocation('/dashboard')}
            variant="outline"
            className="border-[#00E5FF]/30 text-white hover:bg-[#00E5FF]/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveProfile}
            disabled={saving}
            className="bg-[#00E5FF] text-black hover:bg-[#00FFC6]"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
