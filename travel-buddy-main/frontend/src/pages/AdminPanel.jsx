import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  FileText,
  Eye,
  MapPin,
  Plane,
  Star,
  Shield,
  AlertTriangle
} from 'lucide-react';

const statusColors = {
  requested: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  cancelled: 'bg-slate-100 text-slate-800',
  completed: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  verified: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [pendingBuddies, setPendingBuddies] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuddy, setSelectedBuddy] = useState(null);
  const [buddyDocuments, setBuddyDocuments] = useState([]);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
  if (user?.role !== 'admin') {
    navigate('/');
    return;
  }
  fetchData();
}, [user, navigate]);
  const fetchData = async () => {
    try {
      const [statsRes, buddiesRes, bookingsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getPendingBuddies(),
        adminAPI.getAllBookings()
      ]);
      
      setStats(statsRes.data);
      setPendingBuddies(buddiesRes.data);
      setAllBookings(bookingsRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocuments = async (buddy) => {
    setSelectedBuddy(buddy);
    try {
      const res = await adminAPI.getBuddyDocuments(buddy.id);
      setBuddyDocuments(res.data);
      setShowDocsModal(true);
    } catch (error) {
      toast.error('Failed to load documents');
    }
  };

  const handleVerifyBuddy = async (buddyId, status) => {
    setActionLoading(true);
    try {
      await adminAPI.verifyBuddy(buddyId, status);
      toast.success(`Buddy ${status}`);
      setShowDocsModal(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to update buddy status');
    } finally {
      setActionLoading(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="admin-panel">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl py-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold">Admin Panel</h1>
              <p className="text-slate-500">Manage users, verifications, and bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 max-w-7xl py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-white rounded-xl border border-slate-100">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-primary-600 mx-auto mb-2" />
              <p className="text-2xl font-heading font-bold">{stats?.total_users || 0}</p>
              <p className="text-xs text-slate-500">Total Users</p>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-xl border border-slate-100">
            <CardContent className="p-4 text-center">
              <UserCheck className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-heading font-bold">{stats?.verified_buddies || 0}</p>
              <p className="text-xs text-slate-500">Verified Buddies</p>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-xl border border-slate-100">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-heading font-bold">{stats?.pending_buddies || 0}</p>
              <p className="text-xs text-slate-500">Pending Verification</p>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-xl border border-slate-100">
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-heading font-bold">{stats?.total_bookings || 0}</p>
              <p className="text-xs text-slate-500">Total Bookings</p>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-xl border border-slate-100">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-heading font-bold">{stats?.completed_bookings || 0}</p>
              <p className="text-xs text-slate-500">Completed</p>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-xl border border-slate-100">
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 text-secondary-500 mx-auto mb-2" />
              <p className="text-2xl font-heading font-bold">{stats?.total_buddies || 0}</p>
              <p className="text-xs text-slate-500">Total Buddies</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="verifications">
          <TabsList className="mb-6">
            <TabsTrigger value="verifications" data-testid="verifications-tab">
              Pending Verifications ({pendingBuddies.length})
            </TabsTrigger>
            <TabsTrigger value="bookings" data-testid="bookings-tab">
              All Bookings ({allBookings.length})
            </TabsTrigger>
          </TabsList>

          {/* Verifications Tab */}
          <TabsContent value="verifications">
            <Card className="bg-white rounded-2xl border border-slate-100 card-shadow">
              <CardHeader>
                <CardTitle className="font-heading text-xl">Pending Buddy Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingBuddies.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-green-200 mx-auto mb-4" />
                    <h3 className="font-heading font-semibold mb-2">All Caught Up!</h3>
                    <p className="text-slate-500">No pending verifications at the moment.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingBuddies.map((buddy) => (
                      <div 
                        key={buddy.id}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-slate-100 rounded-xl"
                        data-testid={`pending-buddy-${buddy.id}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-600">
                            {buddy.user?.email?.charAt(0).toUpperCase() || 'B'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold capitalize">
                                {buddy.user?.email?.split('@')[0] || 'Buddy'}
                              </h4>
                              <Badge className={statusColors[buddy.status]}>
                                {buddy.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500">{buddy.user?.email}</p>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1">
                              <span>{buddy.experience_years || 0} years exp</span>
                              <span>{buddy.languages?.length || 0} languages</span>
                              <span>${buddy.hourly_rate || 0}/hr</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-16 md:ml-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDocuments(buddy)}
                            data-testid={`view-docs-${buddy.id}`}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Docs
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleVerifyBuddy(buddy.id, 'verified')}
                            className="bg-green-600 hover:bg-green-700"
                            data-testid={`verify-${buddy.id}`}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerifyBuddy(buddy.id, 'rejected')}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            data-testid={`reject-${buddy.id}`}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="bg-white rounded-2xl border border-slate-100 card-shadow">
              <CardHeader>
                <CardTitle className="font-heading text-xl">All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {allBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <h3 className="font-heading font-semibold mb-2">No Bookings</h3>
                    <p className="text-slate-500">No bookings have been made yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Traveler</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Buddy</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Route</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allBookings.map((booking) => (
                          <tr 
                            key={booking.id} 
                            className="border-b border-slate-50 hover:bg-slate-50"
                            data-testid={`booking-row-${booking.id}`}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-semibold text-primary-600">
                                  {booking.traveler?.email?.charAt(0).toUpperCase() || 'T'}
                                </div>
                                <span className="text-sm capitalize">
                                  {booking.traveler?.email?.split('@')[0] || 'Traveler'}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm capitalize">
                                {booking.buddy?.user?.email?.split('@')[0] || 'Buddy'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <span>{booking.departure_airport}</span>
                                <Plane className="w-3 h-3" />
                                <span>{booking.arrival_airport}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {format(new Date(booking.travel_date), 'MMM d, yyyy')}
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={statusColors[booking.status]}>
                                {booking.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm font-medium">
                              ${booking.price || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Documents Modal */}
      <Dialog open={showDocsModal} onOpenChange={setShowDocsModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">
              Documents - {selectedBuddy?.user?.email?.split('@')[0]}
            </DialogTitle>
            <DialogDescription>
              Review submitted documents before verification.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {buddyDocuments.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                <p className="text-slate-500">No documents uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {buddyDocuments.map((doc) => (
                  <div 
                    key={doc.id}
                    className="flex items-center justify-between p-4 border border-slate-100 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium capitalize">{doc.document_type.replace('_', ' ')}</p>
                        <p className="text-sm text-slate-500">
                          {format(new Date(doc.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(doc.file_url, '_blank')}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocsModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleVerifyBuddy(selectedBuddy?.id, 'rejected')}
              disabled={actionLoading}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-1" />}
              Reject
            </Button>
            <Button
              onClick={() => handleVerifyBuddy(selectedBuddy?.id, 'verified')}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1" />}
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
