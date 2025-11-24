import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { 
  Briefcase, Search, MapPin, Menu, X, PlusCircle, UserCircle, Filter,
  CheckCircle, Building, Sparkles, DollarSign, Crown, Home, Eye, 
  ThumbsUp, MessageSquare, Briefcase as BriefcaseIcon, Lock, Globe, Phone, Upload, Calendar
} from 'lucide-react';
import { Job, JobType, User, Project, Application } from './types';
import { MOCK_JOBS, JOB_TYPES, MOCK_PROJECTS, MOCK_APPLICATIONS, MOCK_EXPERIENCE, MOCK_EDUCATION } from './constants';
import { JobCard } from './components/JobCard';
import { Button } from './components/Button';
import { AIAssistant } from './components/AIAssistant';
import { generateJobDescription, generateCoverLetter } from './services/geminiService';

// --- Shared Components ---

const Navbar: React.FC<{ user: User | null; onLogout: () => void }> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full bg-primary text-white border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-secondary p-1.5 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Career Connect
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/jobs" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">Find Jobs</Link>
              <Link to="/premium" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">Premium</Link>
              <Link to="/projects" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">Projects</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {user.isPremium && (
                  <span className="bg-white/10 text-premium px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Premium
                  </span>
                )}
                <div className="dropdown relative group">
                  <button className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <span className="font-bold">{user.firstName[0]}</span>
                    </div>
                    <span className="text-sm font-medium">{user.firstName}</span>
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 hidden group-hover:block text-slate-800 py-1">
                    <Link to="/dashboard" className="block px-4 py-2 hover:bg-slate-50">Dashboard</Link>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-slate-50">My Profile</Link>
                    <button onClick={onLogout} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-red-600">Logout</button>
                  </div>
                </div>
                {user.role === 'employer' && (
                  <Link to="/post">
                    <Button variant="primary" className="bg-secondary hover:bg-[#2980b9] border-none">Post Job</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                 <Link to="/login" className="text-gray-300 hover:text-white font-medium text-sm">Sign In</Link>
                 <Link to="/register">
                   <Button className="bg-secondary hover:bg-[#2980b9] text-white border-none">Get Started</Button>
                 </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-primary border-t border-white/10 py-4 px-4 space-y-4">
          <Link to="/jobs" className="block text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Find Jobs</Link>
          <Link to="/premium" className="block text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Premium</Link>
          <Link to="/projects" className="block text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Projects</Link>
          <div className="pt-4 border-t border-white/10">
            {user ? (
              <>
                <Link to="/dashboard" className="block text-gray-300 hover:text-white mb-2" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <Link to="/profile" className="block text-gray-300 hover:text-white mb-2" onClick={() => setIsOpen(false)}>Profile</Link>
                <button className="w-full text-left text-red-400" onClick={() => { onLogout(); setIsOpen(false); }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-300 hover:text-white mb-2" onClick={() => setIsOpen(false)}>Sign In</Link>
                <Link to="/register" className="block text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// --- Page Components ---

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521791136064-4296cb0f1c6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary/90"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Connect with Your <span className="text-secondary">Dream Career</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Career Connect bridges the gap between job seekers and employers, enabling seamless recruitment and transparent communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/jobs">
              <Button size="lg" className="bg-secondary hover:bg-[#2980b9] text-white border-none shadow-lg px-8">Find Jobs</Button>
            </Link>
            <Link to="/post">
              <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10 px-8">Post Jobs</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">Why Choose Career Connect?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "Smart Job Search", desc: "Advanced search algorithms match you with the perfect job opportunities based on your skills and preferences." },
              { icon: MessageSquare, title: "Real-time Communication", desc: "Direct messaging and video interviews enable seamless communication between job seekers and employers." },
              { icon: Lock, title: "Trusted Platform", desc: "Verified profiles and secure transactions ensure a safe and reliable job search experience." }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-xl bg-white shadow-md hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
           <h2 className="text-3xl font-bold mb-6">Unlock Premium Features</h2>
           <p className="text-xl text-gray-300 mb-8">Get priority applications, advanced profile visibility, and career coaching sessions.</p>
           <Link to="/premium">
             <Button size="lg" className="bg-premium hover:bg-[#f39c12] text-primary border-none font-bold">Get Premium</Button>
           </Link>
        </div>
      </section>
    </div>
  );
};

const LoginPage = ({ onLogin }: { onLogin: (role: 'jobseeker' | 'employer', email: string) => void }) => {
  const [role, setRole] = useState<'jobseeker' | 'employer'>('jobseeker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role, email);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-100 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-primary">Welcome Back</h2>
          <p className="text-slate-500">Login to your Career Connect account</p>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button 
            onClick={() => setRole('jobseeker')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors border-2 ${role === 'jobseeker' ? 'bg-secondary border-secondary text-white' : 'border-secondary text-secondary'}`}
          >
            Job Seeker
          </button>
          <button 
            onClick={() => setRole('employer')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors border-2 ${role === 'employer' ? 'bg-secondary border-secondary text-white' : 'border-secondary text-secondary'}`}
          >
            Employer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="text-right">
            <a href="#" className="text-sm text-secondary hover:underline">Forgot Password?</a>
          </div>
          <Button type="submit" className="w-full bg-secondary hover:bg-[#2980b9]">Login</Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-slate-500">Don't have an account? <Link to="/register" className="text-secondary font-medium hover:underline">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

const RegisterPage = ({ onRegister }: { onRegister: (user: User) => void }) => {
  const [role, setRole] = useState<'jobseeker' | 'employer'>('jobseeker');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration
    const user: User = {
      id: Math.random().toString(),
      firstName: 'New',
      lastName: 'User',
      email: 'newuser@example.com',
      role: role,
      title: role === 'jobseeker' ? 'Fresher' : 'Recruiter',
      location: 'Remote'
    };
    onRegister(user);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-100 py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-primary">Create Your Account</h2>
          <p className="text-slate-500">Join Career Connect and take the next step</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => setRole('jobseeker')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors border-2 ${role === 'jobseeker' ? 'bg-secondary border-secondary text-white' : 'border-secondary text-secondary'}`}
          >
            Job Seeker
          </button>
          <button 
            onClick={() => setRole('employer')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors border-2 ${role === 'employer' ? 'bg-secondary border-secondary text-white' : 'border-secondary text-secondary'}`}
          >
            Employer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
             {role === 'jobseeker' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                    <input type="text" required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                    <input type="text" required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none" />
                  </div>
                </>
             ) : (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                  <input type="text" required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none" />
                </div>
             )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input type="email" required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none" />
          </div>

          <Button type="submit" className="w-full bg-secondary hover:bg-[#2980b9]">
            Register as {role === 'jobseeker' ? 'Job Seeker' : 'Employer'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-slate-500">Already have an account? <Link to="/login" className="text-secondary font-medium hover:underline">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

const JobSeekerDashboard = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Card */}
      <div className="bg-white rounded-xl p-8 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-slate-100">
          {user.firstName[0]}
        </div>
        <div className="text-center md:text-left flex-1">
          <h2 className="text-2xl font-bold text-primary">{user.firstName} {user.lastName}</h2>
          <p className="text-slate-500">{user.title}</p>
          <p className="text-slate-500 flex items-center justify-center md:justify-start gap-1">
            <MapPin className="w-4 h-4" /> {user.location}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6 text-center w-full md:w-auto">
          <div>
            <div className="text-2xl font-bold text-secondary">12</div>
            <div className="text-xs text-slate-500 uppercase font-semibold">Applied</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary">5</div>
            <div className="text-xs text-slate-500 uppercase font-semibold">Interviews</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary">2</div>
            <div className="text-xs text-slate-500 uppercase font-semibold">Offers</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <h3 className="text-xl font-bold text-primary">Recent Applications</h3>
            <div className="space-y-4">
               {MOCK_APPLICATIONS.map(app => (
                 <div key={app.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-primary">{app.jobTitle}</h4>
                      <p className="text-slate-500 text-sm">{app.companyName}</p>
                      <p className="text-xs text-slate-400 mt-1">Applied: {app.appliedDate}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${app.status === 'Accepted' ? 'bg-green-100 text-green-700' : 
                        app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                        app.status === 'Interview' ? 'bg-blue-100 text-blue-700' : 
                        'bg-yellow-100 text-yellow-700'}`}>
                      {app.status}
                    </span>
                 </div>
               ))}
            </div>
         </div>

         <div>
            <h3 className="text-xl font-bold text-primary mb-4">Recommended Jobs</h3>
            <div className="space-y-4">
              {MOCK_JOBS.slice(0, 3).map(job => (
                <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h4 className="font-bold text-primary truncate">{job.title}</h4>
                  <p className="text-slate-500 text-sm mb-2">{job.company}</p>
                  <p className="text-xs text-slate-400 mb-4">{job.location}</p>
                  <Button size="sm" onClick={() => navigate(`/jobs/${job.id}`)} className="w-full bg-slate-100 text-slate-700 hover:bg-secondary hover:text-white border-none">View Details</Button>
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
};

const EmployerDashboard = ({ user }: { user: User }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
       <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Active Jobs', value: '4', color: 'text-secondary' },
            { label: 'Total Applications', value: '42', color: 'text-green-600' },
            { label: 'Interviews Scheduled', value: '8', color: 'text-purple-600' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
              <div className="text-slate-500 font-medium">{stat.label}</div>
            </div>
          ))}
       </div>

       <div className="bg-white rounded-xl shadow-sm p-6">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-primary">Active Listings</h3>
            <Link to="/post">
              <Button>Post New Job</Button>
            </Link>
         </div>
         <div className="space-y-4">
            {MOCK_JOBS.map(job => (
              <div key={job.id} className="border border-slate-100 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                 <div className="text-center sm:text-left">
                    <h4 className="font-bold text-primary">{job.title}</h4>
                    <p className="text-slate-500 text-sm">{job.location}</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <span className="bg-blue-50 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                      {job.applicantsCount || 0} Applicants
                    </span>
                    <Button variant="outline" size="sm">Manage</Button>
                 </div>
              </div>
            ))}
         </div>
       </div>
    </div>
  );
};

const ProfilePage = ({ user }: { user: User }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-primary text-white rounded-t-xl p-8 pb-12">
        <div className="flex flex-col md:flex-row items-center gap-6">
           <div className="w-32 h-32 bg-white rounded-full p-1">
              <div className="w-full h-full bg-secondary rounded-full flex items-center justify-center text-4xl font-bold">
                 {user.firstName[0]}
              </div>
           </div>
           <div className="text-center md:text-left">
             <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
             <p className="text-xl opacity-90 mb-2">{user.title}</p>
             <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm opacity-80">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {user.location}</span>
                <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {user.website || 'Add website'}</span>
                <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {user.phone || 'Add phone'}</span>
             </div>
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-[-20px] px-4">
         <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
               <h3 className="text-lg font-bold text-primary mb-4">About Me</h3>
               <p className="text-slate-600 leading-relaxed">
                 {user.about || "Passionate professional with over 5 years of experience in the industry. Dedicated to building high-quality solutions and fostering team growth."}
               </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
               <h3 className="text-lg font-bold text-primary mb-4">Experience</h3>
               <div className="space-y-6">
                 {MOCK_EXPERIENCE.map(exp => (
                   <div key={exp.id} className="border-l-2 border-slate-200 pl-4">
                      <h4 className="font-bold text-primary">{exp.title}</h4>
                      <p className="text-secondary font-medium">{exp.company}</p>
                      <p className="text-xs text-slate-400 mb-2">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                      <p className="text-sm text-slate-600">{exp.description}</p>
                   </div>
                 ))}
               </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
               <h3 className="text-lg font-bold text-primary mb-4">Education</h3>
               <div className="space-y-4">
                 {MOCK_EDUCATION.map(edu => (
                   <div key={edu.id}>
                      <h4 className="font-bold text-primary">{edu.degree}</h4>
                      <p className="text-slate-600">{edu.institution}</p>
                      <p className="text-xs text-slate-400">{edu.startDate} - {edu.endDate}</p>
                   </div>
                 ))}
               </div>
            </div>
         </div>

         <div className="space-y-6">
           <div className="bg-white p-6 rounded-xl shadow-sm pt-10">
              <h3 className="text-lg font-bold text-primary mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                 {(user.skills || ['React', 'TypeScript', 'Node.js', 'UI/UX', 'Tailwind']).map((skill, i) => (
                   <span key={i} className="px-3 py-1 bg-slate-100 text-secondary rounded-full text-sm font-medium">
                     {skill}
                   </span>
                 ))}
              </div>
           </div>
           
           <div className="bg-white p-6 rounded-xl shadow-sm">
             <h3 className="text-lg font-bold text-primary mb-4">Contact</h3>
             <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                     <UserCircle className="w-4 h-4" />
                   </div>
                   <div>
                     <p className="font-medium text-primary">Email</p>
                     <p>{user.email}</p>
                   </div>
                </div>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
};

const PremiumPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-r from-premium to-[#f39c12] text-white py-20 text-center px-4">
         <span className="inline-flex items-center gap-2 bg-white/20 px-4 py-1 rounded-full text-sm font-bold mb-6 backdrop-blur-sm">
            <Crown className="w-4 h-4" /> Premium Features
         </span>
         <h1 className="text-4xl md:text-5xl font-bold mb-4">Unlock Your Career Potential</h1>
         <p className="text-xl opacity-90 max-w-2xl mx-auto">Get access to exclusive features and accelerate your job search.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
           {[
             { icon: Sparkles, title: "Priority Applications", desc: "Get your applications seen first by employers." },
             { icon: Eye, title: "Profile Visibility", desc: "Increased visibility to top employers and recruiters." },
             { icon: Building, title: "Skill Assessments", desc: "Showcase your skills with verified assessments." }
           ].map((feature, i) => (
             <div key={i} className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="w-16 h-16 bg-premium/10 rounded-full flex items-center justify-center mx-auto mb-6">
                   <feature.icon className="w-8 h-8 text-premium" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{feature.title}</h3>
                <p className="text-slate-500">{feature.desc}</p>
             </div>
           ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
           {/* Basic Plan */}
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-primary">Basic</h3>
              <div className="text-4xl font-bold text-primary my-4">Free</div>
              <ul className="space-y-3 mb-8">
                 <li className="flex items-center gap-2 text-slate-600"><CheckCircle className="w-5 h-5 text-green-500" /> Basic Job Search</li>
                 <li className="flex items-center gap-2 text-slate-600"><CheckCircle className="w-5 h-5 text-green-500" /> Profile Creation</li>
                 <li className="flex items-center gap-2 text-slate-600"><CheckCircle className="w-5 h-5 text-green-500" /> Email Notifications</li>
              </ul>
              <Button variant="outline" className="w-full">Current Plan</Button>
           </div>

           {/* Premium Plan */}
           <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-premium relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-premium text-white px-4 py-1 rounded-full text-sm font-bold">Most Popular</div>
              <h3 className="text-xl font-bold text-primary">Premium</h3>
              <div className="text-4xl font-bold text-premium my-4">$12<span className="text-lg text-slate-400 font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8">
                 <li className="flex items-center gap-2 text-slate-600"><CheckCircle className="w-5 h-5 text-premium" /> Priority Applications</li>
                 <li className="flex items-center gap-2 text-slate-600"><CheckCircle className="w-5 h-5 text-premium" /> Advanced Job Matching</li>
                 <li className="flex items-center gap-2 text-slate-600"><CheckCircle className="w-5 h-5 text-premium" /> Career Coaching</li>
                 <li className="flex items-center gap-2 text-slate-600"><CheckCircle className="w-5 h-5 text-premium" /> Salary Insights</li>
              </ul>
              <Button className="w-full bg-premium hover:bg-[#f39c12] text-white border-none">Upgrade Now</Button>
           </div>

           {/* Enterprise Plan */}
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-primary">Enterprise</h3>
              <div className="text-4xl font-bold text-primary my-4">$49<span className="text-lg text-slate-400 font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8">
                 <li className="flex items-center gap-2 text-slate-600"><CheckCircle className="w-5 h-5 text-green-500" /> All Premium Features</li>
                 <li className="flex items-center gap-2 text-slate-600"><CheckCircle className="w-5 h-5 text-green-500" /> Dedicated Support</li>
                 <li className="flex items-center gap-2 text-slate-600"><CheckCircle className="w-5 h-5 text-green-500" /> Team Collaboration</li>
              </ul>
              <Button variant="outline" className="w-full">Contact Sales</Button>
           </div>
        </div>
      </div>
    </div>
  );
};

const AddProjectPage = ({ onAdd }: { onAdd: (project: Project) => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: Math.random().toString(),
      title,
      description,
      technologies: technologies.split(',').map(t => t.trim()),
      imageUrl: `https://picsum.photos/seed/${Math.random()}/400/200`,
      stats: { views: 0, likes: 0, comments: 0 }
    };
    onAdd(newProject);
    navigate('/projects');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-primary mb-6">Add New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
             <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-secondary" />
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
             <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-secondary" />
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Technologies (comma separated)</label>
             <input required value={technologies} onChange={e => setTechnologies(e.target.value)} placeholder="React, Node.js, etc." className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-secondary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project File / Image</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-secondary cursor-pointer transition-colors">
               <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
               <p className="text-sm text-slate-500">Click to upload project thumbnail or documents</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input type="date" className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-secondary" />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                <input type="date" className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-secondary" />
             </div>
          </div>
          <Button type="submit" className="w-full bg-secondary hover:bg-[#2980b9]">Add Project</Button>
        </form>
      </div>
    </div>
  );
};

const ProjectsPage = ({ projects }: { projects: Project[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.technologies.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50">
       <div className="bg-gradient-to-r from-primary to-[#34495e] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
             <div>
                <h1 className="text-4xl font-bold mb-2">Project Highlights</h1>
                <p className="text-gray-300">Showcase your work and demonstrate your skills</p>
             </div>
             <Link to="/add-project">
               <Button className="bg-premium hover:bg-[#f39c12] text-white border-none">Add New Project</Button>
             </Link>
          </div>
       </div>

       <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white p-4 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
             <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search projects by title or technology..." 
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-secondary"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <button className="px-4 py-2 bg-secondary text-white rounded-lg whitespace-nowrap">All Projects</button>
                <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg whitespace-nowrap">Web Dev</button>
                <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg whitespace-nowrap">Mobile</button>
                <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg whitespace-nowrap">Data Science</button>
             </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {filteredProjects.map(project => (
               <div key={project.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  <div className="h-48 overflow-hidden bg-slate-200">
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                     <h3 className="text-xl font-bold text-primary mb-2">{project.title}</h3>
                     <p className="text-slate-500 text-sm mb-4 line-clamp-2">{project.description}</p>
                     <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((t, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-50 text-secondary text-xs font-medium rounded-full">{t}</span>
                        ))}
                     </div>
                     
                     <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                        <div className="flex gap-4 text-slate-400 text-sm">
                           <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {project.stats.views}</span>
                           <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" /> {project.stats.likes}</span>
                        </div>
                        <Button size="sm" variant="outline">View Details</Button>
                     </div>
                  </div>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
};

const JobsPage = ({ jobs }: { jobs: Job[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const navigate = useNavigate();

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || job.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-primary rounded-2xl p-8 mb-10 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Find Your Perfect Role</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search job title or company..." 
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-slate-900 border-none outline-none focus:ring-2 focus:ring-secondary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
             <select 
               className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-slate-900 border-none outline-none appearance-none cursor-pointer"
               value={selectedType}
               onChange={(e) => setSelectedType(e.target.value)}
             >
               <option value="All">All Job Types</option>
               {JOB_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
             </select>
          </div>
          <Button className="w-full bg-secondary hover:bg-[#2980b9] h-full text-lg border-none">Search</Button>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <JobCard key={job.id} job={job} onClick={(id) => navigate(`/jobs/${id}`)} />
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No jobs found matching your criteria.</p>
            <Button variant="outline" className="mt-4" onClick={() => {setSearchTerm(''); setSelectedType('All')}}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Post Job, Job Detail Reuse existing components but styled ---

const PostJobPage = ({ onPost }: { onPost: (job: Job) => void }) => {
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');
  const [showAI, setShowAI] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: Job = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      company: 'Demo Company Inc.',
      location: 'Remote',
      type: JobType.FULL_TIME,
      salaryRange: '$Competitive',
      description,
      requirements: skills.split(',').map(s => s.trim()),
      postedAt: 'Just now',
      logoUrl: 'https://picsum.photos/48/48'
    };
    onPost(newJob);
    navigate('/jobs');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {showAI && (
        <AIAssistant 
          title="AI Job Description Generator"
          onClose={() => setShowAI(false)}
          onAccept={(text) => {
            setDescription(text);
            setShowAI(false);
          }}
          generatorFn={() => generateJobDescription(title, skills)}
        />
      )}

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">Post a New Job</h1>
          <p className="text-slate-500">Fill in the details below to create your job listing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title</label>
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-secondary outline-none transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Required Skills (Comma separated)</label>
              <input 
                value={skills} 
                onChange={e => setSkills(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-secondary outline-none transition-all"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-700">Job Description</label>
                <button 
                  type="button"
                  onClick={() => setShowAI(true)}
                  disabled={!title || !skills}
                  className="text-xs flex items-center gap-1.5 font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1.5 rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Sparkles className="w-3 h-3" /> Generate with AI
                </button>
              </div>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-secondary outline-none transition-all resize-none"
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full bg-secondary hover:bg-[#2980b9] text-white">Post Job Now</Button>
        </form>
      </div>
    </div>
  );
};

const JobDetailPage = ({ jobs }: { jobs: Job[] }) => {
  const { id } = useParams();
  const job = jobs.find(j => j.id === id);
  const [showAI, setShowAI] = useState(false);
  const [applicationText, setApplicationText] = useState('');
  const [hasApplied, setHasApplied] = useState(false);

  if (!job) return <div className="p-8 text-center">Job not found</div>;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setHasApplied(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {showAI && (
        <AIAssistant 
          title="AI Cover Letter Generator"
          onClose={() => setShowAI(false)}
          onAccept={(text) => {
            setApplicationText(text);
            setShowAI(false);
          }}
          generatorFn={() => generateCoverLetter(job.title, job.company, "React, TypeScript, Frontend Development")}
        />
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
        <div className="p-8 border-b border-slate-100">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4">
              <img 
                src={job.logoUrl} 
                alt={job.company} 
                className="w-20 h-20 rounded-xl object-cover border border-slate-100"
              />
              <div>
                <h1 className="text-2xl font-bold text-primary mb-1">{job.title}</h1>
                <p className="text-lg text-slate-600 font-medium">{job.company}</p>
              </div>
            </div>
            {hasApplied ? (
              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Applied
              </span>
            ) : (
              <Button size="lg" onClick={() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth'})} className="bg-secondary hover:bg-[#2980b9]">
                Apply Now
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-6 text-slate-500">
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {job.location}</span>
            <span className="flex items-center gap-2"><BriefcaseIcon className="w-4 h-4"/> {job.type}</span>
            <span className="flex items-center gap-2"><DollarSign className="w-4 h-4"/> {job.salaryRange}</span>
          </div>
        </div>

        <div className="p-8">
            <section className="mb-8">
              <h2 className="text-lg font-bold text-primary mb-4">Description</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-lg font-bold text-primary mb-4">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                {job.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </section>

            {!hasApplied && (
              <section id="apply-form" className="pt-8 border-t border-slate-100">
                <h2 className="text-xl font-bold text-primary mb-6">Submit your Application</h2>
                <form onSubmit={handleApply} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <input required type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary outline-none" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input required type="email" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary outline-none" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-slate-700">Cover Letter</label>
                      <button 
                        type="button" 
                        onClick={() => setShowAI(true)}
                        className="text-xs font-semibold text-secondary flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                      >
                        <Sparkles className="w-3 h-3" /> Draft with AI
                      </button>
                    </div>
                    <textarea 
                      required 
                      value={applicationText}
                      onChange={(e) => setApplicationText(e.target.value)}
                      className="w-full p-3 border rounded-lg h-40 focus:ring-2 focus:ring-secondary outline-none" 
                      placeholder="Why are you a good fit for this role?" 
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 text-lg bg-secondary hover:bg-[#2980b9]">Send Application</Button>
                </form>
              </section>
            )}
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  const handleLogin = (role: 'jobseeker' | 'employer', email: string) => {
    setUser({
      id: 'u1',
      firstName: 'John',
      lastName: 'Doe',
      email: email,
      role: role,
      title: role === 'jobseeker' ? 'Senior Frontend Engineer' : 'HR Manager',
      location: 'New York, USA',
      isPremium: true,
      skills: ['React', 'TypeScript', 'Tailwind', 'Node.js']
    });
  };

  const handleRegister = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handlePostJob = (job: Job) => {
    setJobs([job, ...jobs]);
  };

  const handleAddProject = (project: Project) => {
    setProjects([project, ...projects]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar user={user} onLogout={handleLogout} />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage jobs={jobs} />} />
          <Route path="/jobs/:id" element={<JobDetailPage jobs={jobs} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />
          
          <Route path="/dashboard" element={
            user ? (
              user.role === 'jobseeker' ? <JobSeekerDashboard user={user} /> : <EmployerDashboard user={user} />
            ) : <Navigate to="/login" />
          } />
          
          <Route path="/profile" element={user ? <ProfilePage user={user} /> : <Navigate to="/login" />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/projects" element={<ProjectsPage projects={projects} />} />
          <Route path="/add-project" element={
            user ? <AddProjectPage onAdd={handleAddProject} /> : <Navigate to="/login" />
          } />
          
          <Route 
            path="/post" 
            element={
              user && user.role === 'employer' ? (
                <PostJobPage onPost={handlePostJob} />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                   <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                      <Briefcase className="w-8 h-8 text-slate-500" />
                   </div>
                   <h2 className="text-2xl font-bold text-primary mb-2">Employer Access Required</h2>
                   <p className="text-slate-500 mb-8 max-w-sm">You need to be logged in as an employer to post new job opportunities.</p>
                   <Link to="/login">
                     <Button size="lg" className="bg-secondary">Sign In as Employer</Button>
                   </Link>
                </div>
              )
            } 
          />
        </Routes>

        <footer className="bg-primary text-gray-300 py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="grid md:grid-cols-3 gap-8 mb-8">
               <div>
                 <h5 className="text-white font-bold mb-4">Career Connect</h5>
                 <p className="text-sm">Bridging the gap between job seekers and employers through innovative technology.</p>
               </div>
               <div>
                 <h5 className="text-white font-bold mb-4">Quick Links</h5>
                 <ul className="space-y-2 text-sm">
                   <li><Link to="/jobs" className="hover:text-white">Find Jobs</Link></li>
                   <li><Link to="/premium" className="hover:text-white">Premium</Link></li>
                   <li><Link to="/projects" className="hover:text-white">Projects</Link></li>
                 </ul>
               </div>
               <div>
                 <h5 className="text-white font-bold mb-4">Contact</h5>
                 <ul className="space-y-2 text-sm">
                   <li>support@careerconnect.com</li>
                   <li>+1 (555) 123-4567</li>
                 </ul>
               </div>
             </div>
             <div className="border-t border-white/10 pt-8 text-center text-sm">
                <p>&copy; 2024 Career Connect. All rights reserved.</p>
             </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
