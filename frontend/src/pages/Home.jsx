import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Vote, FileText, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  const globeEl = useRef();
  const [windowSize, setWindowSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  // Auto-rotate the globe
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={styles.container}>
      
      {/* LEFT SIDE: Content */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 1 }}
        style={styles.contentSection}
      >
        <h1 style={styles.title}>
          Civic <span style={styles.highlight}>Engagement</span> <br/>
          Reimagined.
        </h1>
        <p style={styles.description}>
          Connect with local governance, create petitions, and vote on community issues. 
          Your voice has the power to shape the future.
        </p>

        {/* Feature List */}
        <div style={styles.featureGrid}>
          <FeatureItem icon={<FileText size={20} />} text="Create Petitions" />
          <FeatureItem icon={<Vote size={20} />} text="Vote on Polls" />
          <FeatureItem icon={<Users size={20} />} text="Community Action" />
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonGroup}>
          <Link to="/register">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              style={styles.registerBtn}
            >
              Get Started <ArrowRight size={18} />
            </motion.button>
          </Link>
          
          <Link to="/login">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }} 
              whileTap={{ scale: 0.95 }}
              style={styles.loginBtn}
            >
              Login
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* RIGHT SIDE: 3D Globe */}
      <div style={styles.globeContainer}>
        <Globe
          ref={globeEl}
          width={windowSize.w / 2} 
          height={windowSize.h}
          backgroundColor="rgba(0,0,0,0)" 
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          atmosphereColor="#3b82f6" // Blue atmosphere
          atmosphereAltitude={0.2}
        />
      </div>
    </div>
  );
};

// Helper for features
const FeatureItem = ({ icon, text }) => (
  <div style={styles.featureItem}>
    <div style={styles.iconBox}>{icon}</div>
    <span style={{ fontSize: '0.9rem', color: '#ccc' }}>{text}</span>
  </div>
);

// Styles
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    background: 'linear-gradient(to right, #000000, #0f172a)', // Black to Dark Blue
    color: 'white',
    overflow: 'hidden',
    position: 'relative'
  },
  contentSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '4rem',
    zIndex: 10
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    lineHeight: 1.1
  },
  highlight: {
    color: '#3b82f6', // Bright Blue
    textShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
  },
  description: {
    fontSize: '1.2rem',
    color: '#94a3b8',
    maxWidth: '500px',
    marginBottom: '2rem',
    lineHeight: 1.6
  },
  featureGrid: {
    display: 'flex',
    gap: '20px',
    marginBottom: '3rem'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  iconBox: {
    background: 'rgba(59, 130, 246, 0.2)',
    padding: '8px',
    borderRadius: '8px',
    color: '#60a5fa'
  },
  buttonGroup: {
    display: 'flex',
    gap: '20px'
  },
  registerBtn: {
    padding: '12px 30px',
    fontSize: '1rem',
    background: '#2563eb', // Blue
    border: 'none',
    color: 'white',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 0 15px rgba(37, 99, 235, 0.5)'
  },
  loginBtn: {
    padding: '12px 30px',
    fontSize: '1rem',
    background: 'transparent',
    border: '1px solid #475569',
    color: 'white',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  globeContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'grab'
  }
};

export default Home;