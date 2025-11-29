import { useState, useEffect } from 'react';
import DashboardLayout from '../../DashboardLayout';
import { User } from '../../../types';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Edit2, Save, X, User as UserIcon, Mail, Phone, Calendar, MapPin, Lock, Shield, Award } from 'lucide-react';
import authService from '../../../services/authService';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Profile state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('CTRL-2020-MA-00123');
  const [zone, setZone] = useState('Zone A - Downtown');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Original values for cancel
  const [originalData, setOriginalData] = useState<any>({});

  // Current user for layout
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetchProfile();
    
    // Get user info from storage
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser({
        id: user.id,
        name: `${firstName} ${lastName}` || user.email,
        email: user.email,
        role: 'controller'
      });
    }
  }, [firstName, lastName]);

  const fetchProfile = async () => {
    try {
      setFetchLoading(true);
      const profile = await authService.getProfile();
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setEmail(profile.email || '');
      setMobile(profile.mobile || '');
      setDateOfBirth(profile.dateOfBirth || '');
      setGender(profile.gender || '');
      setAddress(profile.address || '');
      setOriginalData(profile);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    setError('');
    
    try {
      // Update profile
      await authService.updateProfile({
        firstName,
        lastName,
        mobile,
        dateOfBirth,
        gender,
        address,
      });

      // Update password if provided
      if (currentPassword && newPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error('New passwords do not match');
        }
        await authService.changePassword({
          currentPassword,
          newPassword,
        });
      }

      setSuccess(true);
      setIsEditing(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Refresh profile data
      await fetchProfile();
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setFirstName(originalData.firstName || '');
    setLastName(originalData.lastName || '');
    setEmail(originalData.email || '');
    setMobile(originalData.mobile || '');
    setDateOfBirth(originalData.dateOfBirth || '');
    setGender(originalData.gender || '');
    setAddress(originalData.address || '');
    setBadgeNumber('CTRL-2020-MA-00123');
    setZone('Zone A - Downtown');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setIsEditing(false);
  };

  if (fetchLoading) {
    return (
      <DashboardLayout user={currentUser || { id: "", name: "Controller", email: "", role: "controller" }} notificationCount={0}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9B392D] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={currentUser || { id: "", name: `${firstName} ${lastName}`, email, role: "controller" }} notificationCount={0}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">My Profile</h3>
            <p className="text-sm text-gray-600 mt-1">Manage your personal information</p>
          </div>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-[#9B392D] to-[#7d2e24] text-white hover:from-[#7d2e24] hover:to-[#5d1f1a] shadow-lg"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-green-900">Profile updated successfully!</p>
              <p className="text-sm text-green-700">Your changes have been saved.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-[#9B392D]/20 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-2 bg-gradient-to-r from-[#9B392D] via-[#7d2e24] to-[#9B392D]"></div>

          <div className="p-8">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b-2 border-gray-100">
              <div className="relative">
                <div className="w-28 h-28 bg-gradient-to-br from-[#9B392D] via-[#7d2e24] to-[#5d1f1a] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl border-4 border-white">
                  {firstName.charAt(0)}{lastName.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-3xl font-bold text-gray-900 mb-1">{firstName} {lastName}</h4>
                <p className="text-gray-600 mb-2">{email}</p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="px-3 py-1 bg-gradient-to-r from-[#9B392D] to-[#7d2e24] text-white text-xs font-semibold rounded-full">
                    Controller
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Active Account
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {badgeNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Section */}
              <div className="md:col-span-2">
                <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-[#9B392D]" />
                  Personal Information
                </h5>
              </div>

              <div>
                <Label htmlFor="firstName" className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-[#9B392D]" />
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isEditing}
                  className={`h-12 rounded-xl border-2 ${
                    isEditing 
                      ? 'border-[#9B392D]/30 focus:border-[#9B392D] focus:ring-2 focus:ring-[#9B392D]/20' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                />
              </div>

              <div>
                <Label htmlFor="lastName" className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-[#9B392D]" />
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditing}
                  className={`h-12 rounded-xl border-2 ${
                    isEditing 
                      ? 'border-[#9B392D]/30 focus:border-[#9B392D] focus:ring-2 focus:ring-[#9B392D]/20' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#9B392D]" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className={`h-12 rounded-xl border-2 ${
                    isEditing 
                      ? 'border-[#9B392D]/30 focus:border-[#9B392D] focus:ring-2 focus:ring-[#9B392D]/20' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                />
              </div>

              <div>
                <Label htmlFor="mobile" className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#9B392D]" />
                  Mobile Number
                </Label>
                <Input
                  id="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={!isEditing}
                  className={`h-12 rounded-xl border-2 ${
                    isEditing 
                      ? 'border-[#9B392D]/30 focus:border-[#9B392D] focus:ring-2 focus:ring-[#9B392D]/20' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth" className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#9B392D]" />
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  disabled={!isEditing}
                  className={`h-12 rounded-xl border-2 ${
                    isEditing 
                      ? 'border-[#9B392D]/30 focus:border-[#9B392D] focus:ring-2 focus:ring-[#9B392D]/20' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                />
              </div>

              <div>
                <Label htmlFor="gender" className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-[#9B392D]" />
                  Gender
                </Label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  disabled={!isEditing}
                  className={`h-12 w-full px-4 rounded-xl border-2 appearance-none ${
                    isEditing 
                      ? 'border-[#9B392D]/30 focus:border-[#9B392D] focus:ring-2 focus:ring-[#9B392D]/20 bg-white' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#9B392D]" />
                  Address
                </Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={!isEditing}
                  className={`h-12 rounded-xl border-2 ${
                    isEditing 
                      ? 'border-[#9B392D]/30 focus:border-[#9B392D] focus:ring-2 focus:ring-[#9B392D]/20' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                />
              </div>

              {/* Controller Specific Information */}
              <div className="md:col-span-2 mt-6 pt-6 border-t-2 border-gray-100">
                <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#9B392D]" />
                  Controller Information
                </h5>
              </div>

              <div>
                <Label htmlFor="badgeNumber" className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#9B392D]" />
                  Badge Number
                </Label>
                <Input
                  id="badgeNumber"
                  value={badgeNumber}
                  disabled={true}
                  className="h-12 rounded-xl border-2 border-gray-200 bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Badge number cannot be changed</p>
              </div>

              <div>
                <Label htmlFor="zone" className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#9B392D]" />
                  Assigned Zone
                </Label>
                <Input
                  id="zone"
                  value={zone}
                  disabled={true}
                  className="h-12 rounded-xl border-2 border-gray-200 bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Contact admin to change zone assignment</p>
              </div>

              {/* Password Section - Only show when editing */}
              {isEditing && (
                <>
                  <div className="md:col-span-2 mt-6 pt-6 border-t-2 border-gray-100">
                    <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-[#9B392D]" />
                      Change Password (Optional)
                    </h5>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="currentPassword" className="text-gray-700 font-semibold mb-2">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="h-12 rounded-xl border-2 border-[#9B392D]/30 focus:border-[#9B392D] focus:ring-2 focus:ring-[#9B392D]/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPassword" className="text-gray-700 font-semibold mb-2">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="h-12 rounded-xl border-2 border-[#9B392D]/30 focus:border-[#9B392D] focus:ring-2 focus:ring-[#9B392D]/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold mb-2">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="h-12 rounded-xl border-2 border-[#9B392D]/30 focus:border-[#9B392D] focus:ring-2 focus:ring-[#9B392D]/20"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Account Info Card */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md border border-gray-200 p-6">
          <h5 className="text-lg font-bold text-gray-900 mb-4">Account Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border-l-4 border-[#9B392D]">
              <p className="text-sm text-gray-600 mb-1">Joined</p>
              <p className="text-lg font-bold text-gray-900">August 2020</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-600">
              <p className="text-sm text-gray-600 mb-1">Validations</p>
              <p className="text-lg font-bold text-gray-900">3,892 checks</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-green-600">
              <p className="text-sm text-gray-600 mb-1">Efficiency</p>
              <p className="text-lg font-bold text-green-600">98.5%</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
