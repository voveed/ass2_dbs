import React, { useState, useEffect } from 'react';

interface LoginPageProps {
    onLogin: (role: string, userData: any) => void;
}

interface DemoAccount {
    email: string;
    password: string;
    fullName: string;
    role: string;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [demoAccounts, setDemoAccounts] = useState<DemoAccount[]>([]);

    useEffect(() => {
        fetchDemoAccounts();
    }, []);

    const fetchDemoAccounts = async () => {
        try {
            const response = await fetch('http://localhost:3001/make-server-aef03c12/demo-accounts');
            const data = await response.json();
            if (data.success) {
                setDemoAccounts(data.accounts || []);
            }
        } catch (err) {
            console.error('Failed to load demo accounts:', err);
        }
    };

    const handleDemoLogin = (account: DemoAccount) => {
        setEmail(account.email);
        setPassword(account.password);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3001/make-server-aef03c12/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Đăng nhập thất bại');

            // Lưu token và role
            localStorage.setItem('accessToken', data.token);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userEmail', email);

            onLogin(data.role, data.user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* Background gradient */}
            <div style={styles.bgGradient} />

            <div style={styles.loginBox}>
                {/* Logo */}
                <div style={styles.logoSection}>
                    <h1 style={styles.logo}>VivuViet</h1>
                    <p style={styles.subtitle}>Hệ thống quản lý du lịch</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    {error && <div style={styles.error}>{error}</div>}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            style={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="owner@vivu.com"
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Mật khẩu</label>
                        <input
                            type="password"
                            style={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                {/* Demo accounts từ database */}
                <div style={styles.demoSection}>
                    <p style={styles.demoTitle}>
                        🔑 Tài khoản test từ database (click để điền nhanh):
                    </p>
                    <div style={styles.demoGrid}>
                        {demoAccounts.length > 0 ? (
                            demoAccounts.map((account, index) => (
                                <div
                                    key={index}
                                    style={styles.demoCard}
                                    onClick={() => handleDemoLogin(account)}
                                >
                                    <strong>{account.fullName || account.role}</strong>
                                    <code style={styles.code}>📧 {account.email}</code>
                                    <code style={styles.code}>🔒 {account.password}</code>
                                </div>
                            ))
                        ) : (
                            <div style={{ ...styles.demoCard, cursor: 'default' }}>
                                <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                    Đang tải accounts từ database...
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0A0A0B',
        position: 'relative' as const,
        overflow: 'hidden',
        fontFamily: 'Montserrat, sans-serif'
    },
    bgGradient: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none' as const
    },
    loginBox: {
        background: 'rgba( 30, 32, 37, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        borderRadius: '24px',
        padding: '48px',
        maxWidth: '480px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        position: 'relative' as const,
        zIndex: 1,
        animation: 'fadeIn 0.6s ease-out'
    },
    logoSection: {
        textAlign: 'center' as const,
        marginBottom: '40px'
    },
    logo: {
        fontSize: '42px',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '8px',
        letterSpacing: '-0.5px'
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '14px',
        fontWeight: '500'
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '24px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '8px'
    },
    label: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '14px',
        fontWeight: '600',
        letterSpacing: '0.3px'
    },
    input: {
        padding: '14px 16px',
        background: 'rgba(10, 10, 11, 0.6)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '12px',
        color: '#FFFFFF',
        fontSize: '15px',
        outline: 'none',
        transition: 'all 0.3s ease',
        fontFamily: 'Montserrat, sans-serif'
    },
    button: {
        padding: '16px',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)',
        marginTop: '8px',
        fontFamily: 'Montserrat, sans-serif'
    },
    error: {
        padding: '14px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '12px',
        color: '#FCA5A5',
        fontSize: '14px',
        fontWeight: '500'
    },
    demoSection: {
        marginTop: '40px',
        paddingTop: '32px',
        borderTop: '1px solid rgba(139, 92, 246, 0.2)'
    },
    demoTitle: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '13px',
        fontWeight: '600',
        marginBottom: '16px',
        textAlign: 'center' as const
    },
    demoGrid: {
        display: 'grid',
        gap: '12px'
    },
    demoCard: {
        background: 'rgba(10, 10, 11, 0.4)',
        border: '1px solid rgba(139, 92, 246, 0.15)',
        borderRadius: '10px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '6px',
        fontSize: '13px',
        color: 'rgba(255, 255, 255, 0.8)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    code: {
        background: 'rgba(139, 92, 246, 0.1)',
        color: '#C084FC',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        fontFamily: 'JetBrains Mono, monospace'
    }
};

// Add keyframes
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  input:focus {
    border-color: #8B5CF6 !important;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15) !important;
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(139, 92, 246, 0.5);
  }
  
  button:active:not(:disabled) {
    transform: translateY(0);
  }
  
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
document.head.appendChild(styleSheet);
