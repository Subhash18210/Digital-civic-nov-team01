// src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext.jsx'; 
// Assume the required dashboard CSS is available in App.css or index.css

const Dashboard = () => {
    const { user, location, isOfficial, logout } = useAuth();

    // These categories are listed in the mockups [cite: 201, 202, 212-217]
    const categories = ['All Categories', 'Environment', 'Infrastructure', 'Education', 'Public Safety', 'Transportation', 'Healthcare', 'Housing'];
    const [activeCategory, setActiveCategory] = React.useState('All Categories');

    // Stats based on mockup [cite: 198, 205, 207]
    const stats = [
        { title: "My Petitions", value: 0, key: "mypetitions" },
        { title: "Successful Petitions", value: 0, key: "successful" },
        { title: "Polls Created", value: 0, key: "polls" },
    ];

    if (!user) return <div>Loading...</div>; // Should not happen due to AppRouter, but good practice

    return (
        <div className="dashboard-layout">
            {/* Sidebar Navigation */}
            <div className="sidebar">
                <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <h2 style={{ color: '#007bff', margin: 0 }}>Civix Beta</h2>
                    {/* Display role from mockups [cite: 185] */}
                    <p style={{ fontSize: '12px', color: '#666' }}>{isOfficial ? 'Official' : 'Citizen'} (Verified)</p>
                </div>
                
                {/* Navigation Items [cite: 190-196] */}
                <div className="nav-item active">🏠 Dashboard</div>
                <div className="nav-item">📝 Petitions</div>
                <div className="nav-item">🗳️ Polls</div>
                <div className="nav-item">📈 Reports</div>
                <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    <div className="nav-item">⚙️ Settings</div>
                    <div className="nav-item">❓ Help & Support</div>
                    <div className="nav-item" onClick={logout} style={{ color: 'red', cursor: 'pointer' }}>➡️ Sign Out</div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="main-content">
                <div className="welcome-header">
                    <h1 style={{marginBottom: '5px'}}>Welcome back, {user.name}! [cite: 188]</h1>
                    <p style={{color: '#666'}}>
                        See what's happening in your community and make your voice heard. [cite: 189]
                    </p>
                    <small>Showing for **{location}** [cite: 211]</small>
                </div>

                {/* Statistics Grid */}
                <div className="stats-grid">
                    {stats.map(stat => (
                        <div key={stat.key} className="stat-card">
                            <h2>{stat.value}</h2>
                            <p>{stat.title}</p>
                        </div>
                    ))}
                </div>

                {/* Active Petitions Near You Section */}
                <div className="petitions-near-you">
                    <h3>Active Petitions Near You</h3>
                    
                    {/* Category Filters */}
                    <div className="filter-pills">
                        {categories.map(category => (
                            <span
                                key={category}
                                className={`pill ${activeCategory === category ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </span>
                        ))}
                    </div>

                    <p style={{textAlign: 'center', marginTop: '40px', color: '#888'}}>
                        No petitions found with the current filters. [cite: 218]
                    </p>
                    <button style={{ 
                        display: activeCategory !== 'All Categories' ? 'block' : 'none',
                        margin: '20px auto 0',
                        // ... CSS styles for Clear Filters button ...
                        cursor: 'pointer'
                    }} onClick={() => setActiveCategory('All Categories')}>
                        Clear Filters [cite: 219]
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;