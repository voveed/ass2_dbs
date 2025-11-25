import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationForm from './LocationForm';

interface Location {
    locID: number;
    locName: string;
    street: string;
    district: string;
    province: string;
    locType: string;
    priceLev: string;
    status: string;
    description: string;
    locNo?: string;
    ward?: string;
}

export default function LocationList() {
    const navigate = useNavigate();
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterType, setFilterType] = useState('ALL');
    const [sortBy, setSortBy] = useState('name');
    const [viewMode, setViewMode] = useState<'active' | 'trash'>('active');

    useEffect(() => {
        fetchLocations();
    }, [searchTerm, filterType, filterStatus, sortBy, viewMode]);

    const fetchLocations = async () => {
        setLoading(true);
        setError('');
        try {
            const ownerID = localStorage.getItem('ownerBOID');

            if (!ownerID) {
                setError('Không tìm thấy thông tin owner');
                return;
            }

            const params = new URLSearchParams({
                ownerID,
                search: searchTerm,
                locType: filterType,
                status: viewMode === 'trash' ? 'INACTIVE' : filterStatus,
                sortBy
            });

            const response = await fetch(
                `http://localhost:3001/make-server-aef03c12/owner/locations?${params}`
            );

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Có lỗi xảy ra');

            setLocations(data.locations || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (locID: number) => {
        navigate(`/locations/${locID}`);
    };

    const handleEdit = (location: Location) => {
        setSelectedLocation(location);
        setShowForm(true);
    };

    const handleDelete = async (locID: number, locName: string) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa địa điểm "${locName}"?`)) {
            return;
        }

        setLoading(true);
        setError('');
        try {
            const ownerID = localStorage.getItem('ownerBOID');

            if (!ownerID) {
                throw new Error('Không tìm thấy thông tin owner');
            }

            const response = await fetch(
                `http://localhost:3001/make-server-aef03c12/locations/${locID}?ownerID=${ownerID}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Không thể xóa địa điểm');
            }

            alert('✅ Đã xóa địa điểm thành công!');
            fetchLocations();
        } catch (err: any) {
            setError(err.message);
            alert(`❌ Lỗi: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (locID: number, locName: string) => {
        if (!confirm(`Bạn có chắc muốn khôi phục "${locName}"?`)) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const ownerID = localStorage.getItem('ownerBOID');

            if (!ownerID) {
                throw new Error('Không tìm thấy thông tin owner');
            }

            const response = await fetch(
                `http://localhost:3001/make-server-aef03c12/locations/${locID}/restore`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ownerID: parseInt(ownerID) })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Không thể khôi phục địa điểm');
            }

            alert('✅ Đã khôi phục địa điểm thành công!');
            fetchLocations();
        } catch (err: any) {
            setError(err.message);
            alert(`❌ Lỗi: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleHardDelete = async (locID: number, locName: string) => {
        // Double confirmation for permanent delete
        if (!confirm(`⚠️ CẢNH BÁO: Xóa vĩnh viễn "${locName}"?\n\nHành động này KHÔNG THỂ KHÔI PHỤC!`)) {
            return;
        }

        if (!confirm(`Bạn THỰC SỰ CHẮC CHẮN muốn xóa vĩnh viễn "${locName}"?\n\nTất cả đánh giá, hình ảnh, và lịch sử sẽ bị mất!`)) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const ownerID = localStorage.getItem('ownerBOID');

            if (!ownerID) {
                throw new Error('Không tìm thấy thông tin owner');
            }

            const response = await fetch(
                `http://localhost:3001/make-server-aef03c12/locations/${locID}/permanent?ownerID=${ownerID}`,
                {
                    method: 'DELETE'
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Không thể xóa vĩnh viễn địa điểm');
            }

            alert('🗑️ Đã xóa vĩnh viễn địa điểm khỏi hệ thống!');
            fetchLocations();
        } catch (err: any) {
            setError(err.message);
            alert(`❌ Lỗi: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setSelectedLocation(null);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setSelectedLocation(null);
        fetchLocations();
    };

    if (showForm) {
        return (
            <div>
                <button style={styles.btnBack} onClick={() => setShowForm(false)}>
                    ← Quay lại danh sách
                </button>
                <div style={{ marginTop: '16px' }}>
                    <LocationForm
                        initialData={selectedLocation || undefined}
                        onSuccess={handleFormSuccess}
                    />
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>📍 Địa điểm của tôi</h1>
                <button style={styles.btnAdd} onClick={handleAdd}>
                    + Thêm mới
                </button>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            {/* Tabs */}
            <div style={styles.tabs}>
                <button
                    style={viewMode === 'active' ? styles.tabActive : styles.tab}
                    onClick={() => setViewMode('active')}
                >
                    📍 Hoạt động ({viewMode === 'active' ? locations.length : '?'})
                </button>
                <button
                    style={viewMode === 'trash' ? styles.tabActive : styles.tab}
                    onClick={() => setViewMode('trash')}
                >
                    🗑️ Thùng rác
                </button>
            </div>

            {/* Filters */}
            <div style={styles.filters}>
                <input
                    style={styles.input}
                    placeholder="🔍 Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    style={styles.select}
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="ALL">Tất cả loại hình</option>
                    <option value="HOTEL">Khách sạn</option>
                    <option value="RESTAURANT">Nhà hàng</option>
                    <option value="VENUE">Địa điểm vui chơi</option>
                </select>

                <select
                    style={styles.select}
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="ACTIVE">Đang hoạt động</option>
                    <option value="INACTIVE">Tạm ngưng</option>
                    <option value="PENDING">Chờ duyệt</option>
                </select>

                <select
                    style={styles.select}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="name">Tên A-Z</option>
                    <option value="province">Tỉnh/TP</option>
                </select>
            </div>

            {/* List */}
            {loading ? (
                <div style={styles.loading}>Đang tải...</div>
            ) : locations.length === 0 ? (
                <div style={styles.empty}>
                    <span style={{ fontSize: '64px' }}>📍</span>
                    <p>Chưa có địa điểm nào</p>
                    <button style={styles.btnAdd} onClick={handleAdd}>
                        + Thêm địa điểm đầu tiên
                    </button>
                </div>
            ) : (
                <div style={styles.grid}>
                    {locations.map((loc) => (
                        <div key={loc.locID} style={styles.card}>
                            <div onClick={() => handleViewDetail(loc.locID)} style={{ cursor: 'pointer', flex: 1 }}>
                                <div style={styles.cardHeader}>
                                    <span style={styles.badge}>{loc.locType}</span>
                                    <span style={loc.status === 'ACTIVE' ? styles.statusActive : styles.statusInactive}>
                                        {loc.status}
                                    </span>
                                </div>
                                <h3 style={styles.cardTitle}>{loc.locName}</h3>
                                <p style={styles.cardAddress}>
                                    📍 {loc.street}, {loc.district}, {loc.province}
                                </p>
                                {loc.priceLev && (
                                    <p style={styles.cardPrice}>💰 {loc.priceLev}</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div style={styles.cardActions}>
                                {viewMode === 'active' ? (
                                    <>
                                        <button
                                            style={styles.btnEdit}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(loc);
                                            }}
                                            title="Sửa địa điểm"
                                        >
                                            ✏️ Sửa
                                        </button>
                                        {loc.status === 'ACTIVE' && (
                                            <button
                                                style={styles.btnDelete}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(loc.locID, loc.locName);
                                                }}
                                                title="Xóa địa điểm (soft delete)"
                                            >
                                                🗑️ Xóa
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <button
                                            style={styles.btnRestore}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRestore(loc.locID, loc.locName);
                                            }}
                                            title="Khôi phục địa điểm"
                                        >
                                            ↩️ Khôi phục
                                        </button>
                                        <button
                                            style={styles.btnHardDelete}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleHardDelete(loc.locID, loc.locName);
                                            }}
                                            title="Xóa vĩnh viễn khỏi database"
                                        >
                                            💀 Xóa vĩnh viễn
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={styles.footer}>
                Tổng: <strong>{locations.length}</strong> địa điểm
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'Montserrat, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
    },
    title: {
        fontSize: '32px',
        fontWeight: '700',
        margin: 0,
        background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    btnAdd: {
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
        color: '#FFF',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)',
        transition: 'all 0.3s',
        fontFamily: 'Montserrat, sans-serif'
    },
    btnBack: {
        padding: '10px 20px',
        background: 'rgba(139, 92, 246, 0.2)',
        color: '#A855F7',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        fontFamily: 'Montserrat, sans-serif'
    },
    error: {
        padding: '14px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '10px',
        color: '#FCA5A5',
        fontSize: '14px',
        marginBottom: '20px'
    },
    filters: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
    },
    input: {
        padding: '12px 16px',
        background: 'rgba(30, 32, 37, 0.6)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '10px',
        color: '#FFF',
        fontSize: '14px',
        outline: 'none',
        fontFamily: 'Montserrat, sans-serif'
    },
    select: {
        padding: '12px 16px',
        background: 'rgba(30, 32, 37, 0.6)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '10px',
        color: '#FFF',
        fontSize: '14px',
        outline: 'none',
        cursor: 'pointer',
        fontFamily: 'Montserrat, sans-serif'
    },
    loading: {
        textAlign: 'center' as const,
        padding: '60px',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '16px'
    },
    empty: {
        textAlign: 'center' as const,
        padding: '80px 20px',
        background: 'rgba(30, 32, 37, 0.4)',
        borderRadius: '16px',
        border: '1px solid rgba(139, 92, 246, 0.2)'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
    },
    card: {
        background: 'rgba(30, 32, 37, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        borderRadius: '16px',
        padding: '20px',
        transition: 'all 0.3s',
        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)',
        display: 'flex',
        flexDirection: 'column' as const
    },
    cardActions: {
        display: 'flex',
        gap: '8px',
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(139, 92, 246, 0.1)'
    },
    btnEdit: {
        flex: 1,
        padding: '10px 16px',
        background: 'rgba(139, 92, 246, 0.2)',
        color: '#C084FC',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontFamily: 'Montserrat, sans-serif'
    },
    btnDelete: {
        flex: 1,
        padding: '10px 16px',
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#FCA5A5',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontFamily: 'Montserrat, sans-serif'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
    },
    badge: {
        background: 'rgba(139, 92, 246, 0.2)',
        color: '#C084FC',
        padding: '4px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600'
    },
    statusActive: {
        color: '#10B981',
        fontSize: '12px',
        fontWeight: '600'
    },
    statusInactive: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '12px',
        fontWeight: '600'
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.9)',
        margin: '0 0 8px 0'
    },
    cardAddress: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '14px',
        margin: '4px 0'
    },
    cardPrice: {
        color: '#8B5CF6',
        fontSize: '14px',
        fontWeight: '600',
        margin: '8px 0 0 0'
    },
    tabs: {
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: '2px solid rgba(139, 92, 246, 0.2)'
    },
    tab: {
        padding: '12px 24px',
        background: 'transparent',
        color: 'rgba(255, 255, 255, 0.7)',
        border: 'none',
        borderBottom: '2px solid transparent',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '600',
        transition: 'all 0.3s',
        fontFamily: 'Montserrat, sans-serif'
    },
    tabActive: {
        padding: '12px 24px',
        background: 'transparent',
        color: '#A855F7',
        border: 'none',
        borderBottom: '2px solid #A855F7',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '600',
        fontFamily: 'Montserrat, sans-serif'
    },
    btnRestore: {
        flex: 1,
        padding: '10px 16px',
        background: 'rgba(16, 185, 129, 0.2)',
        color: '#6EE7B7',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontFamily: 'Montserrat, sans-serif'
    },
    btnHardDelete: {
        flex: 1,
        padding: '10px 16px',
        background: 'rgba(239, 68, 68, 0.2)',
        color: '#FCA5A5',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontFamily: 'Montserrat, sans-serif'
    },
    footer: {
        textAlign: 'center' as const,
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '14px',
        marginTop: '20px'
    }
};

// Add hover effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(139, 92, 246, 0.4);
  }
  
  input:focus, select:focus {
    border-color: #8B5CF6 !important;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15) !important;
  }
  
  select option {
    background: #1E2025;
    color: #FFF;
  }
`;
document.head.appendChild(styleSheet);
