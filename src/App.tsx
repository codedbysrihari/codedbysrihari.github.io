import React, { useState, useEffect } from 'react';
import { ChevronDown, Github, Linkedin, Mail, Code, Brain, Users, Award, ExternalLink, Menu, X, MessageCircle, Send, Star, Zap, Rocket, Globe, Database, Cpu, Smartphone } from 'lucide-react';
import ResumeSection from './components/ResumeSection';
import ProjectsSection from './components/ProjectsSection';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatName, setChatName] = useState('');
  const [chatEmail, setChatEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const sections = ['home', 'about', 'certifications', 'experience', 'skills', 'projects', 'resume', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Message sent successfully! I\'ll get back to you soon.');
    setChatMessage('');
    setChatName('');
    setChatEmail('');
    setIsChatOpen(false);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 animate-gradient-x"></div>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-30 animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Cursor Follower */}
      <div
        className="fixed w-6 h-6 bg-purple-500/30 rounded-full pointer-events-none z-50 transition-transform duration-100 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `scale(${activeSection === 'home' ? 1.5 : 1})`
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/10 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              SRIHARI
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              {['home', 'about', 'certifications', 'experience', 'skills', 'projects', 'resume', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`px-6 py-3 rounded-full capitalize transition-all duration-300 font-medium ${
                    activeSection === section 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-black/20 backdrop-blur-xl border-t border-white/10">
            <div className="px-6 py-4 space-y-2">
              {['home', 'about', 'certifications', 'experience', 'skills', 'projects', 'resume', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="block w-full text-left px-4 py-3 rounded-xl capitalize hover:bg-white/10 transition-all duration-300"
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="text-center z-10 max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/10 mb-8">
              <Star className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-sm font-medium">Available for opportunities</span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black mb-6 leading-none">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
                SRIHARI
              </span>
            </h1>
            
            <div className="text-3xl md:text-4xl font-bold text-gray-300 mb-6">
              Software Engineer & Full-Stack Developer
            </div>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Innovative and results-driven Software Engineer with expertise in architecting, developing, and deploying
              high-performance cross-platform applications. Proficient in React Native, React.js, ASP.NET Core, and SQL Server.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-green-300 text-sm font-medium">Software Engineer Intern</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                <span className="text-blue-300 text-sm font-medium">Live Mobile App</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                <span className="text-purple-300 text-sm font-medium">200+ Active Users</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <a
              href="https://www.linkedin.com/in/srihari-k-8275852a2/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              <Linkedin className="w-6 h-6 mr-3" />
              <span className="font-semibold">LinkedIn</span>
            </a>
            
            <a
              href="mailto:harikarthikselvam@gmail.com"
              className="group flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
            >
              <Mail className="w-6 h-6 mr-3" />
              <span className="font-semibold">Email</span>
            </a>
            
            <a
              href="https://codedbysrihari.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/25"
            >
              <Github className="w-6 h-6 mr-3" />
              <span className="font-semibold">GitHub</span>
            </a>
          </div>
          
          <button
            onClick={() => scrollToSection('about')}
            className="animate-bounce text-purple-400 hover:text-purple-300 transition-colors p-4 rounded-full hover:bg-white/10"
          >
            <ChevronDown size={32} />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              About Me
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Passionate about creating innovative solutions at the intersection of AI/ML and web development
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="group p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mr-4">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Education</h3>
                    <p className="text-purple-400">Academic Excellence</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-lg font-semibold text-gray-200">SRM University, Ramapuram Campus, Chennai</p>
                  <p className="text-gray-300">B.Tech Computer Science Engineering</p>
                  <p className="text-gray-300">Specialization: Artificial Intelligence & Machine Learning</p>
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full">
                    <span className="text-purple-400 font-medium">Expected May 2028</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-gray-400">• High School: Velammal Vidhyashram, Dindigul (Mar 2024)</p>
                    <p className="text-sm text-gray-400">• Relevant Courses: Data Structures, Algorithms, ML, Deep Learning</p>
                  </div>
                </div>
              </div>
              
              <div className="group p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mr-4">
                    <Rocket className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Current Focus</h3>
                    <p className="text-blue-400">Innovation & Growth</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-300 leading-relaxed">
                    Currently focused on cross-platform mobile development with React Native and full-stack solutions using ASP.NET Core. 
                    Passionate about creating scalable applications that solve real-world problems in education and nonprofit sectors.
                  </p>
                  <div className="pt-2">
                    <p className="text-sm text-gray-400">• Cross-Platform Mobile Development</p>
                    <p className="text-sm text-gray-400">• Full-Stack Web Applications</p>
                    <p className="text-sm text-gray-400">• AI/ML Specialization</p>
                    <p className="text-sm text-gray-400">• Technical Mentorship</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-96 h-96 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full p-1 animate-spin-slow">
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 to-purple-900 rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="relative mb-6">
                        <Code size={80} className="text-purple-400 mx-auto animate-pulse" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Full Stack Developer</h3>
                      <p className="text-purple-400 font-medium">AI/ML Enthusiast</p>
                      <div className="flex justify-center space-x-2 mt-4">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Achievements Section */}
      <section id="certifications" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Certifications & Achievements
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Professional certifications and recognition for technical excellence
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mr-4">
                  <Code className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Intro to Programming</h3>
                  <p className="text-blue-400">Kaggle Certificate</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Completed comprehensive programming fundamentals course covering core concepts and best practices
              </p>
              <div className="flex items-center text-blue-400 text-sm">
                <span>Platform: Kaggle</span>
              </div>
            </div>
            
            <div className="group p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mr-4">
                  <Brain className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Python</h3>
                  <p className="text-green-400">Kaggle Certificate</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Mastered Python programming language fundamentals and advanced concepts for data science
              </p>
              <div className="flex items-center text-green-400 text-sm">
                <span>Platform: Kaggle</span>
              </div>
            </div>
            
            <div className="group p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mr-4">
                  <Brain className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Intro to Machine Learning</h3>
                  <p className="text-purple-400">Kaggle Certificate</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Completed comprehensive introduction to machine learning algorithms and data science principles
              </p>
              <div className="flex items-center text-purple-400 text-sm">
                <span>Platform: Kaggle</span>
              </div>
            </div>
            
            <div className="group p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl mr-4">
                  <Database className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Pandas</h3>
                  <p className="text-yellow-400">Kaggle Certificate</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Mastered data manipulation and analysis using Python's powerful Pandas library
              </p>
              <div className="flex items-center text-yellow-400 text-sm">
                <span>Platform: Kaggle</span>
              </div>
            </div>
            

          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Experience
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Professional experience in software engineering and technical mentorship
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group p-10 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="flex items-center mb-8">
                <div className="p-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mr-6">
                  <Users className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">Software Engineer Intern</h3>
                  <p className="text-green-400 text-lg font-medium">Agoura Math Circle</p>
                  <p className="text-green-300 text-sm">Dec 2024 - Present</p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300 text-lg leading-relaxed">
                  Agoura Math Circle is a free, nonprofit STEM education initiative empowering middle and high school students with
                  problem-solving skills, competitive exam preparation, and STEM career exposure through onsite and online programs.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">• Engineered and deployed production-grade cross-platform mobile app (Android & iOS) using React Native</p>
                  <p className="text-sm text-gray-400">• Integrated with ASP.NET Core Web API and SQL Server, serving 200+ students</p>
                  <p className="text-sm text-gray-400">• Reduced manual attendance and performance tracking time by 80% through backend automation</p>
                  <p className="text-sm text-gray-400">• Designed modular UI components ensuring scalability, reusability, and maintainability</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center text-green-400 hover:text-green-300 transition-colors">
                  <ExternalLink size={18} className="mr-2" />
                  <a href="https://agouramathcircle.org" target="_blank" rel="noopener noreferrer" className="font-medium">
                    Visit Organization
                  </a>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>
            </div>
            
            <div className="group p-10 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="flex items-center mb-8">
                <div className="p-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mr-6">
                  <Zap className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">Technical Mentor</h3>
                  <p className="text-orange-400 text-lg font-medium">Global Volunteer</p>
                  <p className="text-orange-300 text-sm">Ongoing</p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300 text-lg leading-relaxed">
                  Delivering global training sessions on React Native full-stack development, focusing on UI/UX design 
                  principles, API integration workflows, and deployment strategies.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">• Delivered global training sessions on React Native full-stack development</p>
                  <p className="text-sm text-gray-400">• Focused on UI/UX design principles, API integration workflows, and deployment strategies</p>
                  <p className="text-sm text-gray-400">• Mentored developers in mobile-first architecture and advanced state management</p>
                  <p className="text-sm text-gray-400">• Performance optimization for scalable applications</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center text-orange-400 hover:text-orange-300 transition-colors">
                  <ExternalLink size={18} className="mr-2" />
                  <a href="https://agouramathcircle.org" target="_blank" rel="noopener noreferrer" className="font-medium">
                    View Projects
                  </a>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Skills & Technologies
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive skills in cross-platform development, backend systems, and modern technologies
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group p-10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="text-center mb-8">
                <div className="inline-flex p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl mb-6">
                  <Code size={48} />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Frontend Development</h3>
              </div>
              <div className="space-y-6">
                {[
                  { skill: 'React.js', level: 90 },
                  { skill: 'React Native', level: 85 },
                  { skill: 'TypeScript', level: 80 },
                  { skill: 'Tailwind CSS', level: 95 },
                  { skill: 'JavaScript (ES6+)', level: 90 },
                  { skill: 'HTML5/CSS3', level: 95 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300 font-medium">{item.skill}</span>
                      <span className="text-blue-400 font-bold">{item.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${item.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="group p-10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="text-center mb-8">
                <div className="inline-flex p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl mb-6">
                  <Brain size={48} />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">AI/ML & Data Science</h3>
              </div>
              <div className="space-y-6">
                {[
                  { skill: 'Python', level: 85 },
                  { skill: 'Java', level: 80 },
                  { skill: 'C', level: 75 },
                  { skill: 'MATLAB', level: 70 },
                  { skill: 'C#', level: 80 },
                  { skill: 'AI/ML Specialization', level: 85 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300 font-medium">{item.skill}</span>
                      <span className="text-purple-400 font-bold">{item.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${item.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="group p-10 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-orange-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10">
              <div className="text-center mb-8">
                <div className="inline-flex p-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl mb-6">
                  <Database size={48} />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Backend Development</h3>
              </div>
              <div className="space-y-6">
                {[
                  { skill: 'ASP.NET Core', level: 85 },
                  { skill: 'SQL Server', level: 80 },
                  { skill: 'MongoDB', level: 70 },
                  { skill: 'Oracle', level: 65 },
                  { skill: 'REST APIs', level: 85 },
                  { skill: 'Node.js', level: 75 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300 font-medium">{item.skill}</span>
                      <span className="text-orange-400 font-bold">{item.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${item.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="group p-10 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-indigo-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/10">
              <div className="text-center mb-8">
                <div className="inline-flex p-6 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-3xl mb-6">
                  <Smartphone size={48} />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Mobile Development</h3>
              </div>
              <div className="space-y-6">
                {[
                  { skill: 'React Native', level: 90 },
                  { skill: 'Cross-platform', level: 85 },
                  { skill: 'Mobile UI/UX', level: 80 },
                  { skill: 'App Store Deployment', level: 75 },
                  { skill: 'Mobile Testing', level: 75 },
                  { skill: 'Real-time Sync', level: 85 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300 font-medium">{item.skill}</span>
                      <span className="text-indigo-400 font-bold">{item.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${item.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="group p-10 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-green-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10">
              <div className="text-center mb-8">
                <div className="inline-flex p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl mb-6">
                  <Users size={48} />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Leadership & Tools</h3>
              </div>
              <div className="space-y-6">
                {[
                  { skill: 'Technical Mentorship', level: 90 },
                  { skill: 'Project Management', level: 85 },
                  { skill: 'Product Architecture', level: 80 },
                  { skill: 'Git & GitHub', level: 90 },
                  { skill: 'Docker', level: 75 },
                  { skill: 'Prompt Engineering', level: 80 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300 font-medium">{item.skill}</span>
                      <span className="text-green-400 font-bold">{item.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${item.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <ProjectsSection />

      {/* Resume Section */}
      <ResumeSection />

      {/* Contact Section */}
      <section id="contact" className="py-32 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Let's Connect
          </h2>
          <p className="text-2xl text-gray-300 mb-16">
            Ready to collaborate and create something amazing together!
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <a
              href="https://www.linkedin.com/in/srihari-k-8275852a2/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-8 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <Linkedin size={48} className="mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-bold text-white mb-2">LinkedIn</h3>
              <p className="text-gray-400">Professional Network</p>
            </a>
            
            <a
              href="mailto:harikarthikselvam@gmail.com"
              className="group p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              <Mail size={48} className="mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-bold text-white mb-2">Email</h3>
              <p className="text-gray-400">Direct Contact</p>
            </a>
            
            <button
              onClick={() => setIsChatOpen(true)}
              className="group p-8 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-green-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10"
            >
              <MessageCircle size={48} className="mx-auto mb-4 text-green-400" />
              <h3 className="text-xl font-bold text-white mb-2">Chat</h3>
              <p className="text-gray-400">Quick Message</p>
            </button>
          </div>
        </div>
      </section>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 p-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-purple-500/25 z-40 animate-pulse"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Send me a message</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleChatSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Your name"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  required
                  className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 focus:border-purple-500 focus:outline-none text-white placeholder-gray-400 transition-all duration-300"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your email"
                  value={chatEmail}
                  onChange={(e) => setChatEmail(e.target.value)}
                  required
                  className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 focus:border-purple-500 focus:outline-none text-white placeholder-gray-400 transition-all duration-300"
                />
              </div>
              <div>
                <textarea
                  placeholder="Your message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  required
                  rows={4}
                  className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 focus:border-purple-500 focus:outline-none text-white placeholder-gray-400 resize-none transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send size={20} className="mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 text-center border-t border-white/10">
        <p className="text-gray-400 text-lg">
          &copy; 2024 Srihari. Built with React, Vite & SWC for optimal performance.
        </p>
      </footer>
    </div>
  );
}

export default App;