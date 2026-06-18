import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { 
  Search, 
  Shield, 
  Star, 
  Users, 
  Plane, 
  CheckCircle,
  ArrowRight,
  Globe,
  Heart
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'Verified Buddies',
      description: 'All travel companions are verified through our rigorous background check process.'
    },
    {
      icon: Star,
      title: 'Trusted Reviews',
      description: 'Read authentic reviews from travelers who have used our service.'
    },
    {
      icon: Users,
      title: 'Perfect Match',
      description: 'Find a buddy who speaks your language and understands your needs.'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Buddies available at major airports worldwide for any destination.'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Happy Travelers' },
    { value: '500+', label: 'Verified Buddies' },
    { value: '50+', label: 'Countries' },
    { value: '4.9', label: 'Average Rating' }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'First-time Flyer',
      content: 'My buddy made my first international flight so much easier. They helped me through security and kept me calm.',
      rating: 5
    },
    {
      name: 'James L.',
      role: 'Business Traveler',
      content: 'Great service for frequent travelers. My buddy knew all the shortcuts and made my connection seamless.',
      rating: 5
    },
    {
      name: 'Maria G.',
      role: 'Solo Traveler',
      content: 'As a solo female traveler, having a verified buddy gave me peace of mind during my layover.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-white py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-6 shadow-sm border border-slate-100">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-slate-600">Trusted by 10,000+ travelers</span>
              </div>
              <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
                Travel with <span className="text-gradient">Confidence</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8 max-w-xl">
                Connect with verified travel companions who make your journey safer, 
                smoother, and more enjoyable. From first-time flyers to frequent travelers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/search')}
                  className="bg-primary-600 hover:bg-primary-700 rounded-full px-8 h-14 text-base btn-primary-shadow"
                  data-testid="hero-find-buddy"
                >
                  Find a Buddy
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/register?role=buddy')}
                  className="rounded-full px-8 h-14 text-base border-slate-200"
                  data-testid="hero-become-buddy"
                >
                  Become a Buddy
                </Button>
              </div>
            </div>
            <div className="relative animate-slide-up">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/4173205/pexels-photo-4173205.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt="Happy travelers at airport"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                
                {/* Floating Cards */}
                <div className="absolute bottom-6 left-6 right-6">
                  <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-heading font-semibold">Verified & Trusted</p>
                        <p className="text-sm text-slate-500">All buddies background-checked</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-heading text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </p>
                <p className="text-sm md:text-base text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Why Choose TravelBuddy?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We connect travelers with verified companions for a safer, more enjoyable journey.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="bg-white rounded-2xl border border-slate-100 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Three simple steps to find your perfect travel companion.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Search',
                description: 'Enter your flight details and preferences to find available buddies.',
                icon: Search
              },
              {
                step: '02',
                title: 'Connect',
                description: 'Review profiles, ratings, and book your preferred travel buddy.',
                icon: Users
              },
              {
                step: '03',
                title: 'Travel',
                description: 'Meet your buddy at the airport and enjoy a stress-free journey.',
                icon: Plane
              }
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-600 text-white font-heading font-bold text-xl mb-6">
                  {item.step}
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3">{item.title}</h3>
                <p className="text-slate-500">{item.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-slate-200"></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => navigate('/how-it-works')}
              variant="outline"
              className="rounded-full px-8"
              data-testid="learn-more-btn"
            >
              Learn More
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Loved by Travelers
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              See what our community has to say about their experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="bg-white rounded-2xl border border-slate-100 card-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-secondary-400 fill-secondary-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-600">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-600">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl text-center">
          <h2 className="font-heading text-3xl md:text-5xl font-semibold text-white mb-6">
            Ready to Travel with Confidence?
          </h2>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-8">
            Join thousands of travelers who have discovered the joy of traveling with a trusted companion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/search')}
              className="bg-white text-primary-600 hover:bg-slate-100 rounded-full px-8 h-14 text-base"
              data-testid="cta-find-buddy"
            >
              Find Your Buddy
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/register?role=buddy')}
              className="border-white text-white hover:bg-white/10 rounded-full px-8 h-14 text-base"
              data-testid="cta-become-buddy"
            >
              <Heart className="mr-2 w-5 h-5" />
              Become a Buddy
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
