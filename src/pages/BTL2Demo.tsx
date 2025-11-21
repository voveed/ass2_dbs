import { useState } from 'react';
import { Plus, MapPin, Star, TrendingUp, Filter, Save, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

// MOCK DATA cho demo (không cần backend)
const MOCK_LOCATIONS = [
    { locId: 1, locName: 'InterContinental Đà Nẵng', locType: 'hotel', district: 'Sơn Trà', province: 'Đà Nẵng', status: 'ACTIVE', avgRating: 4.8, reviewCount: 152, priceLev: 'LUXURY' },
    { locId: 2, locName: 'Sofitel Metropole Hà Nội', locType: 'hotel', district: 'Hoàn Kiếm', province: 'Hà Nội', status: 'ACTIVE', avgRating: 4.7, reviewCount: 201 },
    { locId: 3, locName: 'Vinpearl Nha Trang', locType: 'hotel', district: 'Nha Trang', province: 'Khánh Hòa', status: 'ACTIVE', avgRating: 4.5, reviewCount: 89 },
    { locId: 4, locName: 'Pizza 4Ps Bến Thành', locType: 'restaurant', district: 'Quận 1', province: 'TP.HCM', status: 'ACTIVE', avgRating: 4.6, reviewCount: 340 },
    { locId: 5, locName: 'Anan Saigon', locType: 'restaurant', district: 'Quận 1', province: 'TP.HCM', status: 'ACTIVE', avgRating: 4.9, reviewCount: 78 },
    { locId: 6, locName: 'Bà Nà Hills', locType: 'entertainment', district: 'Hòa Vang', province: 'Đà Nẵng', status: 'ACTIVE', avgRating: 4.4, reviewCount: 567 },
];

const MOCK_STATISTICS = [
    { locName: 'InterContinental Đà Nẵng', totalRevenue: 150000000, bookingCount: 45, avgReservationValue: 3333333 },
    { locName: 'Sofitel Metropole Hà Nội', totalRevenue: 220000000, bookingCount: 68, avgReservationValue: 3235294 },
    { locName: 'Pizza 4Ps Bến Thành', totalRevenue: 85000000, bookingCount: 120, avgReservationValue: 708333 },
    { locName: 'Anan Saigon', totalRevenue: 65000000, bookingCount: 45, avgReservationValue: 1444444 },
];

export default function BTL2Demo() {
    // STATE cho tất cả 3 tabs
    const [locations, setLocations] = useState(MOCK_LOCATIONS);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [sortBy, setSortBy] = useState('createdDate');

    const [statistics] = useState(MOCK_STATISTICS);
    const [startDate, setStartDate] = useState('2025-01-01');
    const [endDate, setEndDate] = useState('2025-12-31');

    // STATE cho Form
    const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        locName: '',
        locType: 'hotel',
        district: '',
        province: '',
        street: '',
        priceLev: 'MEDIUM',
        description: ''
    });

    // ========================
    // 3.1: FORM CRUD HANDLERS
    // ========================
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.locName || !formData.district || !formData.province) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        if (formMode === 'add') {
            const newLocation = {
                locId: Math.max(...locations.map(l => l.locId)) + 1,
                ...formData,
                status: 'ACTIVE',
                avgRating: 0,
                reviewCount: 0
            };
            setLocations([...locations, newLocation]);
            toast.success('✅ Đã thêm địa điểm thành công!');
        } else {
            setLocations(locations.map(loc =>
                loc.locId === editingId ? { ...loc, ...formData } : loc
            ));
            toast.success('✅ Đã cập nhật địa điểm thành công!');
        }

        resetForm();
    };

    const handleEdit = (location: any) => {
        setFormMode('edit');
        setEditingId(location.locId);
        setFormData({
            locName: location.locName,
            locType: location.locType,
            district: location.district,
            province: location.province,
            street: location.street || '',
            priceLev: location.priceLev || 'MEDIUM',
            description: location.description || ''
        });
        toast.info('Đang chỉnh sửa địa điểm...');
    };

    const handleDelete = (locId: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa địa điểm này?')) return;

        setLocations(locations.filter(loc => loc.locId !== locId));
        toast.success('🗑️ Đã xóa địa điểm thành công!');
    };

    const resetForm = () => {
        setFormMode('add');
        setEditingId(null);
        setFormData({
            locName: '',
            locType: 'hotel',
            district: '',
            province: '',
            street: '',
            priceLev: 'MEDIUM',
            description: ''
        });
    };

    // ========================
    // 3.2: FILTER LOGIC
    // ========================
    const filteredLocations = locations.filter(loc => {
        const matchSearch = searchQuery === '' || loc.locName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === 'all' || loc.status === statusFilter;
        const matchType = typeFilter === 'all' || loc.locType === typeFilter;
        return matchSearch && matchStatus && matchType;
    }).sort((a, b) => {
        if (sortBy === 'rating') return (b.avgRating || 0) - (a.avgRating || 0);
        if (sortBy === 'name') return a.locName.localeCompare(b.locName);
        return b.locId - a.locId; // newest first
    });

    const getTypeBadge = (type: string) => {
        const types: any = {
            hotel: { label: 'Khách sạn', variant: 'default' },
            restaurant: { label: 'Nhà hàng', variant: 'secondary' },
            entertainment: { label: 'Vui chơi', variant: 'outline' },
        };
        const config = types[type] || { label: type, variant: 'secondary' };
        return <Badge variant={config.variant as any}>{config.label}</Badge>;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                        BTL2 - Business Owner Dashboard
                    </h1>
                    <p className="text-slate-400">3 UI Components: Form CRUD • List + Filter • Statistics</p>
                </div>

                {/* Stats Summary */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card className="border-cyan-500/20 bg-slate-900/50 backdrop-blur">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-slate-300">Tổng số địa điểm</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-cyan-400" />
                                <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    {filteredLocations.length}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-cyan-500/20 bg-slate-900/50 backdrop-blur">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-slate-300">Đánh giá TB</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                <span className="text-3xl font-bold text-yellow-400">
                                    {(filteredLocations.reduce((sum, loc) => sum + (loc.avgRating || 0), 0) / filteredLocations.length).toFixed(1)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-cyan-500/20 bg-slate-900/50 backdrop-blur">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-slate-300">Tổng reviews</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-400" />
                                <span className="text-3xl font-bold text-green-400">
                                    {filteredLocations.reduce((sum, loc) => sum + (loc.reviewCount || 0), 0)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* MAIN TABS */}
                <Tabs defaultValue="form" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-cyan-500/20">
                        <TabsTrigger value="form" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                            ✅ 3.1: Form CRUD
                        </TabsTrigger>
                        <TabsTrigger value="list" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                            ✅ 3.2: List + Filter
                        </TabsTrigger>
                        <TabsTrigger value="stats" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                            ✅ 3.3: Statistics
                        </TabsTrigger>
                    </TabsList>

                    {/* ======================== */}
                    {/* TAB 1: FORM CRUD (3.1)   */}
                    {/* ======================== */}
                    <TabsContent value="form">
                        <Card className="border-cyan-500/20 bg-slate-900/50 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-cyan-400">
                                    {formMode === 'add' ? '➕ Thêm Địa Điểm Mới' : '✏️ Chỉnh Sửa Địa Điểm'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                                Tên địa điểm <span className="text-red-400">*</span>
                                            </label>
                                            <Input
                                                value={formData.locName}
                                                onChange={(e) => setFormData({ ...formData, locName: e.target.value })}
                                                placeholder="VD: Vinpearl Resort Nha Trang"
                                                className="bg-slate-800 border-slate-700 text-white"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                                Loại hình <span className="text-red-400">*</span>
                                            </label>
                                            <select
                                                value={formData.locType}
                                                onChange={(e) => setFormData({ ...formData, locType: e.target.value })}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                                            >
                                                <option value="hotel">Khách sạn</option>
                                                <option value="restaurant">Nhà hàng</option>
                                                <option value="entertainment">Vui chơi</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                                Quận/Huyện <span className="text-red-400">*</span>
                                            </label>
                                            <Input
                                                value={formData.district}
                                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                                placeholder="VD: Quận 1"
                                                className="bg-slate-800 border-slate-700 text-white"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                                Tỉnh/Thành phố <span className="text-red-400">*</span>
                                            </label>
                                            <Input
                                                value={formData.province}
                                                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                                                placeholder="VD: TP.HCM"
                                                className="bg-slate-800 border-slate-700 text-white"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Đường</label>
                                            <Input
                                                value={formData.street}
                                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                                placeholder="VD: Lê Duẩn"
                                                className="bg-slate-800 border-slate-700 text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Tầm giá</label>
                                            <select
                                                value={formData.priceLev}
                                                onChange={(e) => setFormData({ ...formData, priceLev: e.target.value })}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                                            >
                                                <option value="BUDGET">Bình dân</option>
                                                <option value="MEDIUM">Trung bình</option>
                                                <option value="HIGH">Cao cấp</option>
                                                <option value="LUXURY">Sang trọng</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Mô tả</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Mô tả chi tiết về địa điểm..."
                                            rows={3}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            type="submit"
                                            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {formMode === 'add' ? 'Thêm mới' : 'Cập nhật'}
                                        </Button>

                                        {formMode === 'edit' && (
                                            <Button type="button" variant="outline" onClick={resetForm}>
                                                Hủy
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ======================== */}
                    {/* TAB 2: LIST + FILTER (3.2) */}
                    {/* ======================== */}
                    <TabsContent value="list">
                        <Card className="border-cyan-500/20 bg-slate-900/50 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-cyan-400">📋 Danh Sách Địa Điểm</CardTitle>

                                {/* FILTERS */}
                                <div className="flex gap-3 mt-4 flex-wrap">
                                    <Input
                                        placeholder="🔍 Tìm theo tên..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="max-w-xs bg-slate-800 border-slate-700 text-white"
                                    />

                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                                    >
                                        <option value="all">Tất cả trạng thái</option>
                                        <option value="ACTIVE">Hoạt động</option>
                                        <option value="INACTIVE">Tạm ngưng</option>
                                    </select>

                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                                    >
                                        <option value="all">Tất cả loại</option>
                                        <option value="hotel">Khách sạn</option>
                                        <option value="restaurant">Nhà hàng</option>
                                        <option value="entertainment">Vui chơi</option>
                                    </select>

                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                                    >
                                        <option value="createdDate">Mới nhất</option>
                                        <option value="rating">Đánh giá cao</option>
                                        <option value="name">Tên A-Z</option>
                                    </select>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="rounded-lg border border-slate-700 overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-800/50">
                                                <TableHead className="text-slate-300">Tên địa điểm</TableHead>
                                                <TableHead className="text-slate-300">Loại</TableHead>
                                                <TableHead className="text-slate-300">Địa chỉ</TableHead>
                                                <TableHead className="text-slate-300">Đánh giá</TableHead>
                                                <TableHead className="text-slate-300">Trạng thái</TableHead>
                                                <TableHead className="text-right text-slate-300">Hành động</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredLocations.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                                                        Không tìm thấy địa điểm nào
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredLocations.map((location) => (
                                                    <TableRow key={location.locId} className="border-slate-700">
                                                        <TableCell className="font-medium text-white">{location.locName}</TableCell>
                                                        <TableCell>{getTypeBadge(location.locType)}</TableCell>
                                                        <TableCell className="text-slate-300">
                                                            {location.district}, {location.province}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1">
                                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                                <span className="text-white">{location.avgRating.toFixed(1)}</span>
                                                                <span className="text-slate-400 text-sm">({location.reviewCount})</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={location.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                                                {location.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm ngưng'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleEdit(location)}
                                                                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                                                                >
                                                                    Sửa
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleDelete(location.locId)}
                                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ======================== */}
                    {/* TAB 3: STATISTICS (3.3) */}
                    {/* ======================== */}
                    <TabsContent value="stats">
                        <Card className="border-cyan-500/20 bg-slate-900/50 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-cyan-400">📊 Thống Kê Doanh Thu</CardTitle>
                                <div className="flex gap-4 mt-4">
                                    <div>
                                        <label className="block text-sm text-slate-300 mb-1">Từ ngày</label>
                                        <Input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="bg-slate-800 border-slate-700 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-300 mb-1">Đến ngày</label>
                                        <Input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="bg-slate-800 border-slate-700 text-white"
                                        />
                                    </div>
                                    <Button className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-500">
                                        Xem báo cáo
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent>
                                {/* Summary Cards */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <Card className="border-cyan-500/20 bg-slate-800/50">
                                        <CardContent className="pt-6">
                                            <p className="text-sm text-slate-400">Tổng doanh thu</p>
                                            <h3 className="text-2xl font-bold text-green-400 mt-2">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                                    statistics.reduce((sum, s) => sum + s.totalRevenue, 0)
                                                )}
                                            </h3>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-cyan-500/20 bg-slate-800/50">
                                        <CardContent className="pt-6">
                                            <p className="text-sm text-slate-400">Tổng đơn hàng</p>
                                            <h3 className="text-2xl font-bold text-cyan-400 mt-2">
                                                {statistics.reduce((sum, s) => sum + s.bookingCount, 0)}
                                            </h3>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-cyan-500/20 bg-slate-800/50">
                                        <CardContent className="pt-6">
                                            <p className="text-sm text-slate-400">Địa điểm hoạt động</p>
                                            <h3 className="text-2xl font-bold text-yellow-400 mt-2">
                                                {statistics.length}
                                            </h3>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Statistics Table */}
                                <div className="rounded-lg border border-slate-700 overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-800/50">
                                                <TableHead className="text-slate-300">Địa điểm</TableHead>
                                                <TableHead className="text-right text-slate-300">Doanh thu</TableHead>
                                                <TableHead className="text-right text-slate-300">Số đơn</TableHead>
                                                <TableHead className="text-right text-slate-300">TB/đơn</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {statistics.map((stat, idx) => (
                                                <TableRow key={idx} className="border-slate-700">
                                                    <TableCell className="font-medium text-white">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4 text-cyan-400" />
                                                            {stat.locName}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right text-green-400 font-semibold">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stat.totalRevenue)}
                                                    </TableCell>
                                                    <TableCell className="text-right text-white font-medium">
                                                        {stat.bookingCount}
                                                    </TableCell>
                                                    <TableCell className="text-right text-slate-300">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stat.avgReservationValue)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
