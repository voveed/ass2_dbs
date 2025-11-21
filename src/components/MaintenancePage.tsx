import React from 'react';

export default function MaintenancePage() {
    return (
        <div style={styles.container}>
            {/* Background gradient */}
            <div style={styles.bgGradient} />

            <div style={styles.content}>
                {/* Icon */}
                <div style={styles.iconWrapper}>
                    <span style={styles.icon}>🚧</span>
                </div>

                {/* Title */}
                <h1 style={styles.title}>Trang đang bảo trì</h1>

                {/* Message */}
                <p style={styles.message}>
                    Xin lỗi, trang hiện tại chỉ khả dụng cho <strong style={styles.highlight}>Business Owner</strong>.
                </p>

                <p style={styles.submessage}>
                    Chức năng cho Tourist và Admin đang được phát triển.
                </p>

                {/* Back button */}
                <button
                    style={styles.button}
                    onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                    }}
                >
                    ← Quay lại đăng nhập
                </button>

                {/* BTL2 Note */}
                <div style={styles.note}>
                    <p style={styles.noteText}>
                        <strong>Lưu ý BTL2:</strong> Bài tập chỉ yêu cầu 3 UI cho Business Owner:
                    </p>
                    <ul style={styles.list}>
                        <li>✅ Form thêm/sửa/xóa Location</li>
                        <li>✅ Danh sách Location (search/filter/sort)</li>
                        <li>✅ Dashboard thống kê</li>
                    </ul>
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
        fontFamily: 'Montserrat, sans-serif',
        padding: '24px'
    },
    bgGradient: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none' as const
    },
    content: {
        background: 'rgba(30, 32, 37, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        borderRadius: '24px',
        padding: '56px 48px',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center' as const,
        boxShadow: '0 20px 60px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        position: 'relative' as const,
        zIndex: 1,
        animation: 'fadeIn 0.6s ease-out'
    },
    iconWrapper: {
        marginBottom: '24px'
    },
    icon: {
        fontSize: '80px',
        display: 'inline-block',
        animation: 'bounce 2s infinite'
    },
    title: {
        fontSize: '36px',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '20px',
        letterSpacing: '-0.5px'
    },
    message: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '18px',
        fontWeight: '500',
        marginBottom: '12px',
        lineHeight: '1.6'
    },
    highlight: {
        color: '#A855F7'
    },
    submessage: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '15px',
        marginBottom: '32px'
    },
    button: {
        padding: '14px 32px',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)',
        fontFamily: 'Montserrat, sans-serif'
    },
    note: {
        marginTop: '40px',
        paddingTop: '32px',
        borderTop: '1px solid rgba(139, 92, 246, 0.2)',
        textAlign: 'left' as const
    },
    noteText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '14px',
        marginBottom: '16px',
        fontWeight: '500'
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '14px',
        lineHeight: '2'
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
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(139, 92, 246, 0.5);
  }
  
  button:active {
    transform: translateY(0);
  }
  
  li {
    padding-left: 24px;
    position: relative;
  }
`;
document.head.appendChild(styleSheet);
