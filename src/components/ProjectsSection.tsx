import React, { useState } from 'react';
import { ExternalLink, Github, Code, Brain, Globe, Zap, Star, Eye, Database, Users } from 'lucide-react';

const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const projects = [
    {
      id: 1,
      title: "Agoura Math Circle Mobile & Web Platforms",
      description: "Designed and developed a secure academic management system using React Native, React.js, ASP.NET Core, and SQL Server with real-time synchronization, benefiting over 200 active users.",
      category: "mobile",
      technologies: ["React Native", "React.js", "ASP.NET Core", "SQL Server"],
      image: "/agoura-math.jpg",
      github: "https://github.com/srihari/agoura-math-circle",
      live: "https://agouramathcircle.org",
      featured: true,
      icon: Globe
    },
    {
      id: 2,
      title: "Personal Portfolio Website",
      description: "Built and deployed a responsive portfolio using React.js and Tailwind CSS with backend integration hosted on Vercel.",
      category: "web",
      technologies: ["React.js", "TypeScript", "Tailwind CSS", "Vite"],
      image: "/portfolio-preview.jpg",
      github: "https://github.com/srihari/portfolio",
      live: "https://codedbysrihari.github.io/",
      featured: true,
      icon: Code
    },
    {
      id: 3,
      title: "Cross-Platform Mobile App",
      description: "Production-grade cross-platform mobile app (Android & iOS) with real-time data synchronization and modular UI components.",
      category: "mobile",
      technologies: ["React Native", "ASP.NET Core", "SQL Server", "Real-time Sync"],
      image: "/mobile-app.jpg",
      github: null,
      live: null,
      featured: false,
      icon: Code
    },
    {
      id: 4,
      title: "React-Based Web Platform",
      description: "Web platform leveraging shared backend with optimized API workflows and synchronized mobile-web data integration.",
      category: "web",
      technologies: ["React.js", "ASP.NET Core", "REST APIs", "Data Sync"],
      image: "/web-platform.jpg",
      github: null,
      live: null,
      featured: false,
      icon: Globe
    },
    {
      id: 5,
      title: "Academic Management System",
      description: "Backend automation system reducing manual attendance and performance tracking time by 80% through real-time synchronization.",
      category: "backend",
      technologies: ["ASP.NET Core", "SQL Server", "Automation", "Real-time"],
      image: "/academic-system.jpg",
      github: null,
      live: null,
      featured: false,
      icon: Database
    },
    {
      id: 6,
      title: "Technical Training Platform",
      description: "Global training sessions on React Native full-stack development, UI/UX design principles, and deployment strategies.",
      category: "education",
      technologies: ["React Native", "Training", "Mentorship", "Global"],
      image: "/training-platform.jpg",
      github: null,
      live: null,
      featured: false,
      icon: Users
    }
  ];

  const categories = [
    { id: 'all', name: 'All Projects', count: projects.length },
    { id: 'web', name: 'Web Development', count: projects.filter(p => p.category === 'web').length },
    { id: 'mobile', name: 'Mobile Apps', count: projects.filter(p => p.category === 'mobile').length },
    { id: 'backend', name: 'Backend Systems', count: projects.filter(p => p.category === 'backend').length },
    { id: 'education', name: 'Education & Training', count: projects.filter(p => p.category === 'education').length }
  ];

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  return (
    <section id="projects" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Showcasing innovative solutions across mobile development, web applications, and educational technology
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const IconComponent = project.icon;
            return (
              <div
                key={project.id}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 ${
                  project.featured ? 'ring-2 ring-purple-500/30' : ''
                }`}
              >
                {project.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-medium">
                      <Star className="w-4 h-4 mr-1" />
                      Featured
                    </div>
                  </div>
                )}

                {/* Project Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
                  <IconComponent size={64} className="text-purple-400 relative z-10" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-purple-300 text-sm font-medium border border-purple-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Project Links */}
                  <div className="flex items-center gap-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 text-white font-medium"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </a>
                    
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 text-white font-medium"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-gray-400 text-lg mb-6">
            Interested in collaborating on a project?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 font-semibold text-white"
          >
            <Eye className="w-5 h-5 mr-2" />
            Let's Build Something Amazing
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
