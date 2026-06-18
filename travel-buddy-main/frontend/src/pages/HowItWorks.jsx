import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { 
  Search, 
  UserCheck, 
  Calendar, 
  MessageSquare, 
  Plane, 
  Star,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function HowItWorks() {
  const navigate = useNavigate();

  const travelerSteps = [
    {
      icon: Search,
      title: 'Search for a Buddy',
      description: 'Enter your flight details, travel date, and preferences. Our smart matching algorithm will find the perfect buddies for you.'
    },
    {
      icon: UserCheck,
      title: 'Review Profiles',
      description: 'Browse verified buddy profiles, check their ratings, reviews, languages spoken, and experience level.'
    },
    {
      icon: Calendar,
      title: 'Book Your Buddy',
      description: 'Select your preferred buddy and send a booking request. They\'ll confirm within 24 hours.'
    },
    {
      icon: MessageSquare,
      title: 'Connect & Coordinate',
      description: 'Chat with your buddy to discuss meeting points, special requirements, and travel details.'
    },
    {
      icon: Plane,
      title: 'Travel Together',
      description: 'Meet your buddy at the airport and enjoy a stress-free, accompanied journey.'
    },
    {
      icon: Star,
      title: 'Rate & Review',
      description: 'After your trip, share your experience to help other travelers find great buddies.'
    }
  ];

  const buddySteps = [
    {
      icon: UserCheck,
      title: 'Create Your Profile',
      description: 'Sign up as a buddy and complete your profile with your experience, languages, and availability.'
    },
    {
      icon: Shield,
      title: 'Get Verified',
      description: 'Submit your documents for verification. Our team reviews and approves qualified buddies.'
    },
    {
      icon: Calendar,
      title: 'Set Availability',
      description: 'Mark your available dates and preferred airports. Update anytime as your schedule changes.'
    },
    {
      icon: MessageSquare,
      title: 'Accept Requests',
      description: 'Review incoming booking requests and accept those that fit your schedule.'
    },
    {
      icon: Plane,
      title: 'Assist Travelers',
      description: 'Meet travelers at the airport and help them navigate their journey with confidence.'
    },
    {
      icon: Star,
      title: 'Earn & Grow',
      description: 'Receive payments for your services and build your reputation through positive reviews.'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'All buddies undergo thorough background checks and document verification.'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Our support team is always available to help with any issues.'
    },
    {
      icon: Star,
      title: 'Quality Assured',
      description: 'Rating system ensures consistently high-quality companions.'
    }
  ];

  return (
    <div className="min-h-screen" data-testid="how-it-works-page">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl text-center">
          <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight mb-6">
            How <span className="text-gradient">TravelBuddy</span> Works
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Whether you're looking for a travel companion or want to become one, 
            we make the process simple and secure.
          </p>
        </div>
      </section>

      {/* For Travelers */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-4">
              For Travelers
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Find Your Perfect Travel Companion
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Follow these simple steps to connect with a verified buddy for your journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelerSteps.map((step, index) => (
              <Card 
                key={index}
                className="bg-white rounded-2xl border border-slate-100 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-600 text-white flex items-center justify-center font-heading font-bold">
                      {index + 1}
                    </div>
                    <step.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => navigate('/search')}
              className="bg-primary-600 hover:bg-primary-700 rounded-full px-8 btn-primary-shadow"
              data-testid="find-buddy-btn"
            >
              Find a Buddy Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* For Buddies */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium mb-4">
              For Buddies
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Earn While Helping Others Travel
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Turn your travel experience into a rewarding opportunity to help others.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buddySteps.map((step, index) => (
              <Card 
                key={index}
                className="bg-white rounded-2xl border border-slate-100 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary-400 text-white flex items-center justify-center font-heading font-bold">
                      {index + 1}
                    </div>
                    <step.icon className="w-6 h-6 text-secondary-600" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => navigate('/register?role=buddy')}
              className="bg-secondary-400 hover:bg-secondary-500 text-secondary-foreground rounded-full px-8"
              data-testid="become-buddy-btn"
            >
              Become a Buddy
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Why Trust TravelBuddy?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-6">
                  <benefit.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3">{benefit.title}</h3>
                <p className="text-slate-500">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-24 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Common Questions
            </h2>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: 'How are buddies verified?',
                a: 'All buddies submit government ID and undergo background checks before being approved.'
              },
              {
                q: 'What if my buddy doesn\'t show up?',
                a: 'We have a refund policy and 24/7 support to help you find alternative assistance.'
              },
              {
                q: 'Can I choose my buddy?',
                a: 'Absolutely! Browse profiles, read reviews, and select the buddy that best fits your needs.'
              }
            ].map((item, index) => (
              <Card key={index} className="bg-white rounded-xl border border-slate-100">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-heading font-semibold mb-2">{item.q}</h4>
                      <p className="text-slate-500 text-sm">{item.a}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
