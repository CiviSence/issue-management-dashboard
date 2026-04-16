import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  FileText, 
  Bell, 
  BarChart3, 
  Users, 
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield
} from "lucide-react";
import csmlogo from "../assets/logo/CSM-logo.png";
import csmlogowhite from "../assets/logo/logowhite.png";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: FileText,
      title: "Easy Reporting",
      desc: "Submit issues in seconds with our streamlined reporting form"
    },
    {
      icon: Bell,
      title: "Real-time Updates",
      desc: "Get instant notifications on issue status changes"
    },
    {
      icon: BarChart3,
      title: "Track Progress",
      desc: "Monitor resolution progress with transparent status tracking"
    },
    {
      icon: Users,
      title: "Collaborative",
      desc: "Work together with faculty and staff for quick resolutions"
    }
  ];

  const stats = [
    { value: "500+", label: "Issues Resolved", icon: CheckCircle2 },
    { value: "98%", label: "Satisfaction Rate", icon: Shield },
    { value: "24h", label: "Avg Response Time", icon: Clock },
    { value: "1000+", label: "Active Users", icon: Users }
  ];

  return (
    <div className="min-h-screen w-full bg-[#f3f0ff]">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <img src={csmlogo} alt="CSM Logo" className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold text-[#6366f1]">CSM</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-[#6366f1] transition">Features</a>
              <a href="#about" className="text-slate-600 hover:text-[#6366f1] transition">About</a>
              <Link to="/login" className="text-[#6366f1] font-medium hover:text-[#5445c9] transition">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 rounded-full bg-[#6e5fdb] text-white font-medium hover:bg-[#5445c9] transition shadow-lg shadow-indigo-100 flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f3f0ff] via-white to-[#e8e4ff]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#7E70EB]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#5A50A6]/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366f1]/10 text-[#6366f1] text-sm font-medium mb-8">
              <img src={csmlogo} alt="" className="h-5 w-5" />
              <span>CSM - Issue Management Dashboard</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Report. Track. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7E70EB] to-[#5A50A6]">Resolve.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              A transparent platform for staff and administrators to report, track, and resolve 
              campus issues efficiently. Making operations smoother, together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/signup"
                className="group px-8 py-4 rounded-full bg-linear-to-r from-[#7E70EB] to-[#5A50A6] text-white font-semibold text-lg hover:shadow-xl hover:shadow-indigo-200 transition-all duration-300 flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 rounded-full border-2 border-[#6366f1]/20 text-[#6366f1] font-semibold text-lg hover:bg-[#6366f1]/5 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="about" className="py-16 bg-white border-y border-[#6366f1]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#6366f1]/10 text-[#6366f1] mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-[#6366f1] mb-2">{stat.value}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#f8f7ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to manage issues
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Simple, transparent, and efficient tools designed for the CSM community
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 border border-white hover:border-[#6366f1]/30"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-[#7E70EB]/10 to-[#5A50A6]/10 text-[#6366f1] mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-[#7E70EB] to-[#5A50A6]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img src={csmlogowhite} alt="CSM" className="h-40 w-40 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to make CSM better?
          </h2>
          <p className="text-xl text-indigo-50 mb-10 max-w-2xl mx-auto">
            Join administrators and staff in building a more responsive campus community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 rounded-full bg-white text-[#6366f1] font-bold text-lg hover:bg-[#f3f0ff] transition shadow-xl flex items-center justify-center gap-2"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-full border-2 border-white/20 text-white font-bold text-lg hover:bg-white/10 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={csmlogo} alt="CSM" className="h-8 w-8 opacity-80" />
              <span className="text-white font-semibold">CSM Issue Management</span>
            </div>
            <div className="flex gap-8 text-sm">
              <Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
              <Link to="/help-support" className="hover:text-white transition">Contact Support</Link>
            </div>
            <p className="text-sm">© 2026 CSM - All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}