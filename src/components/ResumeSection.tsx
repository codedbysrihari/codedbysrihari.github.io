import React from 'react';
import { Download, FileText, ExternalLink, Award, Briefcase, GraduationCap, Code, Brain } from 'lucide-react';

const ResumeSection: React.FC = () => {
  const handleDownloadResume = () => {
    try {
      // Using the actual resume filename from the public folder
      const resumeUrl = '/Srihari_Resume.pdf';
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = 'Srihari_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Error downloading resume. Please try again or contact me directly.');
    }
  };

  const handleViewResume = () => {
    try {
      // Open resume in new tab with the correct filename
      const resumeUrl = '/Srihari_Resume.pdf';
      
      // Try to open in new tab first
      const newWindow = window.open(resumeUrl, '_blank');
      if (!newWindow) {
        // Fallback: try to open in same tab
        window.location.href = resumeUrl;
      }
    } catch (error) {
      console.error('Error opening resume:', error);
      // Fallback: try to download instead
      handleDownloadResume();
    }
  };

  return (
    <section id="resume" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Resume
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Download my detailed resume to learn more about my experience, skills, and achievements
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Resume Preview */}
          <div className="space-y-8">
            <div className="group p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mr-4">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Professional Resume</h3>
                  <p className="text-purple-400">Comprehensive Overview</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <GraduationCap className="w-5 h-5 text-purple-400 mr-3" />
                  <span>B.Tech CSE - AI/ML Specialization</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Briefcase className="w-5 h-5 text-blue-400 mr-3" />
                  <span>Technology Team Lead & Educator</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Code className="w-5 h-5 text-green-400 mr-3" />
                  <span>Full Stack Developer</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Brain className="w-5 h-5 text-pink-400 mr-3" />
                  <span>AI/ML Enthusiast</span>
                </div>
              </div>
            </div>
            
            <div className="group p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mr-4">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Key Highlights</h3>
                  <p className="text-blue-400">What You'll Find</p>
                </div>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Detailed work experience and leadership roles</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Technical skills and proficiency levels</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Educational background and achievements</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Projects and contributions</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Download Section */}
          <div className="flex flex-col items-center justify-center space-y-8">
            <div className="text-center mb-8">
              <div className="w-64 h-80 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl p-1 animate-pulse">
                <div className="w-full h-full bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl flex items-center justify-center p-8">
                  <div className="text-center">
                    <FileText size={80} className="text-purple-400 mx-auto mb-6 animate-bounce" />
                    <h3 className="text-2xl font-bold text-white mb-2">Resume</h3>
                    <p className="text-purple-400 font-medium">Professional Overview</p>
                    <div className="flex justify-center space-x-2 mt-4">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
              <button
                onClick={handleDownloadResume}
                className="flex-1 flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 font-semibold"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF
              </button>
              
              <button
                onClick={handleViewResume}
                className="flex-1 flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 font-semibold"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                View Online
              </button>
            </div>
            
            <p className="text-gray-400 text-center text-sm max-w-xs">
              Click to download my resume in PDF format or view it online in your browser
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeSection;
