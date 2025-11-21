import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LocationList from './components/btl2/LocationList';
import StatisticsDashboard from './components/btl2/StatisticsDashboard';
import NotificationsPage from './components/btl2/NotificationsPage';
import LocationDetailPage from './components/btl2/LocationDetailPage';
import LoginPage from './components/auth/LoginPage';
import MaintenancePage from './components/MaintenancePage';

function AppContent() {
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({ fullName: '', email: '' });

  useEffect(() => {
    setUserInfo({
      fullName: localStorage.getItem('userFullName') || '',
      email: localStorage.getItem('userEmail') || ''
    });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const navItems = [
    { path: '/', icon: '📍', label: 'Địa điểm của tôi' },
    { path: '/statistics', icon: '📊', label: 'Thống kê' },
    { path: '/notifications', icon: '📬', label: 'Thông báo' }
  ];

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        {/* Logo */}
        <div style={styles.sidebarHeader}>
          <h1 style={styles.logo}>VivuViet</h1>
          <p style={styles.logoSub}>Business Portal</p>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={location.pathname === item.path ? styles.navItemActive : styles.navItem}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div style={styles.userSection}>
          <div style={styles.userAvatar}>
            {userInfo.fullName.charAt(0).toUpperCase() || 'O'}
          </div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{userInfo.fullName || 'Owner'}</div>
            <div style={styles.userEmail}>{userInfo.email}</div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn} title="Đăng xuất">
            🚪
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<LocationList />} />
          <Route path="/locations/:locID" element={<LocationDetailPage />} />
          <Route path="/statistics" element={<StatisticsDashboard />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole');

    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
    setLoading(false);
  }, []);

  const handleLogin = (role: string, userData: any) => {
    setIsAuthenticated(true);
    setUserRole(role);

    // Save user info
    localStorage.setItem('userFullName', userData.fullName || '');
    localStorage.setItem('userEmail', userData.email || '');
    if (userData.BOID) {
      localStorage.setItem('ownerBOID', userData.BOID);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (userRole === 'TOURIST' || userRole === 'ADMIN') {
    return <MaintenancePage />;
  }

  if (userRole === 'OWNER') {
    return (
      <Router>
        <AppContent />
      </Router>
    );
  }

  return <LoginPage onLogin={handleLogin} />;
}

const styles = {
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0A0A0B',
    color: '#fff',
    fontSize: '18px',
    fontFamily: 'Montserrat, sans-serif'
  },
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: '#0A0A0B',
    fontFamily: 'Montserrat, sans-serif'
  },
  sidebar: {
    width: '280px',
    background: 'rgba(30, 32, 37, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(139, 92, 246, 0.2)',
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'fixed' as const,
    height: '100vh',
    left: 0,
    top: 0,
    zIndex: 100
  },
  sidebarHeader: {
    padding: '32px 24px',
    borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
  },
  logo: {
    fontSize: '28px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
    letterSpacing: '-0.5px',
    marginBottom: '4px'
  },
  logoSub: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
    fontWeight: '500'
  },
  nav: {
    flex: 1,
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    overflowY: 'auto' as const
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: '12px',
    textDecoration: 'none',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.3s',
    background: 'transparent',
    border: '1px solid transparent'
  },
  navItemActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: '12px',
    textDecoration: 'none',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
    border: '1px solid rgba(139, 92, 246, 0.4)',
    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.2)'
  },
  navIcon: {
    fontSize: '20px'
  },
  userSection: {
    padding: '20px',
    borderTop: '1px solid rgba(139, 92, 246, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(10, 10, 11, 0.4)'
  },
  userAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFF',
    fontSize: '18px',
    fontWeight: '700',
    flexShrink: 0
  },
  userInfo: {
    flex: 1,
    minWidth: 0
  },
  userName: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    fontWeight: '600',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '12px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const
  },
  logoutBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: 'rgba(139, 92, 246, 0.1)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    color: '#A855F7',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    flexShrink: 0,
    fontFamily: 'Montserrat, sans-serif'
  },
  main: {
    flex: 1,
    marginLeft: '280px',
    padding: '40px',
    overflowY: 'auto' as const
  }
};

// Add hover styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  a:hover {
    background: rgba(139, 92, 246, 0.1) !important;
    border-color: rgba(139, 92, 246, 0.3) !important;
    color: #C084FC !important;
  }
  
  button:hover {
    background: rgba(139, 92, 246, 0.2) !important;
    border-color: rgba(139, 92, 246, 0.5) !important;
    transform: scale(1.05);
  }
  
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(10, 10, 11, 0.4);
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.3);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 92, 246, 0.5);
  }
`;
document.head.appendChild(styleSheet);

export default App;
