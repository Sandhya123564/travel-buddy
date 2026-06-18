import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { buddyAPI } from '../lib/api';
import { BuddyCard } from '../components/BuddyCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { format } from 'date-fns';
import { 
  Search, 
  Calendar as CalendarIcon, 
  Plane, 
  MapPin, 
  Globe,
  Filter,
  Loader2,
  Users
} from 'lucide-react';

const languages = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 
  'Korean', 'Arabic', 'Hindi', 'Portuguese', 'Russian', 'Italian'
];

export default function SearchBuddies() {
  const [searchParams] = useSearchParams();
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    travel_date: searchParams.get('date') || '',
    departure_airport: searchParams.get('from') || '',
    arrival_airport: searchParams.get('to') || '',
    language: '',
    min_experience: ''
  });
  
  const [date, setDate] = useState(
    searchParams.get('date') ? new Date(searchParams.get('date')) : undefined
  );

  const fetchBuddies = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.travel_date) params.travel_date = filters.travel_date;
      if (filters.departure_airport) params.departure_airport = filters.departure_airport;
      if (filters.arrival_airport) params.arrival_airport = filters.arrival_airport;
      if (filters.language) params.language = filters.language;
      if (filters.min_experience) params.min_experience = parseInt(filters.min_experience);
      
      const res = await buddyAPI.search(params);
      setBuddies(res.data);
    } catch (error) {
      console.error('Failed to fetch buddies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuddies();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBuddies();
  };

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    if (selectedDate) {
      setFilters({ ...filters, travel_date: format(selectedDate, 'yyyy-MM-dd') });
    } else {
      setFilters({ ...filters, travel_date: '' });
    }
  };

  const clearFilters = () => {
    setFilters({
      travel_date: '',
      departure_airport: '',
      arrival_airport: '',
      language: '',
      min_experience: ''
    });
    setDate(undefined);
    fetchBuddies();
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="search-buddies-page">
      {/* Search Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
            Find Your Travel Buddy
          </h1>
          
          {/* Search Form */}
          <Card className="bg-white rounded-2xl shadow-xl border-0">
            <CardContent className="p-6">
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Date */}
                  <div>
                    <Label className="text-sm text-slate-500 mb-2 block">Travel Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal h-12"
                          data-testid="date-picker-trigger"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={handleDateSelect}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* From Airport */}
                  <div>
                    <Label className="text-sm text-slate-500 mb-2 block">From</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Departure airport"
                        value={filters.departure_airport}
                        onChange={(e) => setFilters({ ...filters, departure_airport: e.target.value })}
                        className="pl-10 h-12"
                        data-testid="departure-input"
                      />
                    </div>
                  </div>
                  
                  {/* To Airport */}
                  <div>
                    <Label className="text-sm text-slate-500 mb-2 block">To</Label>
                    <div className="relative">
                      <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Arrival airport"
                        value={filters.arrival_airport}
                        onChange={(e) => setFilters({ ...filters, arrival_airport: e.target.value })}
                        className="pl-10 h-12"
                        data-testid="arrival-input"
                      />
                    </div>
                  </div>
                  
                  {/* Search Button */}
                  <div className="flex items-end">
                    <Button 
                      type="submit"
                      className="w-full h-12 bg-primary-600 hover:bg-primary-700 rounded-xl"
                      data-testid="search-btn"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
                
                {/* Toggle Filters */}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowFilters(!showFilters)}
                  className="mt-4"
                  data-testid="toggle-filters"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide Filters' : 'More Filters'}
                </Button>
                
                {/* Additional Filters */}
                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
                    {/* Language */}
                    <div>
                      <Label className="text-sm text-slate-500 mb-2 block">Language</Label>
                      <Select 
                        value={filters.language} 
                        onValueChange={(value) => setFilters({ ...filters, language: value })}
                      >
                        <SelectTrigger className="h-12" data-testid="language-select">
                          <Globe className="w-4 h-4 mr-2 text-slate-400" />
                          <SelectValue placeholder="Any language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Experience */}
                    <div>
                      <Label className="text-sm text-slate-500 mb-2 block">Min Experience</Label>
                      <Select 
                        value={filters.min_experience} 
                        onValueChange={(value) => setFilters({ ...filters, min_experience: value })}
                      >
                        <SelectTrigger className="h-12" data-testid="experience-select">
                          <SelectValue placeholder="Any experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1+ years</SelectItem>
                          <SelectItem value="2">2+ years</SelectItem>
                          <SelectItem value="5">5+ years</SelectItem>
                          <SelectItem value="10">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Clear Filters */}
                    <div className="flex items-end">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={clearFilters}
                        className="w-full h-12"
                        data-testid="clear-filters"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400" />
              <p className="text-slate-600">
                <span className="font-semibold text-foreground">{buddies.length}</span> buddies available
              </p>
            </div>
          </div>
          
          {/* Results Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : buddies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="buddies-grid">
              {buddies.map((buddy) => (
                <BuddyCard key={buddy.id} buddy={buddy} />
              ))}
            </div>
          ) : (
            <Card className="bg-white rounded-2xl border border-slate-100 card-shadow">
              <CardContent className="py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">No Buddies Found</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  Try adjusting your search filters or check back later for new verified buddies.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
