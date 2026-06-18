import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Star, CheckCircle, Globe, Briefcase, MapPin } from 'lucide-react';

export function BuddyCard({ buddy }) {
  const navigate = useNavigate();
  
  const user = buddy.user || {};
  const displayName = user.email?.split('@')[0] || 'Travel Buddy';
  
  return (
    <Card 
      className="group bg-white rounded-2xl border border-slate-100 card-shadow hover:card-shadow-hover transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1"
      onClick={() => navigate(`/buddy/${buddy.id}`)}
      data-testid={`buddy-card-${buddy.id}`}
    >
      <CardContent className="p-0">
        {/* Profile Image */}
        <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center text-3xl font-heading font-bold text-primary-600">
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>
          {/* Verified Badge */}
          {buddy.status === 'verified' && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-accent text-white border-0 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verified
              </Badge>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-heading font-semibold text-lg text-foreground capitalize">
                {displayName}
              </h3>
              {user.email && (
                <p className="text-sm text-muted-foreground">{user.email}</p>
              )}
            </div>
            {buddy.rating_avg > 0 && (
              <div className="flex items-center gap-1 bg-secondary-100 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 text-secondary-500 fill-secondary-500" />
                <span className="text-sm font-semibold text-secondary-700">
                  {buddy.rating_avg.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-2 mb-4">
            {buddy.experience_years > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-slate-100 text-slate-700 hover:bg-slate-100">
                <Briefcase className="w-3 h-3" />
                {buddy.experience_years}+ years
              </Badge>
            )}
            {buddy.completed_journeys > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-slate-100 text-slate-700 hover:bg-slate-100">
                <MapPin className="w-3 h-3" />
                {buddy.completed_journeys} trips
              </Badge>
            )}
          </div>
          
          {/* Languages */}
          {buddy.languages?.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {buddy.languages.slice(0, 3).join(', ')}
                {buddy.languages.length > 3 && ` +${buddy.languages.length - 3}`}
              </p>
            </div>
          )}
          
          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div>
              <span className="text-lg font-heading font-bold text-foreground">
                ${buddy.hourly_rate || 0}
              </span>
              <span className="text-sm text-muted-foreground">/hour</span>
            </div>
            <Button 
              size="sm" 
              className="bg-primary-600 hover:bg-primary-700 rounded-full px-4"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/buddy/${buddy.id}`);
              }}
              data-testid={`view-buddy-${buddy.id}`}
            >
              View Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
