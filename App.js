import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import './App.css';
import apiService from './services/api';  // ✅ API Service Import

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // ✅ Backend Integration States
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // ✅ Backend Initialization
  useEffect(() => {
    const initializeBackend = async () => {
      try {
        console.log('🔍 Checking backend connection...');
        const health = await apiService.checkHealth();
        
        if (health.status === 'healthy') {
          setBackendStatus('online');
          console.log('✅ Backend connected successfully');
        } else {
          setBackendStatus('offline');
          console.log('⚠️ Backend not healthy, using fallback data');
        }
      } catch (error) {
        setBackendStatus('offline');
        console.log('❌ Backend not available, using fallback data');
      }
    };

    initializeBackend();

    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Contact Form Handler
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);
    
    console.log('📤 Submitting contact form:', contactForm);
    
    try {
      const result = await apiService.submitContact(contactForm);
      
      setSubmitResult({
        type: 'success',
        message: result.message || 'Message sent successfully! I will get back to you soon.'
      });
      
      // Reset form
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setSubmitResult(null);
      }, 5000);
      
    } catch (error) {
      setSubmitResult({
        type: 'error',
        message: 'Failed to send message. Please try again or email me directly at ayanahamed266a@gmail.com'
      });
      console.error('❌ Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Form Input Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const navItems = ['Home', 'About', 'Resume', 'Services', 'Skills', 'Projects', 'Certifications', 'Contact'];

  const skills = [
    { name: 'SQL', percentage: 90, color: '#787cb5' },
    { name: 'Express.js', percentage: 85, color: '#78b578' },
    { name: 'React', percentage: 95, color: '#e34c26' },
    { name: 'C++', percentage: 90, color: '#264de4' },
    { name: 'Python', percentage: 80, color: '#21759b' },
    { name: 'AWS', percentage: 80, color: '#ff6b35' }
  ];

  const certifications = [
    { name: 'AWS Certified Developer', issuer: 'Amazon Web Services', year: '2024', icon: '☁️' },
    { name: 'Google Cloud Professional', issuer: 'Google Cloud', year: '2025', icon: '🔍' },
    { name: 'React Developer Certification', issuer: 'Meta', year: '2025', icon: '⚛️' },
    { name: 'Full Stack Web Development', issuer: 'freeCodeCamp', year: '2025', icon: '💻' },
    { name: 'Node.js Certified Developer', issuer: 'OpenJS Foundation', year: '2025', icon: '🟢' },
    { name: 'MongoDB Certified Developer', issuer: 'MongoDB University', year: '2025', icon: '🍃' }
  ];

  const projects = [
    { name: 'E-Commerce Platform', category: 'Web Development', tech: ['React', 'Node.js', 'MongoDB'] },
    { name: 'Cloud Dashboard', category: 'Cloud Computing', tech: ['Vue.js', 'Python', 'AWS'] },
    { name: 'Mobile App', category: 'React Native', tech: ['React Native', 'Firebase'] },
    { name: 'API Integration', category: 'Backend Development', tech: ['Express.js', 'PostgreSQL'] },
    { name: 'CMS Website', category: 'WordPress', tech: ['WordPress', 'PHP', 'MySQL'] },
    { name: 'Shoe Selling Website', category: 'Digital Marketing', tech: ['SEO', 'Analytics'] }
  ];

  const services = [
    { 
      name: 'Web Development', 
      icon: '💻', 
      description: 'Custom web applications using modern technologies like React, Node.js, and MongoDB',
      features: ['Responsive Design', 'Performance Optimization', 'SEO Friendly']
    },
    { 
      name: 'Cloud Solutions', 
      icon: '☁️', 
      description: 'AWS, Azure, and Google Cloud infrastructure setup and management',
      features: ['Cloud Migration', 'Serverless Architecture', 'Cost Optimization']
    },
    { 
      name: 'Mobile App Development', 
      icon: '📱', 
      description: 'Cross-platform mobile applications using React Native and Flutter',
      features: ['iOS & Android', 'Offline Support', 'Push Notifications']
    },
    { 
      name: 'SEO Optimization', 
      icon: '🚀', 
      description: 'Search engine optimization strategies to improve website ranking',
      features: ['Keyword Research', 'Technical SEO', 'Content Strategy']
    },
    { 
      name: 'API Development', 
      icon: '🔗', 
      description: 'RESTful and GraphQL API development with security and documentation',
      features: ['API Design', 'Authentication', 'Rate Limiting']
    },
    { 
      name: 'Database Design', 
      icon: '🗄️', 
      description: 'Database architecture and optimization for high-performance applications',
      features: ['SQL/NoSQL', 'Data Modeling', 'Query Optimization']
    }
  ];

  // ✅ DOWNLOAD CV FUNCTION - WORKING
  const downloadCV = (e) => {
    if (e) e.preventDefault();
    
    // Animation effect
    const button = e?.target || document.querySelector('.download-cv-btn');
    if (button) {
      const originalText = button.textContent;
      button.style.transform = 'scale(0.95)';
      button.style.opacity = '0.8';
      button.textContent = 'Downloading...';
      button.disabled = true;
      
      setTimeout(() => {
        button.style.transform = 'scale(1)';
        button.style.opacity = '1';
        button.textContent = originalText;
        button.disabled = false;
      }, 1000);
    }
    
    // ✅ ACTUAL DOWNLOAD LOGIC
    try {
      const resumeUrl = 'ayan ahamed (3).pdf';
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = 'Ayan_Ahamed_Resume.pdf';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('✅ Resume download started!');
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Opening resume in new tab...');
      window.open('ayan ahamed (3).pdf', '_blank');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (isLoading) {
    return (
      <motion.div
        className="loading-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="loader"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: {
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        >
          <div className="loader-circle"></div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          AYAN
        </motion.h2>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="portfolio"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* ✅ Backend Status Indicator */}
      {backendStatus === 'online' && (
        <div className="backend-indicator">
          <span className="indicator-dot"></span>
          <span>Backend Connected</span>
        </div>
      )}

      {/* Animated Background Elements */}
      <div className="animated-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      {/* Navigation */}
      <motion.nav 
        className="navbar"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ opacity }}
      >
        <div className="nav-container">
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <h2>
              <span className="logo-gradient">AYAN </span>
              {backendStatus === 'online' && <span className="online-dot"></span>}
            </h2>
          </motion.div>
          
          <div className="nav-links">
            {navItems.map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`nav-link ${activeSection === item.toLowerCase() ? 'active' : ''}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.1,
                  color: "#ff6b35"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection(item.toLowerCase())}
              >
                {item}
              </motion.a>
            ))}
            
            {/* ✅ DOWNLOAD CV BUTTON */}
            <motion.button
              className="download-cv-btn"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(255, 107, 53, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadCV}
            >
              <span>📄</span> Download CV
            </motion.button>
          </div>

          <motion.div 
            className="mobile-menu-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <motion.span
              animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 8 : 0 }}
            ></motion.span>
            <motion.span
              animate={{ opacity: isMenuOpen ? 0 : 1 }}
            ></motion.span>
            <motion.span
              animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -8 : 0 }}
            ></motion.span>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          >
            {navItems.map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="mobile-nav-link"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => {
                  setActiveSection(item.toLowerCase());
                  setIsMenuOpen(false);
                }}
                whileHover={{ x: 10 }}
              >
                {item}
              </motion.a>
            ))}
            
            {/* ✅ MOBILE DOWNLOAD BUTTON */}
            <motion.button 
              className="mobile-download-btn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
              onClick={downloadCV}
            >
              📄 Download CV
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <motion.div 
          className="hero-container"
          style={{ scale }}
        >
          <motion.div
            className="hero-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h3
              variants={itemVariants}
              className="hero-subtitle"
            >
              <motion.span
                animate={{ 
                  backgroundPosition: ['0%', '100%', '0%'] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="gradient-text"
              >
                I'm 
              </motion.span>
            </motion.h3>
            
            <motion.h1
              variants={itemVariants}
              className="hero-title"
            >
              <motion.span
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(255,107,53,0.5)",
                    "0 0 30px rgba(255,107,53,0.8)",
                    "0 0 20px rgba(255,107,53,0.5)"
                  ]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                AYAN
              </motion.span>
            </motion.h1>
            
            <motion.h2
              variants={itemVariants}
              className="hero-role"
            >
              Fullstack Web Developer & Cloud Engineer
            </motion.h2>

            <motion.div
              variants={itemVariants}
              className="hero-buttons"
            >
              <motion.button
                className="btn btn-primary"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(102, 126, 234, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Hire Me
              </motion.button>
              <motion.button
                className="btn btn-secondary"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(255, 255, 255, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                View Portfolio
              </motion.button>
            </motion.div>
          </motion.div>
          
          <motion.div
            className="hero-image"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5, type: "spring" }}
          >
            <motion.div
              className="image-placeholder"
              animate={{
                boxShadow: [
                  "0 0 50px rgba(102, 126, 234, 0.3)",
                  "0 0 80px rgba(255, 107, 53, 0.4)",
                  "0 0 50px rgba(102, 126, 234, 0.3)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <motion.span
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                AYAN
              </motion.span>
            </motion.div>
            
            {/* Floating tech icons around profile */}
            <motion.div
              className="floating-tech-icon"
              style={{ top: '20%', left: '10%' }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ⚛️
            </motion.div>
            <motion.div
              className="floating-tech-icon"
              style={{ top: '60%', right: '15%' }}
              animate={{
                y: [0, 20, 0],
                rotate: [0, -10, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            >
              💻
            </motion.div>
            <motion.div
              className="floating-tech-icon"
              style={{ bottom: '30%', left: '15%' }}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 15, 0]
              }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 2 }}
            >
              ☁️
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="scroll-arrow"></div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>About Me</h2>
            <motion.div
              className="section-divider"
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            ></motion.div>
          </motion.div>

          <div className="about-content">
            <motion.div
              className="about-text"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                I'm a passionate Fullstack Web Developer with expertise in modern web technologies. 
                I love creating beautiful, functional websites and applications that solve real-world problems.
              </motion.p>
              
              <motion.div
                className="personal-info"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  ['Name:', 'Ayan Ahamed'],
                  ['Date of birth:', 'February 05, 2006'],
                  ['Address:', 'Prayagraj, Uttar Pradesh'],
                  ['Zip code:', '211001'],
                  ['Email:', 'ayanahamed266a@gmail.com'],
                  ['Phone:', '+91 123456789'],
                ].map(([label, value], index) => (
                  <motion.div
                    key={label}
                    className="info-item"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, x: 10 }}
                  >
                    <strong>{label}</strong>
                    <span>{value}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="project-count"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="count-box"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.h3
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.8 }}
                    viewport={{ once: true }}
                  >
                    10+
                  </motion.h3>
                  <p>Projects Completed</p>
                </motion.div>
                
                {/* ✅ DOWNLOAD BUTTON */}
                <motion.button
                  className="download-btn"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(255, 107, 53, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadCV}
                >
                  📄 DOWNLOAD CV
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Photo Section */}
            <motion.div
              className="about-image-container"
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              viewport={{ once: true }}
            >
              <motion.div
                className="photo-frame"
                whileHover={{ scale: 1.03, rotate: -1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="photo-wrapper"
                  animate={{ 
                    boxShadow: [
                      "0 20px 40px rgba(102, 126, 234, 0.3)",
                      "0 25px 50px rgba(255, 107, 53, 0.4)",
                      "0 20px 40px rgba(102, 126, 234, 0.3)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <img 
                    src="WhatsApp Image 2025-07-26 at 17.57.07_94d18261.jpg" 
                    alt="Ayan Ahamed"
                    className="about-photo"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>My Services</h2>
            <motion.div
              className="section-divider"
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            ></motion.div>
          </motion.div>

          <motion.p
            className="services-description"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            I offer a wide range of web development and cloud services to help businesses grow online
          </motion.p>

          <div className="services-grid">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                className="service-card"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1, type: "spring" }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                }}
              >
                <motion.div 
                  className="service-icon"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {service.icon}
                </motion.div>
                <h3>{service.name}</h3>
                <p className="service-description">{service.description}</p>
                <div className="service-features">
                  {service.features.map((feature, idx) => (
                    <motion.span
                      key={idx}
                      className="feature-tag"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + idx * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {feature}
                    </motion.span>
                  ))}
                </div>
                <motion.button
                  className="service-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>My Skills</h2>
            <motion.div
              className="section-divider"
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            ></motion.div>
          </motion.div>

          <motion.p
            className="skills-description"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Far far away, behind the word mountains, far from the countries Vokalia and Consonantia
          </motion.p>

          <div className="skills-grid">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                className="skill-item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-percentage">{skill.percentage}%</span>
                </div>
                <div className="skill-bar">
                  <motion.div
                    className="skill-progress"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.percentage}%` }}
                    transition={{ duration: 1.5, delay: index * 0.1 + 0.3, type: "spring" }}
                    viewport={{ once: true }}
                    style={{ backgroundColor: skill.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="certifications-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Certifications</h2>
            <motion.div
              className="section-divider"
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            ></motion.div>
          </motion.div>

          <div className="certifications-grid">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                className="certification-card"
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1, type: "spring" }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                }}
              >
                <motion.div 
                  className="cert-icon"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {cert.icon}
                </motion.div>
                <h3>{cert.name}</h3>
                <p className="issuer">{cert.issuer}</p>
                <motion.span 
                  className="year"
                  whileHover={{ scale: 1.1 }}
                >
                  {cert.year}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>My Projects</h2>
            <motion.div
              className="section-divider"
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            ></motion.div>
          </motion.div>

          <div className="projects-grid">
            {projects.map((project, index) => (
              <motion.div
                key={project.name}
                className="project-card"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, type: "spring" }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)"
                }}
              >
                <motion.div 
                  className="project-image"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="project-placeholder">
                    <motion.span
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {project.name}
                    </motion.span>
                  </div>
                </motion.div>
                <div className="project-info">
                  <h3>{project.name}</h3>
                  <p>{project.category}</p>
                  <div className="project-tech">
                    {project.tech.map((tech, techIndex) => (
                      <motion.span
                        key={tech}
                        className="tech-tag"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + techIndex * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ UPDATED Contact Section with Backend Integration */}
      <section id="contact" className="contact-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Contact Me</h2>
            <motion.div
              className="section-divider"
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            ></motion.div>
          </motion.div>

          <div className="contact-content">
            <motion.div
              className="contact-info"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3>Get In Touch</h3>
              
              {/* Backend Connection Status */}
              <div className="connection-status">
                <div className={`status-badge ${backendStatus}`}>
                  <span className="status-dot"></span>
                  <span className="status-text">
                    {backendStatus === 'online' ? 'Backend Connected ✓' : 'Backend Offline (Using Demo Mode)'}
                  </span>
                </div>
              </div>
              
              <motion.div
                className="contact-methods"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  ['📧', 'Email:', 'ayanahamed266a@gmail.com'],
                  ['📞', 'Phone:', '+91 8318172054'],
                  ['📍', 'Address:', 'Prayagraj, Uttar Pradesh']
                ].map(([icon, label, value], index) => (
                  <motion.div
                    key={label}
                    className="contact-item"
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                  >
                    <span className="contact-icon">{icon}</span>
                    <div>
                      <strong>{label}</strong>
                      <span>{value}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* ✅ UPDATED Contact Form with API Integration */}
            <motion.form
              className="contact-form"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              onSubmit={handleContactSubmit}
            >
              {/* Submission Status Messages */}
              {submitResult && (
                <motion.div
                  className={`form-message ${submitResult.type}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {submitResult.message}
                </motion.div>
              )}

              <motion.div
                className="form-group"
                whileFocus={{ scale: 1.02 }}
              >
                <input 
                  type="text" 
                  name="name"
                  placeholder="Your Name" 
                  value={contactForm.name}
                  onChange={handleInputChange}
                  required 
                  disabled={isSubmitting}
                />
              </motion.div>
              
              <motion.div
                className="form-group"
                whileFocus={{ scale: 1.02 }}
              >
                <input 
                  type="email" 
                  name="email"
                  placeholder="Your Email" 
                  value={contactForm.email}
                  onChange={handleInputChange}
                  required 
                  disabled={isSubmitting}
                />
              </motion.div>
              
              <motion.div
                className="form-group"
                whileFocus={{ scale: 1.02 }}
              >
                <input 
                  type="text" 
                  name="subject"
                  placeholder="Subject" 
                  value={contactForm.subject}
                  onChange={handleInputChange}
                  required 
                  disabled={isSubmitting}
                />
              </motion.div>
              
              <motion.div
                className="form-group"
                whileFocus={{ scale: 1.02 }}
              >
                <textarea 
                  name="message"
                  placeholder="Your Message" 
                  rows="5" 
                  value={contactForm.message}
                  onChange={handleInputChange}
                  required 
                  disabled={isSubmitting}
                ></textarea>
              </motion.div>
              
              <motion.button
                type="submit"
                className="btn btn-primary"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(102, 126, 234, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                {backendStatus === 'online' && <span className="send-icon">✈️</span>}
              </motion.button>
              
              {backendStatus === 'offline' && (
                <div className="offline-notice">
                  <small>Note: Currently in demo mode. Messages won't be saved.</small>
                </div>
              )}
            </motion.form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <motion.p
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            &copy; 2025 AYAN. All rights reserved. | Backend: {backendStatus}
          </motion.p>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default Portfolio;