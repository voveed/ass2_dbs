import React, { useState, useEffect } from 'react';

interface LocationStats {
    locID: number;
    locName: string;
    locType: string;
    totalCompletedBookings: number;
    totalRevenue: number;
    averageRating: number | string;
    totalReviews: number;
}

export default function StatisticsDashboard() {
    const [stats, setStats] = useState<LocationStats[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const ownerID = localStorage.getItem('ownerBOID');
            if (!ownerID) {
                console.error('No ownerID found in localStorage');
                return;
            }

            const response = await fetch(
                `http://localhost:3001/make-server-aef03c12/owner/statistics?ownerID=${ownerID}`
            );
            const data = await response.json();
            setStats(data.statistics || []);
        } catch (err) {
            console.error('Lỗi tải thống kê:', err);
        } finally {
            setLoading(false);
        }
    };

    const totalRevenue = stats.reduce((sum: number, s: LocationStats) => sum + (Number(s.totalRevenue) || 0), 0);
    const totalBookings = stats.reduce((sum: number, s: LocationStats) => sum + (Number(s.totalCompletedBookings) || 0), 0);
    const avgRating = stats.length > 0
        ? stats.reduce((sum: number, s: LocationStats) => sum + (Number(s.averageRating) || 0), 0) / stats.length
        : 0;

    const typeDistribution = stats.reduce((acc: Record<string, number>, curr: LocationStats) => {
        acc[curr.locType] = (acc[curr.locType] || 0) + 1;
        return acc;
    }, {});

    if (loading) {
        return <div style={styles.loading}>Đang tải thống kê...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.mainTitle}>Thống kê kinh doanh</h1>

            {/* Summary Cards */}
            <div style={styles.cardsGrid}>
                <div style={{ ...styles.card, ...styles.cardBlue }}>
                    <div style={styles.cardContent}>
                        <div>
                            <p style={styles.cardLabel}>Tổng địa điểm</p>
                            <h3 style={styles.cardValue}>{stats.length}</h3>
                        </div>
                        <div style={styles.iconBlue}>📍</div>
                    </div>
                </div>

                <div style={{ ...styles.card, ...styles.cardGreen }}>
                    <div style={styles.cardContent}>
                        <div>
                            <p style={styles.cardLabel}>Tổng đơn đặt</p>
                            <h3 style={styles.cardValue}>{totalBookings}</h3>
                        </div>
                        <div style={styles.iconGreen}>📈</div>
                    </div>
                </div>

                <div style={{ ...styles.card, ...styles.cardYellow }}>
                    <div style={styles.cardContent}>
                        <div>
                            <p style={styles.cardLabel}>Tổng doanh thu</p>
                            <h3 style={styles.cardValue}>
                                {totalRevenue.toLocaleString('vi-VN')} đ
                            </h3>
                        </div>
                        <div style={styles.iconYellow}>💰</div>
                    </div>
                </div>

                <div style={{ ...styles.card, ...styles.cardOrange }}>
                    <div style={styles.cardContent}>
                        <div>
                            <p style={styles.cardLabel}>Đánh giá TB</p>
                            <h3 style={styles.cardValue}>{avgRating.toFixed(1)} ⭐</h3>
                        </div>
                        <div style={styles.iconOrange}>⭐</div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div style={styles.chartsGrid}>
                {/* Revenue Bar Chart */}
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Doanh thu theo địa điểm</h3>
                    <div style={styles.barChart}>
                        {stats.map((stat: LocationStats) => {
                            const maxRevenue = Math.max(...stats.map(s => Number(s.totalRevenue) || 0));
                            const heightPercent = maxRevenue > 0 ? ((Number(stat.totalRevenue) || 0) / maxRevenue) * 100 : 0;

                            return (
                                <div key={stat.locID} style={styles.barWrapper}>
                                    <div style={styles.barContainer}>
                                        <div
                                            style={{
                                                ...styles.bar,
                                                height: `${heightPercent}%`,
                                                background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)'
                                            }}
                                            title={`${(Number(stat.totalRevenue) || 0).toLocaleString('vi-VN')} đ`}
                                        />
                                    </div>
                                    <div style={styles.barLabel}>
                                        {stat.locName.length > 15 ? stat.locName.substring(0, 12) + '...' : stat.locName}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Type Distribution */}
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Phân bố theo loại hình</h3>
                    <div style={styles.pieChart}>
                        {Object.entries(typeDistribution).map(([type, count], idx) => (
                            <div key={type} style={styles.pieItem}>
                                <div
                                    style={{
                                        ...styles.pieColor,
                                        background: ['#667eea', '#06b6d4', '#f59e0b'][idx % 3]
                                    }}
                                />
                                <span style={styles.pieLabel}>
                                    {type}: {count} địa điểm
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div style={styles.tableCard}>
                <h3 style={styles.tableTitle}>Chi tiết theo địa điểm</h3>
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.th}>Địa điểm</th>
                                <th style={styles.th}>Loại hình</th>
                                <th style={styles.thRight}>Số đơn</th>
                                <th style={styles.thRight}>Doanh thu</th>
                                <th style={styles.thRight}>Đánh giá</th>
                                <th style={styles.thRight}>Số review</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.map((stat: LocationStats) => (
                                <tr key={stat.locID} style={styles.tableRow}>
                                    <td style={styles.tdBold}>{stat.locName}</td>
                                    <td style={styles.td}>
                                        <span style={styles.badge}>{stat.locType}</span>
                                    </td>
                                    <td style={styles.tdRight}>{Number(stat.totalCompletedBookings) || 0}</td>
                                    <td style={styles.tdRight}>
                                        {(Number(stat.totalRevenue) || 0).toLocaleString('vi-VN')} đ
                                    </td>
                                    <td style={styles.tdRight}>{Number(stat.averageRating || 0).toFixed(1)} ⭐</td>
                                    <td style={styles.tdRight}>{Number(stat.totalReviews) || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '1400px',
        margin: '0 auto'
    },
    mainTitle: {
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '24px',
        color: '#e995f8ff'
    },
    loading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        fontSize: '18px',
        color: '#6b7280'
    },
    cardsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
    },
    card: {
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s'
    },
    cardBlue: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    cardGreen: { background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' },
    cardYellow: { background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)' },
    cardOrange: { background: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)' },
    cardContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white'
    },
    cardLabel: {
        fontSize: '14px',
        opacity: 0.9,
        margin: 0,
        marginBottom: '8px'
    },
    cardValue: {
        fontSize: '28px',
        fontWeight: 'bold',
        margin: 0
    },
    iconBlue: { fontSize: '32px', opacity: 0.9 },
    iconGreen: { fontSize: '32px', opacity: 0.9 },
    iconYellow: { fontSize: '32px', opacity: 0.9 },
    iconOrange: { fontSize: '32px', opacity: 0.9 },
    chartsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
    },
    chartCard: {
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    chartTitle: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '20px',
        color: '#1a1a1a'
    },
    barChart: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        height: '300px',
        gap: '12px',
        padding: '20px 0'
    },
    barWrapper: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        minWidth: '60px'
    },
    barContainer: {
        width: '100%',
        height: '250px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    bar: {
        width: '80%',
        borderRadius: '6px 6px 0 0',
        transition: 'height 0.3s ease',
        cursor: 'pointer'
    },
    barLabel: {
        fontSize: '11px',
        color: '#6b7280',
        marginTop: '8px',
        textAlign: 'center' as const,
        wordBreak: 'break-word' as const,
        maxWidth: '80px'
    },
    pieChart: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '16px',
        padding: '40px 20px'
    },
    pieItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    pieColor: {
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
    },
    pieLabel: {
        fontSize: '16px',
        color: '#374151',
        fontWeight: '500'
    },
    tableCard: {
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    tableTitle: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '20px',
        color: '#1a1a1a'
    },
    tableWrapper: {
        overflowX: 'auto' as const
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        fontSize: '14px'
    },
    tableHeader: {
        background: '#f9fafb',
        borderBottom: '2px solid #e5e7eb'
    },
    th: {
        padding: '14px 12px',
        textAlign: 'left' as const,
        fontWeight: '600',
        color: '#374151'
    },
    thRight: {
        padding: '14px 12px',
        textAlign: 'right' as const,
        fontWeight: '600',
        color: '#374151'
    },
    tableRow: {
        borderBottom: '1px solid #e5e7eb',
        transition: 'background 0.2s'
    },
    td: {
        padding: '14px 12px',
        color: '#1f2937'
    },
    tdBold: {
        padding: '14px 12px',
        fontWeight: '500',
        color: '#1f2937'
    },
    tdRight: {
        padding: '14px 12px',
        textAlign: 'right' as const,
        color: '#1f2937'
    },
    badge: {
        padding: '4px 12px',
        background: '#dbeafe',
        color: '#1e40af',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500'
    }
};
