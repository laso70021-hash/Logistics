import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  ArrowRight, Users, Warehouse, Shield, CheckCircle2, 
  Clock, HeadphonesIcon, Menu, X, LayoutDashboard, 
  Truck, PackageCheck, FileText, Check, PackageSearch,
  Search, Bell, ChevronDown, MapPin, Package, BarChart3, Settings, ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const mockLineData = [
  { name: 'Jan', value: 30 },
  { name: 'Feb', value: 40 },
  { name: 'Mar', value: 45 },
  { name: 'Apr', value: 50 },
  { name: 'May', value: 70 },
  { name: 'Jun', value: 90 },
  { name: 'Jul', value: 120 },
];

const mockPieData = [
  { name: 'Delivered', value: 57, color: '#3b82f6' },
  { name: 'In Transit', value: 36, color: '#06b6d4' },
  { name: 'Pending', value: 4, color: '#94a3b8' },
  { name: 'Exceptions', value: 3, color: '#ef4444' },
];

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="text-blue-600">
                <PackageSearch className="w-8 h-8" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-none text-gray-900 tracking-tight">CargoFlow</span>
                <span className="text-[10px] text-gray-500 font-medium">Logistics Made Simple</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-8 text-sm font-medium">
                <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">Home</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Features</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Solutions</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">Resources <ChevronDown className="w-4 h-4"/></a>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">Sign in</Link>
                <Link to="/signup" className="text-sm font-medium bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-sm">
                  Get started
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#eef2f6]">
          <div className="absolute top-0 right-0 w-[55%] h-full">
            <img 
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Logistics" 
              className="w-full h-full object-cover rounded-bl-[100px] shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#eef2f6] via-[#eef2f6]/80 to-transparent"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 pb-24 lg:pt-32 lg:pb-36">
            <div className="max-w-2xl">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6 shadow-sm">
                Modern Logistics Management Platform
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-[#0f172a] tracking-tight leading-[1.1] mb-6">
                Move Smarter.<br/>
                Deliver Faster.<br/>
                <span className="text-blue-600">Manage Everything.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
                One powerful platform for managing shipments, cargo, customers, teams, warehouses and deliveries from a single workspace.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <Link to="/signup" className="inline-flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-colors shadow-lg shadow-blue-600/20 text-lg">
                  Get started
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/contact" className="inline-flex justify-center items-center px-8 py-4 rounded-full font-semibold bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-lg">
                  Book a demo
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-8 md:gap-12">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                    <Users className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">Trusted by 500+</div>
                    <div className="text-xs text-gray-500">Logistics Companies</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                    <Clock className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">99.9%</div>
                    <div className="text-xs text-gray-500">Uptime Guarantee</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                    <HeadphonesIcon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">24/7</div>
                    <div className="text-xs text-gray-500">Customer Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Row */}
        <section className="py-16 bg-white border-b border-gray-100 relative z-20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
              <div className="flex flex-col items-center pt-8 md:pt-0 px-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <PackageCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Shipment Management</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Create, track and manage shipments from end to end.</p>
              </div>
              <div className="flex flex-col items-center pt-8 md:pt-0 px-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Cargo Tracking</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Real-time visibility for your valuable cargo.</p>
              </div>
              <div className="flex flex-col items-center pt-8 md:pt-0 px-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Team Collaboration</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Manage your team and assign roles easily.</p>
              </div>
              <div className="flex flex-col items-center pt-8 md:pt-0 px-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <Warehouse className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Warehouse Operations</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Track inventory and warehouse activities.</p>
              </div>
              <div className="flex flex-col items-center pt-8 md:pt-0 px-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Secure & Reliable</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Your data is protected with enterprise-grade security.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-[#f8fafc] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                  How It Works
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-12">
                  Get Started in 4 Simple Steps
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                  {/* Decorative Line */}
                  <div className="hidden lg:block absolute top-6 left-12 right-12 h-0.5 bg-gray-200 z-0"></div>
                  
                  {[
                    { title: 'Sign Up', desc: 'Create your account in minutes.' },
                    { title: 'Set Up Your Company', desc: 'Add your business details and team.' },
                    { title: 'Manage Operations', desc: 'Handle shipments, cargo, customers and more.' },
                    { title: 'Grow Your Business', desc: 'Scale with powerful tools and real-time insights.' }
                  ].map((step, idx) => (
                    <div key={idx} className="relative z-10">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-6 shadow-md border-4 border-[#f8fafc]">
                        {idx + 1}
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="lg:w-1/2 relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl relative">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Worker using tablet" 
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                </div>
                
                {/* Floating Notification */}
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-4 flex gap-4 items-start w-80 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="mt-1 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-900 text-sm">Shipment Delivered</h4>
                      <span className="text-[10px] text-gray-400">2m ago</span>
                    </div>
                    <div className="text-xs font-mono text-gray-500 mb-1">SHP-2026-000123</div>
                    <p className="text-xs text-gray-600">Arrived at destination</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/3">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
                  Powerful Dashboard
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                  Complete Visibility at Your Fingertips
                </h2>
                <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                  Get real-time insights into your operations with beautiful, easy-to-use dashboards and comprehensive reporting tools.
                </p>
                <ul className="space-y-4">
                  {[
                    'Live shipment tracking',
                    'Performance analytics',
                    'Custom reports',
                    'Mobile responsive'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:w-2/3">
                {/* Simulated Dashboard UI matching the image */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden flex h-[600px]">
                  
                  {/* Sidebar */}
                  <div className="w-56 bg-[#0f172a] text-gray-300 flex flex-col shrink-0">
                    <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-800 text-white font-bold text-lg">
                      <PackageSearch className="w-5 h-5 text-blue-500" /> CargoFlow
                    </div>
                    <div className="p-4 space-y-1">
                      <div className="bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 px-4 py-2 flex items-center gap-3 text-sm font-medium rounded-r-lg">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </div>
                      {[
                        { icon: Package, label: 'Shipments' },
                        { icon: Truck, label: 'Cargo' },
                        { icon: Users, label: 'Customers' },
                        { icon: MapPin, label: 'Deliveries' },
                        { icon: Search, label: 'Tracking' },
                        { icon: Warehouse, label: 'Warehouses' },
                        { icon: Truck, label: 'Vehicles' },
                        { icon: Users, label: 'Team' },
                        { icon: FileText, label: 'Documents' },
                        { icon: BarChart3, label: 'Reports' },
                        { icon: Settings, label: 'Settings' }
                      ].map((item, idx) => (
                        <div key={idx} className="px-4 py-2 flex items-center gap-3 text-sm hover:text-white hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors">
                          <item.icon className="w-4 h-4 text-gray-500" /> {item.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 bg-[#f8fafc] flex flex-col overflow-hidden">
                    {/* Topbar */}
                    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
                      <div className="relative w-96">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" placeholder="Search shipments, customers, tracking..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
                      </div>
                      <div className="flex items-center gap-4">
                        <Bell className="w-5 h-5 text-gray-400" />
                        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">JW</div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">John Wilson</div>
                            <div className="text-[10px] text-gray-500">Admin</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dashboard Body */}
                    <div className="p-6 overflow-y-auto">
                      <h1 className="text-xl font-bold text-gray-900 mb-6">Dashboard</h1>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                          <div className="text-gray-500 text-xs mb-1">Total Shipments</div>
                          <div className="flex items-end justify-between">
                            <div className="text-2xl font-bold text-gray-900">248</div>
                            <div className="text-xs text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded">+12% <span className="text-gray-400 font-normal">from last week</span></div>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                          <div className="text-gray-500 text-xs mb-1">In Transit</div>
                          <div className="flex items-end justify-between">
                            <div className="text-2xl font-bold text-gray-900">89</div>
                            <div className="text-xs text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded">+8% <span className="text-gray-400 font-normal">from last week</span></div>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                          <div className="text-gray-500 text-xs mb-1">Delivered</div>
                          <div className="flex items-end justify-between">
                            <div className="text-2xl font-bold text-gray-900">142</div>
                            <div className="text-xs text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded">+18% <span className="text-gray-400 font-normal">from last week</span></div>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                          <div className="text-gray-500 text-xs mb-1">Exceptions</div>
                          <div className="flex items-end justify-between">
                            <div className="text-2xl font-bold text-gray-900">7</div>
                            <div className="text-xs text-red-600 font-medium bg-red-50 px-1.5 py-0.5 rounded">-22% <span className="text-gray-400 font-normal">from last week</span></div>
                          </div>
                        </div>
                      </div>

                      {/* Charts Area */}
                      <div className="grid grid-cols-3 gap-6 mb-6">
                        <div className="col-span-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                          <h3 className="text-sm font-bold text-gray-900 mb-4">Shipment Status</h3>
                          <div className="flex items-center gap-4">
                            <div className="w-32 h-32 relative shrink-0">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie data={mockPieData} innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
                                    {mockPieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                  </Pie>
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="flex-1 space-y-3">
                              {mockPieData.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                                    <span className="text-gray-600">{item.name}</span>
                                  </div>
                                  <span className="font-bold text-gray-900">{item.value}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                          <h3 className="text-sm font-bold text-gray-900 mb-4">Shipments Over Time</h3>
                          <div className="flex-1 w-full min-h-[140px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={mockLineData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fill="url(#colorValue)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Table */}
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                          <h3 className="text-sm font-bold text-gray-900">Recent Shipments</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 text-gray-500 text-xs">
                            <tr>
                              <th className="px-5 py-3 font-medium">#</th>
                              <th className="px-5 py-3 font-medium">Customer</th>
                              <th className="px-5 py-3 font-medium">Route</th>
                              <th className="px-5 py-3 font-medium">Status</th>
                              <th className="px-5 py-3 font-medium">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {[
                              { id: 'SHP-2026-000123', customer: 'Acme Corp', route: 'Mombasa → Nairobi', status: 'In Transit', date: 'Apr 25, 2026', badge: 'bg-blue-100 text-blue-700' },
                              { id: 'SHP-2026-000124', customer: 'Global Traders', route: 'Dar es Salaam → Kampala', status: 'Delivered', date: 'Apr 24, 2026', badge: 'bg-green-100 text-green-700' },
                              { id: 'SHP-2026-000125', customer: 'Bright Logistics', route: 'Nairobi → Kigali', status: 'Pending', date: 'Apr 24, 2026', badge: 'bg-yellow-100 text-yellow-700' },
                              { id: 'SHP-2026-000126', customer: 'Sunrise Ltd', route: 'Lagos → Abuja', status: 'In Transit', date: 'Apr 23, 2026', badge: 'bg-blue-100 text-blue-700' },
                            ].map((row, i) => (
                              <tr key={i}>
                                <td className="px-5 py-3 font-mono text-gray-500 text-xs">{row.id}</td>
                                <td className="px-5 py-3 font-medium text-gray-900">{row.customer}</td>
                                <td className="px-5 py-3 text-gray-500 text-xs">{row.route}</td>
                                <td className="px-5 py-3">
                                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${row.badge}`}>{row.status}</span>
                                </td>
                                <td className="px-5 py-3 text-gray-500 text-xs">{row.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Built for the Future */}
        <section className="py-24 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Cargo ship" 
                    className="w-full h-[500px] object-cover"
                  />
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                  Built for the Future
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                  Everything You Need for Modern Logistics
                </h2>
                <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                  From small businesses to enterprise operations, CargoFlow gives you the tools to streamline your supply chain and deliver more.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Scalable</h4>
                      <p className="text-sm text-gray-600">Grows with your business</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Secure</h4>
                      <p className="text-sm text-gray-600">Enterprise-grade protection</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Reliable</h4>
                      <p className="text-sm text-gray-600">99.9% uptime</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12">
                  <Link to="/signup" className="inline-flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-semibold transition-colors shadow-sm">
                    Get started today
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="text-blue-600">
                <PackageSearch className="w-8 h-8" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-none text-gray-900 tracking-tight">CargoFlow</span>
                <span className="text-[10px] text-gray-500 font-medium">Logistics Made Simple</span>
              </div>
            </div>
            
            <div className="flex gap-8 text-sm font-medium text-gray-600">
              <a href="#" className="hover:text-gray-900">Features</a>
              <a href="#" className="hover:text-gray-900">Solutions</a>
              <a href="#" className="hover:text-gray-900">Pricing</a>
              <a href="#" className="hover:text-gray-900">Resources</a>
            </div>
            
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900">Privacy</a>
              <a href="#" className="hover:text-gray-900">Terms</a>
              <a href="#" className="hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
