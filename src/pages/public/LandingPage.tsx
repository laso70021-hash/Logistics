import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, Box, Navigation, Users, Warehouse, Shield, CheckCircle2, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function LandingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [heroTitle, setHeroTitle] = useState('Move Smarter.<br/>Deliver Faster.<br/><span class="text-blue-400">Manage Everything.</span>');
  const [heroSubtitle, setHeroSubtitle] = useState('One powerful platform for managing shipments, cargo, customers, teams, warehouses and deliveries from a single workspace.');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase.from('content_cms').select('*').eq('page', 'landing').single();
        if (data && !error) {
          if (data.hero_title) setHeroTitle(data.hero_title);
          if (data.hero_subtitle) setHeroSubtitle(data.hero_subtitle);
        }
      } catch (err) {
        // Table might not exist, use defaults
      }
    };
    fetchContent();
  }, []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      navigate(`/track/${trackingNumber}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center animate-ken-burns scale-110"
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
            }}
          />
          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-sm font-medium mb-6">
              Modern Logistics Management Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6" dangerouslySetInnerHTML={{ __html: heroTitle }}>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
              {heroSubtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/signup" 
                className="inline-flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-medium transition-colors"
              >
                Get started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/contact" 
                className="inline-flex justify-center items-center px-8 py-3.5 rounded-full font-medium bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
              >
                Book a demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap justify-between items-center gap-8 text-gray-600 text-sm font-medium">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Trusted by 500+ Logistics Companies
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              99.9% Uptime Guarantee
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              24/7 Customer Support
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8">
            {[
              { icon: Box, title: "Shipment Management", desc: "Create, track and manage shipments from end to end." },
              { icon: Navigation, title: "Cargo Tracking", desc: "Real-time visibility for your valuable cargo." },
              { icon: Users, title: "Team Collaboration", desc: "Manage your team and assign roles easily." },
              { icon: Warehouse, title: "Warehouse Operations", desc: "Track inventory and warehouse activities." },
              { icon: Shield, title: "Secure & Reliable", desc: "Your data is protected with enterprise-grade security." },
            ].map((service, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="text-gray-900 font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works & Tracking */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Tracking Form (Left side) */}
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
                Real-Time Tracking
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Track your cargo instantly.</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Enter your tracking number below to see the current status and location of your shipment.
              </p>
              
              <form onSubmit={handleTrack} className="flex gap-2 max-w-md">
                <input
                  type="text"
                  placeholder="e.g. TRK-2026-98421"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap"
                >
                  Track Now
                </button>
              </form>

              <div className="mt-12 space-y-6">
                {[
                  { step: 1, title: "Register Shipment", desc: "Packages are logged into our secure system." },
                  { step: 2, title: "In Transit", desc: "Real-time updates as your cargo moves." },
                  { step: 3, title: "Proof of Delivery", desc: "Verified delivery with digital signatures." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image (Right side) */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-blue-50 rounded-3xl transform rotate-3" />
              <img 
                src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Logistics Worker" 
                className="relative rounded-3xl shadow-xl object-cover h-[600px] w-full"
              />
              
              {/* Floating Element */}
              <div className="absolute top-8 -left-8 bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-start gap-3 w-64 animate-bounce-slow">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Shipment Delivered</h4>
                  <p className="text-xs text-gray-500 mt-1">TRK-2026-98421</p>
                  <p className="text-xs text-gray-400 mt-1">Arrived at destination 2m ago</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-900/50 text-blue-300 text-sm font-medium mb-4">
            Powerful Dashboard
          </div>
          <h2 className="text-4xl font-bold mb-4">Complete Visibility at Your Fingertips</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Get real-time insights into your operations with beautiful, easy-to-use dashboards and comprehensive reporting tools.
          </p>
        </div>
        <div className="max-w-6xl mx-auto px-4 relative">
            <div className="bg-gray-800 rounded-t-2xl border border-gray-700 shadow-2xl p-2 mx-auto overflow-hidden translate-y-8 h-[400px]">
              <div className="flex gap-2 mb-4 p-2">
                 <div className="w-3 h-3 rounded-full bg-red-500"/>
                 <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                 <div className="w-3 h-3 rounded-full bg-green-500"/>
              </div>
              <div className="flex h-full border-t border-gray-700/50 pt-2">
                <div className="w-48 border-r border-gray-700/50 pr-4 space-y-2">
                   {['Dashboard', 'Shipments', 'Cargo', 'Customers', 'Settings'].map((v, i) => (
                      <div key={i} className={`px-3 py-2 rounded text-sm ${i === 0 ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>{v}</div>
                   ))}
                </div>
                <div className="flex-1 pl-6">
                    <div className="grid grid-cols-4 gap-4 mb-6">
                       {['Total Shipments', 'In Transit', 'Delivered', 'Exceptions'].map((v, i) => (
                          <div key={i} className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                             <div className="text-gray-400 text-xs mb-1">{v}</div>
                             <div className="text-2xl font-semibold">{Math.floor(Math.random() * 200 + 50)}</div>
                          </div>
                       ))}
                    </div>
                </div>
              </div>
            </div>
        </div>
      </section>
    </div>
  );
}
