import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingAPI, reviewAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Search,
  Calendar,
  Plane,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  Loader2,
  MapPin,
  User,
  AlertCircle
} from 'lucide-react';

const statusColors = {
  requested: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  cancelled: 'bg-slate-100 text-slate-800',
  completed: 'bg-blue-100 text-blue-800'
};

export default function TravelerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingAPI.getMyBookings();
      setBookings(res.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingAPI.updateStatus(bookingId, 'cancelled');
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleOpenReview = (booking) => {
    setSelectedBooking(booking);
    setReviewData({ rating: 5, comment: '' });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedBooking) return;
    
    setReviewLoading(true);
    try {
      await reviewAPI.create({
        booking_id: selectedBooking.id,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      toast.success('Review submitted!');
      setShowReviewModal(false);
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const activeBookings = bookings.filter(b => ['requested', 'accepted'].includes(b.status));
  const pastBookings = bookings.filter(b => ['completed', 'declined', 'cancelled'].includes(b.status));

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="traveler-dashboard">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold mb-1">Welcome back!</h1>
              <p className="text-slate-500">Manage your travel bookings</p>
            </div>
            <Button
              onClick={() => navigate('/search')}
              className="bg-primary-600 hover:bg-primary-700 rounded-full px-6 btn-primary-shadow"
              data-testid="find-buddy-btn"
            >
              <Search className="w-4 h-4 mr-2" />
              Find a Buddy
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 max-w-7xl py-8">
        {/* Verification Warning */}
        {!user.is_verified && (
          <Card className="bg-yellow-50 border-yellow-200 mb-6">
            <CardContent className="py-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Please verify your email to unlock all features.{' '}
                <button className="font-medium underline">Resend verification email</button>
              </p>
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
              <p className="text-2xl font-heading font-bold text-green-600">{activeBookings.length}</p>
              <p className="text-sm text-slate-500">Active</p>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-xl border border-slate-100">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-heading font-bold text-blue-600">
                {bookings.filter(b => b.status === 'completed').length}
              </p>
              <p className="text-sm text-slate-500">Completed</p>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-xl border border-slate-100">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-heading font-bold text-yellow-600">
                {bookings.filter(b => b.status === 'requested').length}
              </p>
              <p className="text-sm text-slate-500">Pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings */}
        <Card className="bg-white rounded-2xl border border-slate-100 card-shadow">
          <CardHeader>
            <CardTitle className="font-heading text-xl">My Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="font-heading font-semibold mb-2">No Bookings Yet</h3>
                <p className="text-slate-500 mb-4">Find your first travel buddy to get started!</p>
                <Button onClick={() => navigate('/search')} className="bg-primary-600 hover:bg-primary-700">
                  Browse Buddies
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="active">
                <TabsList className="mb-4">
                  <TabsTrigger value="active" data-testid="active-tab">
                    Active ({activeBookings.length})
                  </TabsTrigger>
                  <TabsTrigger value="past" data-testid="past-tab">
                    Past ({pastBookings.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active">
                  <div className="space-y-4">
                    {activeBookings.length === 0 ? (
                      <p className="text-center text-slate-500 py-8">No active bookings</p>
                    ) : (
                      activeBookings.map((booking) => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          onCancel={() => handleCancelBooking(booking.id)}
                          onReview={() => handleOpenReview(booking)}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="past">
                  <div className="space-y-4">
                    {pastBookings.length === 0 ? (
                      <p className="text-center text-slate-500 py-8">No past bookings</p>
                    ) : (
                      pastBookings.map((booking) => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking}
                          onReview={() => handleOpenReview(booking)}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Leave a Review</DialogTitle>
            <DialogDescription>
              Share your experience with {selectedBooking?.buddy?.user?.email?.split('@')[0] || 'your buddy'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label className="mb-3 block">Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    className="p-1"
                    data-testid={`rating-${star}`}
                  >
                    <Star 
                      className={`w-8 h-8 transition-colors ${
                        star <= reviewData.rating 
                          ? 'text-secondary-500 fill-secondary-500' 
                          : 'text-slate-200'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Comment (optional)</Label>
              <Textarea
                placeholder="Tell others about your experience..."
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                className="mt-1"
                rows={4}
                data-testid="review-comment"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={reviewLoading}
              className="bg-primary-600 hover:bg-primary-700"
              data-testid="submit-review-btn"
            >
              {reviewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BookingCard({ booking, onCancel, onReview }) {
  const navigate = useNavigate();
  const buddyName = booking.buddy?.user?.email?.split('@')[0] || 'Buddy';

  return (
    <div 
      className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition-colors"
      data-testid={`booking-${booking.id}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-600 flex-shrink-0">
            {buddyName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold capitalize">{buddyName}</h4>
              <Badge className={statusColors[booking.status]}>
                {booking.status}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
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
              {booking.flight_number && (
                <span className="flex items-center gap-1">
                  Flight: {booking.flight_number}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-16 md:ml-0">
          {booking.status === 'requested' && onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="text-red-600 border-red-200 hover:bg-red-50"
              data-testid={`cancel-${booking.id}`}
            >
              Cancel
            </Button>
          )}
          {booking.status === 'completed' && (
            <Button
              size="sm"
              onClick={onReview}
              className="bg-primary-600 hover:bg-primary-700"
              data-testid={`review-${booking.id}`}
            >
              <Star className="w-4 h-4 mr-1" />
              Review
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/buddy/${booking.buddy_id}`)}
            data-testid={`view-buddy-${booking.id}`}
          >
            View Buddy
          </Button>
        </div>
      </div>
    </div>
  );
}
