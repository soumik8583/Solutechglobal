import React, { useState } from "react";
import "@/App.css";
import axios from "axios";
import { 
  FileText, 
  Calculator, 
  BarChart3, 
  Users, 
  Check, 
  Phone, 
  Mail, 
  MapPin,
  ChevronRight,
  Menu,
  X,
  MessageCircle,
  Shield,
  Clock,
  HeartHandshake,
  Send,
  ArrowRight
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// WhatsApp numbers
const WHATSAPP_NUMBERS = [
  { number: "918910414249", display: "+91 89104 14249" },
  { number: "917003495118", display: "+91 70034 95118" }
];

// Services data
const services = [
  {
    id: "gst",
    icon: FileText,
    title: "GST Compliance Services",
    shortTitle: "GST Services",
    description: "End to end GST support so you never miss a deadline or notice.",
    features: [
      "GST Registration, Amendment & Cancellation",
      "GSTR 1, GSTR 3B, GSTR 9 & GSTR 9C Filing",
      "GST Reconciliation & ITC Mismatch Resolution",
      "GST Refund Processing",
      "Notice Reply, Revocation & Department Handling"
    ],
    cta: "Get GST Help Now"
  },
  {
    id: "accounting",
    icon: Calculator,
    title: "Accounting & Bookkeeping Services",
    shortTitle: "Accounting",
    description: "Accurate books that help you understand your business numbers.",
    features: [
      "Daily Accounting & Ledger Maintenance",
      "Bank & Credit Card Reconciliation",
      "Monthly / Quarterly Financial Statements",
      "Cleanup of Old & Incomplete Books",
      "Expense, Vendor & Payroll Support"
    ],
    note: "Suitable for MSMEs, startups, and remote clients.",
    cta: "Get Your Books Organised"
  },
  {
    id: "tax",
    icon: BarChart3,
    title: "Income Tax & TDS Services",
    shortTitle: "Income Tax",
    description: "Simple, lawful, and practical tax solutions.",
    features: [
      "Individual & Business ITR Filing",
      "TDS Calculation, Payment & Returns",
      "Tax Planning & Compliance Review",
      "Refund Tracking & Rectification Filing"
    ],
    note: "We focus on compliance first — savings next.",
    cta: "File Income Tax Now"
  },
  {
    id: "virtual",
    icon: Users,
    title: "Virtual Accountant Services",
    shortTitle: "Virtual Accountant",
    description: "Your remote finance partner — without full time hiring costs.",
    features: [
      "Monthly Financial Review & MIS Reports",
      "Cash Flow Monitoring & Controls",
      "Budgeting & Forecasting",
      "Custom Excel Reports & Dashboards"
    ],
    note: "Ideal for founders who want visibility and control.",
    cta: "Hire a Virtual Accountant"
  }
];

const whyChooseUs = [
  { icon: Check, text: "Practical, no nonsense advice" },
  { icon: Clock, text: "Timely filings & clear communication" },
  { icon: Shield, text: "Updated with latest GST & tax laws" },
  { icon: HeartHandshake, text: "Personal attention — no call centres" },
  { icon: Users, text: "Experience with Indian & overseas clients" }
];

const clients = [
  "Small & Medium Businesses",
  "Startups & Entrepreneurs",
  "Freelancers & Professionals",
  "E-commerce Sellers",
  "Overseas Clients requiring Indian compliance"
];

const testimonials = [
  { text: "Clear guidance and timely compliance. Very dependable.", author: "Business Owner" },
  { text: "Books are finally clean and understandable.", author: "Startup Founder" },
  { text: "Professional, responsive, and trustworthy service.", author: "E-commerce Seller" }
];

// Header Component
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#about", label: "About" },
    { href: "#why-us", label: "Why Us" },
    { href: "#contact", label: "Contact" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/50" data-testid="header">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2" data-testid="logo">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl text-slate-900 hidden sm:block">Solutech Global</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#contact"
              className="btn-primary"
              data-testid="header-cta"
            >
              Free Consultation
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200" data-testid="mobile-menu">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-slate-600 hover:text-blue-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a href="#contact" className="btn-primary mt-2 text-center" onClick={() => setMobileMenuOpen(false)}>
                Free Consultation
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Hero Section
const HeroSection = () => {
  const openWhatsApp = () => {
    const message = encodeURIComponent("Hi, I would like to inquire about your consultancy services.");
    window.open(`https://wa.me/${WHATSAPP_NUMBERS[0].number}?text=${message}`, '_blank');
  };

  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-b from-slate-50 to-white" data-testid="hero-section">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
              <Shield size={16} />
              Trusted by 500+ Businesses
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
              Reliable <span className="gradient-text">GST, Accounting & Tax</span> Compliance
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
              We help startups, MSMEs, professionals, and growing businesses manage GST, accounting, taxation, and virtual bookkeeping — without jargon, delays, or compliance stress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact" className="btn-primary" data-testid="hero-consultation-btn">
                Book Free Consultation
                <ChevronRight size={20} className="ml-2" />
              </a>
              <button onClick={openWhatsApp} className="btn-whatsapp" data-testid="hero-whatsapp-btn">
                <MessageCircle size={20} />
                Connect on WhatsApp
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="animate-fade-in animation-delay-200">
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-100 rounded-2xl transform rotate-3"></div>
              <img
                src="https://images.pexels.com/photos/6930549/pexels-photo-6930549.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="Solutech team collaborating"
                className="relative rounded-2xl shadow-xl w-full object-cover h-[400px]"
                data-testid="hero-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Service Card Component
const ServiceCard = ({ service, index }) => {
  const Icon = service.icon;
  
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      className={`bg-white p-8 rounded-xl border border-slate-100 shadow-sm card-hover animate-fade-in-up`}
      style={{ animationDelay: `${index * 0.1}s` }}
      data-testid={`service-card-${service.id}`}
    >
      <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center mb-6">
        <Icon className="text-blue-600" size={28} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
      <p className="text-slate-600 mb-5">{service.description}</p>
      <ul className="space-y-2 mb-6">
        {service.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
            <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {service.note && (
        <p className="text-sm text-slate-500 italic mb-4">{service.note}</p>
      )}
      <Button 
        onClick={scrollToContact}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        data-testid={`service-cta-${service.id}`}
      >
        {service.cta}
        <ArrowRight size={16} className="ml-2" />
      </Button>
    </div>
  );
};

// Services Section
const ServicesSection = () => {
  return (
    <section id="services" className="section-padding bg-slate-50" data-testid="services-section">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Core Services</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive financial and compliance solutions tailored for your business needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Why Choose Us Section
const WhyChooseUsSection = () => {
  return (
    <section id="why-us" className="section-padding bg-white" data-testid="why-us-section">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Why Choose Solutech Global Consultancy?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              We don't just file returns. We support your business decisions with practical insights and reliable expertise.
            </p>
            <ul className="space-y-4">
              {whyChooseUs.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index} className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="text-blue-600" size={20} />
                    </div>
                    <span className="text-slate-700 font-medium">{item.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-slate-100 rounded-2xl transform -rotate-3"></div>
            <img
              src="https://images.pexels.com/photos/33175650/pexels-photo-33175650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt="Business handshake"
              className="relative rounded-2xl shadow-xl w-full object-cover h-[400px]"
              data-testid="why-us-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// About Section
const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-slate-900 text-white" data-testid="about-section">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1758518727707-b023e285b709?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhY2NvdW50YW50JTIwdGVhbSUyMG1lZXRpbmclMjBtb2Rlcm4lMjBvZmZpY2V8ZW58MHx8fHwxNzcxNzcxMTYwfDA&ixlib=rb-4.1.0&q=85"
              alt="Professional team meeting"
              className="rounded-2xl shadow-xl w-full object-cover h-[350px]"
              data-testid="about-image"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Solutech Global Consultancy</h2>
            <p className="text-slate-300 text-lg mb-6 leading-relaxed">
              Solutech Global Consultancy is a Kolkata based professional firm providing GST, accounting, taxation, and virtual bookkeeping services to businesses across India and abroad.
            </p>
            <p className="text-slate-300 text-lg leading-relaxed">
              Our objective is simple: reduce compliance burden and improve financial clarity. We work closely with each client to deliver accurate, ethical, and dependable services — tailored to real business needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Who We Work With Section
const ClientsSection = () => {
  return (
    <section className="section-padding bg-blue-600" data-testid="clients-section">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Who We Work With</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {clients.map((client, index) => (
            <div
              key={index}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`client-badge-${index}`}
            >
              {client}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-slate-50" data-testid="testimonials-section">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What Clients Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm card-hover animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`testimonial-${index}`}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-600 italic mb-4">"{testimonial.text}"</p>
              <p className="text-slate-900 font-semibold">— {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
    service: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.reason || !formData.service) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to backend
      const response = await axios.post(`${API}/contact`, formData);
      
      // Send WhatsApp message
      const whatsappMessage = encodeURIComponent(
        `New Contact Form Submission:\n\nName: ${formData.name}\nEmail: ${formData.email}\nService: ${formData.service}\nReason: ${formData.reason}`
      );
      
      // Open WhatsApp with both numbers
      window.open(`https://wa.me/${WHATSAPP_NUMBERS[0].number}?text=${whatsappMessage}`, '_blank');
      
      toast.success(response.data.message);
      
      // Reset form
      setFormData({ name: "", email: "", reason: "", service: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = (number) => {
    const message = encodeURIComponent("Hi, I would like to inquire about your consultancy services.");
    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
  };

  return (
    <section id="contact" className="section-padding bg-white" data-testid="contact-section">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Contact Us</h2>
          <p className="text-lg text-slate-600">Let's simplify your compliance.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-slate-50 p-8 rounded-xl" data-testid="contact-form-container">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Request a Free Consultation</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  data-testid="contact-name-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  data-testid="contact-email-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Service Required</label>
                <Select
                  value={formData.service}
                  onValueChange={(value) => setFormData({ ...formData, service: value })}
                >
                  <SelectTrigger className="h-12 bg-white border-slate-200" data-testid="contact-service-select">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GST Services">GST Services</SelectItem>
                    <SelectItem value="Accounting & Bookkeeping">Accounting & Bookkeeping</SelectItem>
                    <SelectItem value="Income Tax & TDS">Income Tax & TDS</SelectItem>
                    <SelectItem value="Virtual Accountant">Virtual Accountant</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Reason for Contact</label>
                <Textarea
                  placeholder="Tell us how we can help..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="min-h-[120px] bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  data-testid="contact-reason-textarea"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                data-testid="contact-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} className="mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4" data-testid="contact-location">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Location</p>
                    <p className="text-slate-600">Kolkata, India</p>
                  </div>
                </div>
                <div className="flex items-start gap-4" data-testid="contact-phone">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Phone</p>
                    <p className="text-slate-600">+91 70034 95118</p>
                  </div>
                </div>
                <div className="flex items-start gap-4" data-testid="contact-email">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Email</p>
                    <p className="text-slate-600">official.solutechglobal@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Buttons */}
            <div className="bg-slate-50 p-6 rounded-xl" data-testid="whatsapp-section">
              <h4 className="font-bold text-slate-900 mb-4">Connect on WhatsApp</h4>
              <div className="space-y-3">
                {WHATSAPP_NUMBERS.map((wa, index) => (
                  <button
                    key={index}
                    onClick={() => openWhatsApp(wa.number)}
                    className="w-full btn-whatsapp"
                    data-testid={`whatsapp-btn-${index}`}
                  >
                    <MessageCircle size={20} />
                    {wa.display}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white py-12" data-testid="footer">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl">Solutech Global</span>
            </div>
            <p className="text-slate-400">
              Reliable financial and compliance support for businesses that want clarity, accuracy, and peace of mind.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="text-slate-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="#about" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#why-us" className="text-slate-400 hover:text-white transition-colors">Why Choose Us</a></li>
              <li><a href="#contact" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-4">Services</h4>
            <ul className="space-y-2">
              <li className="text-slate-400">GST Compliance</li>
              <li className="text-slate-400">Accounting & Bookkeeping</li>
              <li className="text-slate-400">Income Tax & TDS</li>
              <li className="text-slate-400">Virtual Accountant</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center">
          <p className="text-slate-400">
            © {currentYear} Solutech Global Consultancy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
function App() {
  return (
    <div className="App" data-testid="app">
      <Toaster position="top-right" richColors />
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <WhyChooseUsSection />
        <AboutSection />
        <ClientsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
