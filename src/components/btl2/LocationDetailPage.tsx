import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

type TabType = 'info' | 'images' | 'utilities' | 'preferences' | 'products';

interface LocationImage {
    imageID: number;
    URL: string;
    caption: string;
    imageType: string;
}

interface Utility {
    utility: number;
    uName: string;
    uType: string;
    UDescription: string;
}

interface Preference {
    prefID: number;
    prefName: string;
    category: string;
    prefDescription: string;
}

interface Product {
    productID: number;
    productName: string;
    category: string;
    basePrice: number;
    pricingUnit: string;
    description: string;
}

export default function LocationDetailPage() {
    const { locID } = useParams();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<TabType>('info');
    const [location, setLocation] = useState<any>(null);
    const [images, setImages] = useState<LocationImage[]>([]);
    const [utilities, setUtilities] = useState<Utility[]>([]);
    const [preferences, setPreferences] = useState<Preference[]>([]);
    const [allPreferences, setAllPreferences] = useState<Preference[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // Edit Location Modal
    const [showEditLocationModal, setShowEditLocationModal] = useState(false);
    const [editLocationData, setEditLocationData] = useState<any>({});

    // Image Modal
    const [showAddImageModal, setShowAddImageModal] = useState(false);
    const [showEditImageModal, setShowEditImageModal] = useState(false);
    const [editImageID, setEditImageID] = useState<number | null>(null);
    const [imageURL, setImageURL] = useState('');
    const [imageCaption, setImageCaption] = useState('');

    // Utility Modal
    const [showAddUtilityModal, setShowAddUtilityModal] = useState(false);
    const [showEditUtilityModal, setShowEditUtilityModal] = useState(false);
    const [editUtilityID, setEditUtilityID] = useState<number | null>(null);
    const [utilityName, setUtilityName] = useState('');
    const [utilityType, setUtilityType] = useState('');
    const [utilityDesc, setUtilityDesc] = useState('');

    // Product Modal
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [editProductID, setEditProductID] = useState<number | null>(null);
    const [productName, setProductName] = useState('');
    const [productCategory, setProductCategory] = useState('ROOMTYPE');
    const [productPrice, setProductPrice] = useState('');
    const [productUnit, setProductUnit] = useState('');
    const [productDesc, setProductDesc] = useState('');

    useEffect(() => {
        if (locID) {
            fetchLocationDetails();
            if (activeTab === 'images') fetchImages();
            else if (activeTab === 'utilities') fetchUtilities();
            else if (activeTab === 'preferences') {
                fetchPreferences();
                fetchAllPreferences();
            }
            else if (activeTab === 'products') fetchProducts();
        }
    }, [locID, activeTab]);

    const fetchLocationDetails = async () => {
        try {
            const ownerID = localStorage.getItem('ownerBOID');
            const response = await fetch(`http://localhost:3001/make-server-aef03c12/owner/locations?ownerID=${ownerID}`);
            const data = await response.json();
            const loc = data.locations?.find((l: any) => l.locID === parseInt(locID!));
            setLocation(loc);
            setEditLocationData(loc);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const fetchImages = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/make-server-aef03c12/locations/${locID}/images`);
            const data = await response.json();
            if (data.success) setImages(data.images || []);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUtilities = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/make-server-aef03c12/locations/${locID}/utilities`);
            const data = await response.json();
            if (data.success) setUtilities(data.utilities || []);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchPreferences = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/make-server-aef03c12/locations/${locID}/preferences`);
            const data = await response.json();
            if (data.success) setPreferences(data.preferences || []);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllPreferences = async () => {
        try {
            const response = await fetch(`http://localhost:3001/make-server-aef03c12/preferences`);
            const data = await response.json();
            if (data.success) setAllPreferences(data.preferences || []);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/make-server-aef03c12/locations/${locID}/products`);
            const data = await response.json();
            if (data.success) setProducts(data.products || []);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateLocation = async () => {
        try {
            const response = await fetch(`http://localhost:3001/make-server-aef03c12/locations/${locID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editLocationData)
            });
            const data = await response.json();
            if (data.success) {
                setShowEditLocationModal(false);
                fetchLocationDetails();
                alert('Cập nhật thành công!');
            } else {
                alert(data.error);
            }
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleAddImage = async () => {
        if (!imageURL) return alert('Vui lòng nhập URL hình ảnh');
        try {
            const response = await fetch(`http://localhost:3001/make-server-aef03c12/locations/${locID}/images`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ URL: imageURL, caption: imageCaption })
            });
            const data = await response.json();
            if (data.success) {
                setShowAddImageModal(false);
                setImageURL('');
                setImageCaption('');
                fetchImages();
            } else alert(data.error);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleUpdateImage = async () => {
        try {
            const response = await fetch(`http://localhost:3001/make-server-aef03c12/images/${editImageID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ caption: imageCaption })
            });
            const data = await response.json();
            if (data.success) {
                setShowEditImageModal(false);
                fetchImages();
            } else alert(data.error);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDeleteImage = async (imageID: number) => {
        if (!confirm('Xóa hình ảnh?')) return;
        try {
            const response = await fetch(`http://localhost:3001/make-server-aef03c12/locations/${locID}/images/${imageID}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) fetchImages();
            else alert(data.error);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleAddUtility = async () => {
        if (!utilityName) return alert('Vui lòng nhập tên tiện ích');
        try {
            const response = await fetch(`http://localhost:3001/make-server-aef03c12/locations/${locID}/utilities`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uName: utilityName, uType: utilityType, UDescription: utilityDesc })
            });
            const data = await response.json();
            if (data.success) {
                setShowAddUtilityModal(false);
                setUtilityName('');
                setUtilityType('');
                setUtilityDesc('');
                fetchUtilities();
            } else alert(data.error);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleUpdateUtility = async () => {
        try {
            const response = await fetch(`http://localhost:3001/make-server-aef03c12/utilities/${editUtilityID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uName: utilityName, uType: utilityType, UDescription: utilityDesc })
            });
            const data = await response.json();
            if (data.success) {
                setShowEditUtilityModal(false);
                fetchUtilities();
            } else alert(data.error);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDeleteUtility = async (utilityID: number) => {
        if (!confirm('Xóa tiện ích?')) return;
        try {
            const response = await fetch(`http://localhost:3001/make-server-aef03c12/locations/${locID}/utilities/${utilityID}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) fetchUtilities();
            else alert(data.error);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleAddPreference = async (prefID: number) => {
        try {
            const response = await fetch(`http://localhost:3001/make-server-aef03c12/locations/${locID}/preferences`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prefID })
            });
            const data = await response.json();
            if (data.success) fetchPreferences();
            else alert(data.error);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleRemovePreference = async (prefID: number) => {
        try {
            const response = await fetch(`http://localhost:3001/make-server-aef03c12/locations/${locID}/preferences/${prefID}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) fetchPreferences();
            else alert(data.error);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleAddProduct = async () => {
        if (!productName || !productPrice) return alert('Vui lòng nhập đầy đủ thông tin');
        try {
            const response = await fetch(`http://localhost:3001/make-server-aef03c12/locations/${locID}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productName,
                    category: productCategory,
                    basePrice: parseFloat(productPrice),
                    pricingUnit: productUnit,
                    description: productDesc
                })
            });
            const data = await response.json();
            if (data.success) {
                setShowAddProductModal(false);
                setProductName('');
                setProductPrice('');
                setProductUnit('');
                setProductDesc('');
                fetchProducts();
            } else alert(data.error);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleUpdateProduct = async () => {
        try {
            const response = await fetch(`http://localhost:3001/make-server-aef03c12/products/${editProductID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productName,
                    basePrice: productPrice ? parseFloat(productPrice) : null,
                    pricingUnit: productUnit,
                    description: productDesc
                })
            });
            const data = await response.json();
            if (data.success) {
                setShowEditProductModal(false);
                fetchProducts();
            } else alert(data.error);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDeleteProduct = async (productID: number) => {
        if (!confirm('Xóa product?')) return;
        try {
            const response = await fetch(`http://localhost:3001/make-server-aef03c12/locations/${locID}/products/${productID}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) fetchProducts();
            else alert(data.error);
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (!location) return <div style={styles.loading}>Đang tải...</div>;

    const availablePrefs = allPreferences.filter(p => !preferences.find(pref => pref.prefID === p.prefID));

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button onClick={() => navigate('/locations')} style={styles.backButton}>← Quay lại</button>
                <h1 style={styles.title}>{location.locName}</h1>
                <div style={styles.subtitle}>{location.locType} • {location.province}</div>
            </div>

            <div style={styles.tabs}>
                {(['info', 'images', 'utilities', 'preferences', 'products'] as TabType[]).map(tab => (
                    <button
                        key={tab}
                        style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTab : {}) }}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === 'info' && '📋 Thông tin'}
                        {tab === 'images' && `📸 Hình ảnh (${images.length})`}
                        {tab === 'utilities' && `🛠️ Tiện ích (${utilities.length})`}
                        {tab === 'preferences' && `🏷️ Tags (${preferences.length})`}
                        {tab === 'products' && `📦 Products (${products.length})`}
                    </button>
                ))}
            </div>

            <div style={styles.content}>
                {activeTab === 'info' && (
                    <div>
                        <button onClick={() => setShowEditLocationModal(true)} style={styles.addButton}>✏️ Sửa thông tin</button>
                        <div style={styles.infoSection}>
                            <div style={styles.infoItem}><strong>Địa chỉ:</strong> {location.street}, {location.district}, {location.province}</div>
                            <div style={styles.infoItem}><strong>Loại hình:</strong> {location.locType}</div>
                            <div style={styles.infoItem}><strong>Mức giá:</strong> {location.priceLev || 'Chưa cập nhật'}</div>
                            <div style={styles.infoItem}><strong>Mô tả:</strong> {location.description || 'Chưa có mô tả'}</div>
                            <div style={styles.infoItem}><strong>Trạng thái:</strong> {location.status}</div>
                        </div>
                    </div>
                )}

                {activeTab === 'images' && (
                    <div>
                        <button onClick={() => setShowAddImageModal(true)} style={styles.addButton}>+ Thêm hình ảnh</button>
                        {loading ? <div style={styles.loading}>Đang tải...</div> : (
                            <div style={styles.imageGrid}>
                                {images.map(img => (
                                    <div key={img.imageID} style={styles.imageCard}>
                                        <img src={img.URL} alt={img.caption} style={styles.image} />
                                        <div style={styles.imageCaption}>{img.caption || 'Không có mô tả'}</div>
                                        <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
                                            <button onClick={() => {
                                                setEditImageID(img.imageID);
                                                setImageCaption(img.caption);
                                                setShowEditImageModal(true);
                                            }} style={styles.editButton}>✏️ Sửa</button>
                                            <button onClick={() => handleDeleteImage(img.imageID)} style={styles.deleteButton}>🗑️ Xóa</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'utilities' && (
                    <div>
                        <button onClick={() => setShowAddUtilityModal(true)} style={styles.addButton}>+ Thêm tiện ích</button>
                        {loading ? <div style={styles.loading}>Đang tải...</div> : (
                            <div style={styles.utilityList}>
                                {utilities.map(util => (
                                    <div key={util.utility} style={styles.utilityCard}>
                                        <div style={styles.utilityHeader}>
                                            <div>
                                                <div style={styles.utilityName}>{util.uName}</div>
                                                <div style={styles.utilityType}>{util.uType || 'Chưa phân loại'}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button onClick={() => {
                                                    setEditUtilityID(util.utility);
                                                    setUtilityName(util.uName);
                                                    setUtilityType(util.uType);
                                                    setUtilityDesc(util.UDescription);
                                                    setShowEditUtilityModal(true);
                                                }} style={styles.editButton}>✏️ Sửa</button>
                                                <button onClick={() => handleDeleteUtility(util.utility)} style={styles.deleteButton}>🗑️ Xóa</button>
                                            </div>
                                        </div>
                                        <div style={styles.utilityDesc}>{util.UDescription || 'Chưa có mô tả'}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'preferences' && (
                    <div>
                        <h3 style={styles.sectionTitle}>Tags hiện tại:</h3>
                        <div style={styles.prefTags}>
                            {preferences.map(pref => (
                                <div key={pref.prefID} style={styles.prefTag}>
                                    {pref.prefName}
                                    <button onClick={() => handleRemovePreference(pref.prefID)} style={styles.prefRemove}>×</button>
                                </div>
                            ))}
                        </div>
                        <h3 style={styles.sectionTitle}>Thêm tags:</h3>
                        <div style={styles.prefTags}>
                            {availablePrefs.map(pref => (
                                <div key={pref.prefID} style={styles.prefTagAvailable} onClick={() => handleAddPreference(pref.prefID)}>
                                    + {pref.prefName}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div>
                        <button onClick={() => setShowAddProductModal(true)} style={styles.addButton}>+ Thêm product</button>
                        {loading ? <div style={styles.loading}>Đang tải...</div> : (
                            <div style={styles.productList}>
                                {products.map(prod => (
                                    <div key={prod.productID} style={styles.productCard}>
                                        <div style={styles.productHeader}>
                                            <div>
                                                <div style={styles.productName}>{prod.productName}</div>
                                                <div style={styles.productCategory}>{prod.category}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button onClick={() => {
                                                    setEditProductID(prod.productID);
                                                    setProductName(prod.productName);
                                                    setProductPrice(prod.basePrice.toString());
                                                    setProductUnit(prod.pricingUnit);
                                                    setProductDesc(prod.description);
                                                    setShowEditProductModal(true);
                                                }} style={styles.editButton}>✏️ Sửa</button>
                                                <button onClick={() => handleDeleteProduct(prod.productID)} style={styles.deleteButton}>🗑️ Xóa</button>
                                            </div>
                                        </div>
                                        <div style={styles.productPrice}>{prod.basePrice.toLocaleString('vi-VN')} đ / {prod.pricingUnit}</div>
                                        <div style={styles.productDesc}>{prod.description}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Location Modal */}
            {showEditLocationModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h2>Sửa Thông Tin Location</h2>
                        <input value={editLocationData.locName || ''} onChange={e => setEditLocationData({ ...editLocationData, locName: e.target.value })} placeholder="Tên" style={styles.input} />
                        <input value={editLocationData.street || ''} onChange={e => setEditLocationData({ ...editLocationData, street: e.target.value })} placeholder="Đường" style={styles.input} />
                        <input value={editLocationData.district || ''} onChange={e => setEditLocationData({ ...editLocationData, district: e.target.value })} placeholder="Quận" style={styles.input} />
                        <input value={editLocationData.province || ''} onChange={e => setEditLocationData({ ...editLocationData, province: e.target.value })} placeholder="Tỉnh" style={styles.input} />
                        <textarea value={editLocationData.description || ''} onChange={e => setEditLocationData({ ...editLocationData, description: e.target.value })} placeholder="Mô tả" style={{ ...styles.input, minHeight: '80px' }} />
                        <div style={styles.modalButtons}>
                            <button onClick={handleUpdateLocation} style={styles.saveButton}>Lưu</button>
                            <button onClick={() => setShowEditLocationModal(false)} style={styles.cancelButton}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Image Modal */}
            {showAddImageModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h2>Thêm Hình Ảnh</h2>
                        <input value={imageURL} onChange={e => setImageURL(e.target.value)} placeholder="URL" style={styles.input} />
                        <input value={imageCaption} onChange={e => setImageCaption(e.target.value)} placeholder="Mô tả" style={styles.input} />
                        <div style={styles.modalButtons}>
                            <button onClick={handleAddImage} style={styles.saveButton}>Thêm</button>
                            <button onClick={() => setShowAddImageModal(false)} style={styles.cancelButton}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Image Modal */}
            {showEditImageModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h2>Sửa Mô Tả Hình Ảnh</h2>
                        <input value={imageCaption} onChange={e => setImageCaption(e.target.value)} placeholder="Mô tả" style={styles.input} />
                        <div style={styles.modalButtons}>
                            <button onClick={handleUpdateImage} style={styles.saveButton}>Lưu</button>
                            <button onClick={() => setShowEditImageModal(false)} style={styles.cancelButton}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Utility Modal */}
            {showAddUtilityModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h2>Thêm Tiện Ích</h2>
                        <input value={utilityName} onChange={e => setUtilityName(e.target.value)} placeholder="Tên" style={styles.input} />
                        <input value={utilityType} onChange={e => setUtilityType(e.target.value)} placeholder="Loại" style={styles.input} />
                        <textarea value={utilityDesc} onChange={e => setUtilityDesc(e.target.value)} placeholder="Mô tả" style={{ ...styles.input, minHeight: '80px' }} />
                        <div style={styles.modalButtons}>
                            <button onClick={handleAddUtility} style={styles.saveButton}>Thêm</button>
                            <button onClick={() => setShowAddUtilityModal(false)} style={styles.cancelButton}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Utility Modal */}
            {showEditUtilityModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h2>Sửa Tiện Ích</h2>
                        <input value={utilityName} onChange={e => setUtilityName(e.target.value)} placeholder="Tên" style={styles.input} />
                        <input value={utilityType} onChange={e => setUtilityType(e.target.value)} placeholder="Loại" style={styles.input} />
                        <textarea value={utilityDesc} onChange={e => setUtilityDesc(e.target.value)} placeholder="Mô tả" style={{ ...styles.input, minHeight: '80px' }} />
                        <div style={styles.modalButtons}>
                            <button onClick={handleUpdateUtility} style={styles.saveButton}>Lưu</button>
                            <button onClick={() => setShowEditUtilityModal(false)} style={styles.cancelButton}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Product Modal */}
            {showAddProductModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h2>Thêm Product</h2>
                        <input value={productName} onChange={e => setProductName(e.target.value)} placeholder="Tên product" style={styles.input} />
                        <select value={productCategory} onChange={e => setProductCategory(e.target.value)} style={styles.input}>
                            <option value="ROOMTYPE">ROOMTYPE</option>
                            <option value="TABLE_TYPE">TABLE_TYPE</option>
                            <option value="TICKET_TYPE">TICKET_TYPE</option>
                        </select>
                        <input value={productPrice} onChange={e => setProductPrice(e.target.value)} placeholder="Giá" type="number" style={styles.input} />
                        <input value={productUnit} onChange={e => setProductUnit(e.target.value)} placeholder="Đơn vị (night/hour/person)" style={styles.input} />
                        <textarea value={productDesc} onChange={e => setProductDesc(e.target.value)} placeholder="Mô tả" style={{ ...styles.input, minHeight: '80px' }} />
                        <div style={styles.modalButtons}>
                            <button onClick={handleAddProduct} style={styles.saveButton}>Thêm</button>
                            <button onClick={() => setShowAddProductModal(false)} style={styles.cancelButton}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {showEditProductModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h2>Sửa Product</h2>
                        <input value={productName} onChange={e => setProductName(e.target.value)} placeholder="Tên" style={styles.input} />
                        <input value={productPrice} onChange={e => setProductPrice(e.target.value)} placeholder="Giá" type="number" style={styles.input} />
                        <input value={productUnit} onChange={e => setProductUnit(e.target.value)} placeholder="Đơn vị" style={styles.input} />
                        <textarea value={productDesc} onChange={e => setProductDesc(e.target.value)} placeholder="Mô tả" style={{ ...styles.input, minHeight: '80px' }} />
                        <div style={styles.modalButtons}>
                            <button onClick={handleUpdateProduct} style={styles.saveButton}>Lưu</button>
                            <button onClick={() => setShowEditProductModal(false)} style={styles.cancelButton}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '30px' },
    backButton: { background: 'rgba(139, 92, 246, 0.2)', color: '#A855F7', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '15px' },
    title: { fontSize: '32px', fontWeight: '700', background: 'linear-gradient(135deg, #8B5CF6, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' },
    subtitle: { color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' },
    tabs: { display: 'flex', gap: '10px', borderBottom: '1px solid rgba(139, 92, 246, 0.2)', marginBottom: '30px', flexWrap: 'wrap' as const },
    tab: { background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.6)', padding: '12px 20px', cursor: 'pointer', borderBottom: '2px solid transparent', transition: 'all 0.3s' },
    activeTab: { color: '#A855F7', borderBottomColor: '#A855F7' },
    content: { minHeight: '400px' },
    infoSection: { display: 'flex', flexDirection: 'column' as const, gap: '15px' },
    infoItem: { background: 'rgba(30, 32, 37, 0.6)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)', color: 'rgba(255, 255, 255, 0.9)' },
    addButton: { background: 'linear-gradient(135deg, #8B5CF6, #A855F7)', color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', marginBottom: '20px', fontWeight: '600' },
    editButton: { background: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
    deleteButton: { background: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
    imageGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
    imageCard: { background: 'rgba(30, 32, 37, 0.6)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '12px', overflow: 'hidden' },
    image: { width: '100%', height: '200px', objectFit: 'cover' as const },
    imageCaption: { padding: '12px', color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' },
    utilityList: { display: 'flex', flexDirection: 'column' as const, gap: '15px' },
    utilityCard: { background: 'rgba(30, 32, 37, 0.6)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '12px', padding: '20px' },
    utilityHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
    utilityName: { fontSize: '18px', fontWeight: '600', color: '#FFF', marginBottom: '5px' },
    utilityType: { fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' },
    utilityDesc: { color: 'rgba(255, 255, 255, 0.8)' },
    sectionTitle: { color: '#A855F7', marginTop: '20px', marginBottom: '15px' },
    prefTags: { display: 'flex', flexWrap: 'wrap' as const, gap: '10px', marginBottom: '20px' },
    prefTag: { background: 'linear-gradient(135deg, #8B5CF6, #A855F7)', color: '#FFF', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' },
    prefRemove: { background: 'rgba(255, 255, 255, 0.2)', border: 'none', color: '#FFF', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '16px', lineHeight: '1' },
    prefTagAvailable: { background: 'rgba(139, 92, 246, 0.2)', color: '#A855F7', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', border: '1px solid rgba(139, 92, 246, 0.3)' },
    productList: { display: 'flex', flexDirection: 'column' as const, gap: '15px' },
    productCard: { background: 'rgba(30, 32, 37, 0.6)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '12px', padding: '20px' },
    productHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
    productName: { fontSize: '18px', fontWeight: '600', color: '#FFF', marginBottom: '5px' },
    productCategory: { fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', background: 'rgba(139, 92, 246, 0.2)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block' },
    productPrice: { fontSize: '16px', color: '#A855F7', fontWeight: '600', marginBottom: '8px' },
    productDesc: { color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' },
    loading: { textAlign: 'center' as const, padding: '40px', color: 'rgba(255, 255, 255, 0.6)' },
    modal: { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { background: 'rgba(30, 32, 37, 0.95)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.3)', minWidth: '400px', maxHeight: '80vh', overflowY: 'auto' as const },
    input: { width: '100%', padding: '12px', background: 'rgba(10, 10, 11, 0.6)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '8px', color: '#FFF', marginBottom: '15px' },
    modalButtons: { display: 'flex', gap: '10px', justifyContent: 'flex-end' },
    saveButton: { background: 'linear-gradient(135deg, #8B5CF6, #A855F7)', color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' },
    cancelButton: { background: 'rgba(139, 92, 246, 0.2)', color: '#A855F7', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }
};
