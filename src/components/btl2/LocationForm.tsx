import React, { useState } from 'react';

interface LocationFormData {
    locID?: number;
    locName: string;
    street: string;
    district: string;
    province: string;
    locType: string;
    locNo: string;
    ward: string;
    priceLev: string;
    description: string;
}

interface LocationFormProps {
    initialData?: LocationFormData;
    onSuccess?: () => void;
}

export default function LocationForm({ initialData, onSuccess }: LocationFormProps) {
    const [formData, setFormData] = useState<LocationFormData>(initialData || {
        locName: '',
        street: '',
        district: '',
        province: '',
        locType: 'HOTEL',
        locNo: '',
        ward: '',
        priceLev: 'BUDGET',
        description: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (field: keyof LocationFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const ownerID = localStorage.getItem('ownerBOID');

            const url = formData.locID
                ? `http://localhost:3001/make-server-aef03c12/locations/${formData.locID}`
                : 'http://localhost:3001/make-server-aef03c12/locations';

            const response = await fetch(url, {
                method: formData.locID ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, ownerID })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Có lỗi xảy ra');

            setSuccess(formData.locID ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
            setTimeout(() => onSuccess?.(), 1000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!formData.locID) return;
        if (!confirm('Bạn có chắc chắn muốn xóa địa điểm này?')) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                `http://localhost:3001/make-server-aef03c12/locations/${formData.locID}`,
                { method: 'DELETE' }
            );

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setSuccess('Xóa thành công!');
            setTimeout(() => onSuccess?.(), 1000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>
                {formData.locID ? 'Sửa địa điểm' : 'Thêm địa điểm mới'}
            </h2>

            <form onSubmit={handleSubmit} style={styles.form}>
                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}

                <div style={styles.grid}>
                    <div style={styles.col2}>
                        <label style={styles.label}>Tên địa điểm *</label>
                        <input
                            style={styles.input}
                            value={formData.locName}
                            onChange={(e) => handleChange('locName', e.target.value)}
                            required
                            placeholder="VD: Vinpearl Resort"
                        />
                    </div>

                    <div style={styles.col1}>
                        <label style={styles.label}>Loại hình *</label>
                        <select
                            style={styles.select}
                            value={formData.locType}
                            onChange={(e) => handleChange('locType', e.target.value)}
                        >
                            <option value="HOTEL">Khách sạn</option>
                            <option value="RESTAURANT">Nhà hàng</option>
                            <option value="ENTERTAINMENT">Vui chơi giải trí</option>
                        </select>
                    </div>

                    <div style={styles.col1}>
                        <label style={styles.label}>Tầm giá *</label>
                        <select
                            style={styles.select}
                            value={formData.priceLev}
                            onChange={(e) => handleChange('priceLev', e.target.value)}
                        >
                            <option value="BUDGET">Bình dân</option>
                            <option value="MODERATE">Trung bình</option>
                            <option value="UPSCALE">Cao cấp</option>
                            <option value="LUXURY">Sang trọng</option>
                        </select>
                    </div>

                    <div style={styles.col1}>
                        <label style={styles.label}>Số nhà</label>
                        <input
                            style={styles.input}
                            value={formData.locNo}
                            onChange={(e) => handleChange('locNo', e.target.value)}
                            placeholder="VD: 123"
                        />
                    </div>

                    <div style={styles.col1}>
                        <label style={styles.label}>Đường *</label>
                        <input
                            style={styles.input}
                            value={formData.street}
                            onChange={(e) => handleChange('street', e.target.value)}
                            required
                            placeholder="VD: Trần Hưng Đạo"
                        />
                    </div>

                    <div style={styles.col1}>
                        <label style={styles.label}>Phường/Xã</label>
                        <input
                            style={styles.input}
                            value={formData.ward}
                            onChange={(e) => handleChange('ward', e.target.value)}
                            placeholder="VD: Phường 1"
                        />
                    </div>

                    <div style={styles.col1}>
                        <label style={styles.label}>Quận/Huyện *</label>
                        <input
                            style={styles.input}
                            value={formData.district}
                            onChange={(e) => handleChange('district', e.target.value)}
                            required
                            placeholder="VD: Quận 1"
                        />
                    </div>

                    <div style={styles.col1}>
                        <label style={styles.label}>Tỉnh/TP *</label>
                        <input
                            style={styles.input}
                            value={formData.province}
                            onChange={(e) => handleChange('province', e.target.value)}
                            required
                            placeholder="VD: TP. Hồ Chí Minh"
                        />
                    </div>

                    <div style={styles.col2}>
                        <label style={styles.label}>Mô tả</label>
                        <textarea
                            style={styles.textarea}
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Mô tả chi tiết về địa điểm..."
                            rows={4}
                        />
                    </div>
                </div>

                <div style={styles.buttons}>
                    <button type="submit" style={styles.btnPrimary} disabled={loading}>
                        {loading ? 'Đang xử lý...' : (formData.locID ? 'Cập nhật' : 'Thêm mới')}
                    </button>

                    {formData.locID && (
                        <button
                            type="button"
                            style={styles.btnDanger}
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            Xóa địa điểm
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

const styles = {
    card: {
        background: 'rgba(30, 32, 37, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 10px 40px rgba(139, 92, 246, 0.2)',
        maxWidth: '900px',
        margin: '0 auto',
        fontFamily: 'Montserrat, sans-serif'
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '24px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px'
    },
    col1: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '8px'
    },
    col2: {
        gridColumn: 'span 2',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '8px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.9)'
    },
    input: {
        padding: '12px 16px',
        background: 'rgba(10, 10, 11, 0.6)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '10px',
        color: '#FFFFFF',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.3s',
        fontFamily: 'Montserrat, sans-serif'
    },
    select: {
        padding: '12px 16px',
        background: 'rgba(10, 10, 11, 0.6)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '10px',
        color: '#FFFFFF',
        fontSize: '14px',
        outline: 'none',
        cursor: 'pointer',
        fontFamily: 'Montserrat, sans-serif'
    },
    textarea: {
        padding: '12px 16px',
        background: 'rgba(10, 10, 11, 0.6)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '10px',
        color: '#FFFFFF',
        fontSize: '14px',
        outline: 'none',
        resize: 'vertical' as const,
        fontFamily: 'Montserrat, sans-serif'
    },
    buttons: {
        display: 'flex',
        gap: '12px',
        marginTop: '8px'
    },
    btnPrimary: {
        padding: '14px 32px',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
        boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)',
        fontFamily: 'Montserrat, sans-serif'
    },
    btnDanger: {
        padding: '14px 32px',
        background: 'rgba(239, 68, 68, 0.9)',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontFamily: 'Montserrat, sans-serif'
    },
    error: {
        padding: '14px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '10px',
        color: '#FCA5A5',
        fontSize: '14px',
        fontWeight: '500'
    },
    success: {
        padding: '14px',
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '10px',
        color: '#6EE7B7',
        fontSize: '14px',
        fontWeight: '500'
    }
};

// Add styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  input:focus, select:focus, textarea:focus {
    border-color: #8B5CF6 !important;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15) !important;
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(139, 92, 246, 0.4);
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  select option {
    background: #1E2025;
    color: #FFF;
  }
`;
document.head.appendChild(styleSheet);
