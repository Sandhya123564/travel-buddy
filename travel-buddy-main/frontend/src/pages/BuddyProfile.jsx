import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buddyAPI, reviewAPI, bookingAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Star,
  CheckCircle,
  Globe,
  Briefcase,
  MapPin,
  Calendar as CalendarIcon,
  Plane,
  ArrowLeft,
  Loader2,
  MessageSquare,
  Clock
} from 'lucide-react';

export default function BuddyProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [buddy, setBuddy] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const [bookingData, setBookingData] = useState({
    travel_date: '',
    departure_airport: '',
    arrival_airport: '',
    flight_number: '',
    notes: ''
  });
  const [bookingDate, setBookingDate] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [buddyRes, reviewsRes] = await Promise.all([
          buddyAPI.getById(id),
          reviewAPI.getByBuddy(id)
        ]);
        setBuddy(buddyRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error('Failed to fetch buddy:', error);
        toast.error('Failed to load buddy profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book a buddy');
      navigate('/login');
      return;
    }

    if (!bookingData.travel_date || !bookingData.departure_airport || !bookingData.arrival_airport) {
      toast.error('Please fill in all required fields');
      return;
    }

    setBookingLoading(true);
    try {
      await bookingAPI.create({
        buddy_id: id,
        travel_date: bookingData.travel_date,
        departure_airport: bookingData.departure_airport,
        arrival_airport: bookingData.arrival_airport,
        flight_number: bookingData.flight_number,
        notes: bookingData.notes,
        price: buddy?.hourly_rate || 0
      });
      
      toast.success('Booking request sent!');
      setShowBookingModal(false);
      navigate('/traveler/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setBookingDate(date);
    if (date) {
      setBookingData({ ...bookingData, travel_date: format(date, 'yyyy-MM-dd') });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!buddy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
          <h3 className="font-heading font-semibold text-lg mb-2">Buddy Not Found</h3>
          <p className="text-slate-500 mb-4">This buddy profile doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/search')}>Back to Search</Button>
        </Card>
      </div>
    );
  }

  const displayName = buddy.user?.email?.split('@')[0] || 'Travel Buddy';

  return (
    <div className="min-h-screen bg-slate-50 py-8" data-testid="buddy-profile-page">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
          data-testid="back-btn"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white rounded-2xl border border-slate-100 card-shadow sticky top-24">
              <CardContent className="p-6">
                {/* Avatar */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center mx-auto text-4xl font-heading font-bold text-primary-600">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  {buddy.status === 'verified' && (
                    <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-2">
                      <Badge className="bg-accent text-white border-0 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Name & Email */}
                <div className="text-center mb-6">
                  <h1 className="font-heading text-2xl font-bold capitalize mb-1">
                    {displayName}
                  </h1>
                  {buddy.user?.email && (
                    <p className="text-sm text-slate-500">{buddy.user.email}</p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-secondary-500 fill-secondary-500" />
                      <span className="font-heading font-bold">{buddy.rating_avg?.toFixed(1) || '0.0'}</span>
                    </div>
                    <p className="text-xs text-slate-500">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="font-heading font-bold mb-1">{buddy.completed_journeys || 0}</p>
                    <p className="text-xs text-slate-500">Trips</p>
                  </div>
                  <div className="text-center">
                    <p className="font-heading font-bold mb-1">{buddy.total_reviews || 0}</p>
                    <p className="text-xs text-slate-500">Reviews</p>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="space-y-3 mb-6">
                  {buddy.experience_years > 0 && (
                    <div className="flex items-center gap-3 text-sm">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      <span>{buddy.experience_years}+ years experience</span>
                    </div>
                  )}
                  {buddy.languages?.length > 0 && (
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <span>{buddy.languages.join(', ')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>${buddy.hourly_rate || 0}/hour</span>
                  </div>
                </div>

                {/* Book Button */}
                {user?.role !== 'buddy' && user?.role !== 'admin' && (
                  <Button
                    className="w-full bg-primary-600 hover:bg-primary-700 rounded-full h-12 btn-primary-shadow"
                    onClick={() => setShowBookingModal(true)}
                    data-testid="book-buddy-btn"
                  >
                    Book This Buddy
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card className="bg-white rounded-2xl border border-slate-100 card-shadow">
              <CardHeader>
                <CardTitle className="font-heading text-lg">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  {buddy.bio || `Hi! I'm ${displayName} and I love helping travelers have a smooth journey. Whether you're a first-time flyer or just need some company, I'm here to help!`}
                </p>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="bg-white rounded-2xl border border-slate-100 card-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-lg">
                  Reviews ({reviews.length})
                </CardTitle>
                {buddy.rating_avg > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-secondary-500 fill-secondary-500" />
                    <span className="font-heading font-bold">{buddy.rating_avg.toFixed(1)}</span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-600">
                            {review.traveler?.email?.charAt(0).toUpperCase() || 'T'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-sm">
                                {review.traveler?.email?.split('@')[0] || 'Traveler'}
                              </p>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${
                                      i < review.rating 
                                        ? 'text-secondary-500 fill-secondary-500' 
                                        : 'text-slate-200'
                                    }`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-slate-600">{review.comment || 'Great experience!'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500">No reviews yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Book {displayName}</DialogTitle>
            <DialogDescription>
              Fill in your travel details to send a booking request.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>Travel Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-12 mt-1"
                    data-testid="booking-date-picker"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bookingDate ? format(bookingDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={bookingDate}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>From Airport *</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="JFK"
                    value={bookingData.departure_airport}
                    onChange={(e) => setBookingData({ ...bookingData, departure_airport: e.target.value })}
                    className="pl-10"
                    data-testid="booking-departure"
                  />
                </div>
              </div>
              <div>
                <Label>To Airport *</Label>
                <div className="relative mt-1">
                  <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="LAX"
                    value={bookingData.arrival_airport}
                    onChange={(e) => setBookingData({ ...bookingData, arrival_airport: e.target.value })}
                    className="pl-10"
                    data-testid="booking-arrival"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Flight Number (optional)</Label>
              <Input
                placeholder="AA123"
                value={bookingData.flight_number}
                onChange={(e) => setBookingData({ ...bookingData, flight_number: e.target.value })}
                className="mt-1"
                data-testid="booking-flight"
              />
            </div>

            <div>
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Any special requirements or notes..."
                value={bookingData.notes}
                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                className="mt-1"
                rows={3}
                data-testid="booking-notes"
              />
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Hourly Rate</span>
                <span className="font-semibold">${buddy?.hourly_rate || 0}/hour</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookingModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBooking}
              disabled={bookingLoading}
              className="bg-primary-600 hover:bg-primary-700"
              data-testid="confirm-booking-btn"
            >
              {bookingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
