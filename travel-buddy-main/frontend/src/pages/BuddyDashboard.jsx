import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { buddyAPI, bookingAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Calendar } from '../components/ui/calendar';
import { Checkbox } from '../components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  User,
  Globe,
  Briefcase,
  FileText,
  Calendar as CalendarIcon,
  DollarSign,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Upload,
  AlertCircle,
  MapPin,
  Plane
} from 'lucide-react';

const languages = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 
  'Korean', 'Arabic', 'Hindi', 'Portuguese', 'Russian', 'Italian'
];

const statusColors = {
  requested: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  cancelled: 'bg-slate-100 text-slate-800',
  completed: 'bg-blue-100 text-blue-800'
};

export default function BuddyDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [selectedDates, setSelectedDates] = useState([]);
  const [showDocModal, setShowDocModal] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    experience_years: 0,
    languages: [],
    bio: '',
    hourly_rate: 0
  });

  useEffect(() => {
    if (user?.role !== 'buddy') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [profileRes, bookingsRes, docsRes] = await Promise.all([
        buddyAPI.getMyProfile(),
        bookingAPI.getMyBookings(),
        buddyAPI.getMyDocuments()
      ]);
      
      setProfile(profileRes.data);
      setBookings(bookingsRes.data);
      setDocuments(docsRes.data);
      
      setProfileForm({
        experience_years: profileRes.data.experience_years || 0,
        languages: profileRes.data.languages || [],
        bio: profileRes.data.bio || '',
        hourly_rate: profileRes.data.hourly_rate || 0
      });
      
      setSelectedDates(
        (profileRes.data.availability || []).map(d => new Date(d))
      );
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await buddyAPI.updateProfile(profileForm);
      toast.success('Profile updated!');
      fetchData();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleLanguage = (lang) => {
    const updated = profileForm.languages.includes(lang)
      ? profileForm.languages.filter(l => l !== lang)
      : [...profileForm.languages, lang];
    setProfileForm({ ...profileForm, languages: updated });
  };

  const handleSaveAvailability = async () => {
    setSaving(true);
    try {
      const dates = selectedDates.map(d => format(d, 'yyyy-MM-dd'));
      await buddyAPI.updateAvailability({ availability: dates });
      toast.success('Availability updated!');
    } catch (error) {
      toast.error('Failed to update availability');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadDocument = async (e, docType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', docType);
      
      await buddyAPI.uploadDocument(formData);
      toast.success('Document uploaded!');
      setShowDocModal(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleBookingAction = async (bookingId, status) => {
    try {
      await bookingAPI.updateStatus(bookingId, status);
      toast.success(`Booking ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update booking');
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'requested');
  const activeBookings = bookings.filter(b => b.status === 'accepted');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  if (!user || user.role !== 'buddy') return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="buddy-dashboard">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-heading font-bold text-primary-600">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading text-2xl font-bold capitalize">
                    {user.email.split('@')[0]}
                  </h1>
                  <Badge className={profile?.status === 'verified' ? 'bg-accent text-white' : 'bg-yellow-100 text-yellow-800'}>
                    {profile?.status === 'verified' ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 mr-1" />
                        {profile?.status || 'Pending'}
                      </>
                    )}
                  </Badge>
                </div>
                <p className="text-slate-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {profile?.rating_avg > 0 && (
                <div className="flex items-center gap-1 bg-secondary-100 px-3 py-1.5 rounded-full">
                  <Star className="w-4 h-4 text-secondary-500 fill-secondary-500" />
                  <span className="font-semibold text-secondary-700">{profile.rating_avg.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 max-w-7xl py-8">
        {/* Verification Warning */}
        {profile?.status === 'pending' && (
          <Card className="bg-yellow-50 border-yellow-200 mb-6">
            <CardContent className="py-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Profile Pending Verification</p>
                <p className="text-sm text-yellow-700">
                  Upload your documents to get verified. Verified buddies appear in search results.
                </p>
                <Button
                  size="sm"
                  className="mt-2 bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => setShowDocModal(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white rounded-xl border border-slate-100">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-heading font-bold text-primary-600">{bookings.length}</p>
              <p className="text-sm text-slate-500">Total Bookings</p>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-xl border border-slate-100">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-heading font-bold text-yellow-600">{pendingBookings.length}</p>
              <p className="text-sm text-slate-500">Pending</p>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-xl border border-slate-100">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-heading font-bold text-green-600">{activeBookings.length}</p>
              <p className="text-sm text-slate-500">Upcoming</p>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-xl border border-slate-100">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-heading font-bold text-blue-600">{completedBookings.length}</p>
              <p className="text-sm text-slate-500">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bookings">
          <TabsList className="mb-6">
            <TabsTrigger value="bookings" data-testid="bookings-tab">
              Bookings {pendingBookings.length > 0 && `(${pendingBookings.length})`}
            </TabsTrigger>
            <TabsTrigger value="profile" data-testid="profile-tab">Profile</TabsTrigger>
            <TabsTrigger value="availability" data-testid="availability-tab">Availability</TabsTrigger>
            <TabsTrigger value="documents" data-testid="documents-tab">Documents</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="bg-white rounded-2xl border border-slate-100 card-shadow">
              <CardHeader>
                <CardTitle className="font-heading text-xl">Booking Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <h3 className="font-heading font-semibold mb-2">No Bookings Yet</h3>
                    <p className="text-slate-500">Complete your profile to start receiving bookings.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div 
                        key={booking.id}
                        className="border border-slate-100 rounded-xl p-4"
                        data-testid={`booking-${booking.id}`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-600">
                              {booking.traveler?.email?.charAt(0).toUpperCase() || 'T'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold capitalize">
                                  {booking.traveler?.email?.split('@')[0] || 'Traveler'}
                                </h4>
                                <Badge className={statusColors[booking.status]}>
                                  {booking.status}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                  <CalendarIcon className="w-4 h-4" />
                                  {format(new Date(booking.travel_date), 'MMM d, yyyy')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {booking.departure_airport}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Plane className="w-4 h-4" />
                                  {booking.arrival_airport}
                                </span>
                              </div>
                              {booking.notes && (
                                <p className="text-sm text-slate-500 mt-2">
                                  Notes: {booking.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {booking.status === 'requested' && (
                            <div className="flex items-center gap-2 ml-16 md:ml-0">
                              <Button
                                size="sm"
                                onClick={() => handleBookingAction(booking.id, 'accepted')}
                                className="bg-green-600 hover:bg-green-700"
                                data-testid={`accept-${booking.id}`}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleBookingAction(booking.id, 'declined')}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                data-testid={`decline-${booking.id}`}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Decline
                              </Button>
                            </div>
                          )}
                          
                          {booking.status === 'accepted' && (
                            <Button
                              size="sm"
                              onClick={() => handleBookingAction(booking.id, 'completed')}
                              className="bg-blue-600 hover:bg-blue-700 ml-16 md:ml-0"
                              data-testid={`complete-${booking.id}`}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-white rounded-2xl border border-slate-100 card-shadow">
              <CardHeader>
                <CardTitle className="font-heading text-xl">Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Bio</Label>
                  <Textarea
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    placeholder="Tell travelers about yourself..."
                    className="mt-1"
                    rows={4}
                    data-testid="profile-bio"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Years of Experience</Label>
                    <Input
                      type="number"
                      min="0"
                      value={profileForm.experience_years}
                      onChange={(e) => setProfileForm({ ...profileForm, experience_years: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                      data-testid="profile-experience"
                    />
                  </div>
                  <div>
                    <Label>Hourly Rate ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={profileForm.hourly_rate}
                      onChange={(e) => setProfileForm({ ...profileForm, hourly_rate: parseFloat(e.target.value) || 0 })}
                      className="mt-1"
                      data-testid="profile-rate"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="mb-3 block">Languages</Label>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <label
                        key={lang}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                          profileForm.languages.includes(lang)
                            ? 'bg-primary-100 border-primary-300 text-primary-700'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Checkbox
                          checked={profileForm.languages.includes(lang)}
                          onCheckedChange={() => handleToggleLanguage(lang)}
                        />
                        <span className="text-sm">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-primary-600 hover:bg-primary-700"
                  data-testid="save-profile-btn"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability">
            <Card className="bg-white rounded-2xl border border-slate-100 card-shadow">
              <CardHeader>
                <CardTitle className="font-heading text-xl">Set Your Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 mb-6">
                  Select the dates you're available to help travelers.
                </p>
                <div className="flex justify-center mb-6">
                  <Calendar
                    mode="multiple"
                    selected={selectedDates}
                    onSelect={setSelectedDates}
                    className="rounded-md border"
                    data-testid="availability-calendar"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-500 mb-4">
                    {selectedDates.length} dates selected
                  </p>
                  <Button
                    onClick={handleSaveAvailability}
                    disabled={saving}
                    className="bg-primary-600 hover:bg-primary-700"
                    data-testid="save-availability-btn"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save Availability
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className="bg-white rounded-2xl border border-slate-100 card-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-xl">My Documents</CardTitle>
                <Button
                  onClick={() => setShowDocModal(true)}
                  className="bg-primary-600 hover:bg-primary-700"
                  data-testid="upload-doc-btn"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <h3 className="font-heading font-semibold mb-2">No Documents</h3>
                    <p className="text-slate-500 mb-4">
                      Upload your ID and other documents for verification.
                    </p>
                    <Button
                      onClick={() => setShowDocModal(true)}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      Upload Documents
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div 
                        key={doc.id}
                        className="flex items-center justify-between p-4 border border-slate-100 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="font-medium capitalize">{doc.document_type}</p>
                            <p className="text-sm text-slate-500">
                              Uploaded {format(new Date(doc.created_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <Badge className={
                          doc.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : doc.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }>
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Document Upload Modal */}
      <Dialog open={showDocModal} onOpenChange={setShowDocModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Upload Document</DialogTitle>
            <DialogDescription>
              Upload your ID or other verification documents.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label className="mb-2 block">Government ID</Label>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleUploadDocument(e, 'government_id')}
                disabled={uploadingDoc}
                data-testid="upload-id-input"
              />
            </div>
            <div>
              <Label className="mb-2 block">Proof of Address</Label>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleUploadDocument(e, 'proof_of_address')}
                disabled={uploadingDoc}
                data-testid="upload-address-input"
              />
            </div>
            <div>
              <Label className="mb-2 block">Other Document</Label>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleUploadDocument(e, 'other')}
                disabled={uploadingDoc}
                data-testid="upload-other-input"
              />
            </div>
          </div>

          {uploadingDoc && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
              <span className="ml-2 text-sm text-slate-500">Uploading...</span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
