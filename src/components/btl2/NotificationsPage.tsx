import React, { useState, useEffect } from 'react';

interface Notification {
    fbID: number;
    fbDateTime: string;
    feedbackType: 'REVIEW' | 'COMMENT';
    locName: string;
    userName: string;
    rating?: number;
    content: string;
    likeCount: number;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'REVIEW' | 'COMMENT'>('ALL');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const ownerID = localStorage.getItem('ownerBOID');
            const response = await fetch(
                `http://localhost:3001/make-server-aef03c12/owner/notifications?ownerID=${ownerID}`
            );
            const data = await response.json();
            setNotifications(data.notifications || []);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredNotifications = notifications.filter(n =>
        filter === 'ALL' || n.feedbackType === filter
    );

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString('vi-VN');
    };

    if (loading) {
        return <div style={styles.loading}>Đang tải...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>📬 Thông báo & Phản hồi</h1>
                <p style={styles.subtitle}>
                    Tất cả reviews và comments từ khách hàng
                </p>
            </div>

            {/* Filters */}
            <div style={styles.filters}>
                <button
                    style={filter === 'ALL' ? styles.filterBtnActive : styles.filterBtn}
                    onClick={() => setFilter('ALL')}
                >
                    Tất cả ({notifications.length})
                </button>
                <button
                    style={filter === 'REVIEW' ? styles.filterBtnActive : styles.filterBtn}
                    onClick={() => setFilter('REVIEW')}
                >
                    ⭐ Reviews ({notifications.filter(n => n.feedbackType === 'REVIEW').length})
                </button>
                <button
                    style={filter === 'COMMENT' ? styles.filterBtnActive : styles.filterBtn}
                    onClick={() => setFilter('COMMENT')}
                >
                    💬 Comments ({notifications.filter(n => n.feedbackType === 'COMMENT').length})
                </button>
            </div>

            {/* Notifications List */}
            <div style={styles.list}>
                {filteredNotifications.length === 0 ? (
                    <div style={styles.empty}>
                        <span style={styles.emptyIcon}>📭</span>
                        <p>Chưa có phản hồi nào</p>
                    </div>
                ) : (
                    filteredNotifications.map(notif => (
                        <div key={notif.fbID} style={styles.card}>
                            {/* Header */}
                            <div style={styles.cardHeader}>
                                <div>
                                    <span style={styles.badge}>
                                        {notif.feedbackType === 'REVIEW' ? '⭐ Review' : '💬 Comment'}
                                    </span>
                                    <span style={styles.locationName}>{notif.locName}</span>
                                </div>
                                <span style={styles.date}>{formatDate(notif.fbDateTime)}</span>
                            </div>

                            {/* Content */}
                            <div style={styles.cardContent}>
                                <div style={styles.userInfo}>
                                    <div style={styles.avatar}>{notif.userName.charAt(0).toUpperCase()}</div>
                                    <div>
                                        <div style={styles.userName}>{notif.userName}</div>
                                        {notif.rating && (
                                            <div style={styles.rating}>
                                                {'⭐'.repeat(Math.floor(notif.rating))} {notif.rating.toFixed(1)}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <p style={styles.content}>{notif.content}</p>

                                <div style={styles.footer}>
                                    <span style={styles.likes}>
                                        ❤️ {notif.likeCount} likes
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        fontFamily: 'Montserrat, sans-serif'
    },
    loading: {
        textAlign: 'center' as const,
        color: 'rgba(255, 255, 255, 0.7)',
        padding: '40px',
        fontSize: '16px'
    },
    header: {
        marginBottom: '32px'
    },
    title: {
        fontSize: '32px',
        fontWeight: '700',
        marginBottom: '8px',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '15px'
    },
    filters: {
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap' as const
    },
    filterBtn: {
        padding: '10px 20px',
        background: 'rgba(30, 32, 37, 0.6)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        borderRadius: '10px',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontFamily: 'Montserrat, sans-serif'
    },
    filterBtnActive: {
        padding: '10px 20px',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
        border: '1px solid rgba(139, 92, 246, 0.5)',
        borderRadius: '10px',
        color: '#FFFFFF',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
        fontFamily: 'Montserrat, sans-serif'
    },
    list: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '16px'
    },
    empty: {
        textAlign: 'center' as const,
        padding: '80px 20px',
        background: 'rgba(30, 32, 37, 0.4)',
        borderRadius: '16px',
        border: '1px solid rgba(139, 92, 246, 0.2)'
    },
    emptyIcon: {
        fontSize: '64px',
        display: 'block',
        marginBottom: '16px'
    },
    card: {
        background: 'rgba(30, 32, 37, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)',
        transition: 'all 0.3s'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(139, 92, 246, 0.1)'
    },
    badge: {
        background: 'rgba(139, 92, 246, 0.2)',
        color: '#C084FC',
        padding: '4px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        marginRight: '12px'
    },
    locationName: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '14px',
        fontWeight: '600'
    },
    date: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '13px'
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '12px'
    },
    userInfo: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFF',
        fontSize: '16px',
        fontWeight: '700'
    },
    userName: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '15px',
        fontWeight: '600'
    },
    rating: {
        color: '#FFC107',
        fontSize: '13px',
        fontWeight: '500'
    },
    content: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '14px',
        lineHeight: '1.6',
        margin: 0
    },
    footer: {
        display: 'flex',
        gap: '16px',
        paddingTop: '8px'
    },
    likes: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '13px'
    }
};

// Add hover effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .card:hover {
    border-color: rgba(139, 92, 246, 0.4);
    box-shadow: 0 8px 30px rgba(139, 92, 246, 0.2);
  }
  
  button:hover {
    border-color: rgba(139, 92, 246, 0.4) !important;
  }
`;
document.head.appendChild(styleSheet);
