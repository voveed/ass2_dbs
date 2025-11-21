import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Plus, MapPin, Edit, Trash2, ArrowLeft, Star, TrendingUp, Check, Clock, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { apiCall } from '../utils/api';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface BusinessOwnerDashboardProps {
    user: any;
}

export function BusinessOwnerDashboard({ user }: BusinessOwnerDashboardProps) {
    const [, setLocationRoute] = useLocation();
    const [locations, setLocations] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [stats, setStats] = useState({ total: 0, avgRating: 0, totalReviews: 0 });
    const [isLoading, setIsLoading] = useState(true);

    // ✅ FILTERS for Location List (BTL2 Requirement 3.2)
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [sortBy, setSortBy] = useState('createdDate');

    // ✅ STATISTICS (BTL2 Requirement 3.3)
    const [statistics, setStatistics] = useState<any[]>([]);
    const [statsLoading, setStatsLoading] = useState(false);
    const [startDate, setStartDate] = useState('2025-01-01');
    const [endDate, setEndDate] = useState('2025-12-31');

    useEffect(() => {
        if (user && user.role === 'business_owner') {
            loadLocations();
            loadBookings();
        }
    }, [user]);

    const loadLocations = async () => {
        setIsLoading(true);
        try {
            // Build query params with filters
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (typeFilter !== 'all') params.append('type', typeFilter);
            params.append('sortBy', sortBy);

            const data = await apiCall(`/owner/locations?${params.toString()}`);
            const myLocations = (data.locations || []);
            setLocations(myLocations);

            // Calculate stats
            const total = myLocations.length;
            const totalReviews = myLocations.reduce((sum: number, loc: any) => sum + (loc.reviewCount || 0), 0);
            const avgRating = myLocations.length > 0
                ? myLocations.reduce((sum: number, loc: any) => sum + (loc.avgRating || 0), 0) / myLocations.length
                : 0;

            setStats({ total, avgRating, totalReviews });
        } catch (error) {
            console.error('Error loading locations:', error);
            toast.error('Không thể tải danh sách địa điểm');
        } finally {
            setIsLoading(false);
        }
    };

    const loadBookings = async () => {
        try {
            const data = await apiCall('/owner/bookings');
            setBookings(data.bookings || []);
        } catch (error) {
            console.error('Error loading bookings:', error);
        }
    };

    const loadStatistics = async () => {
        setStatsLoading(true);
        try {
            const params = new URLSearchParams({
                startDate,
                endDate,
                minRevenue: '0'
            });

            const data = await apiCall(`/owner/statistics?${params.toString()}`);
            setStatistics(data.statistics || []);
        } catch (error) {
            console.error('Error loading statistics:', error);
            toast.error('Không thể tải thống kê. Endpoint có thể chưa sẵn sàng.');
            // Fallback: Create mock data for demo
            setStatistics([
                { locID: 1, locName: 'Demo Location 1', totalRevenue: 50000000, bookingCount: 25, avgReservationValue: 2000000 },
                { locID: 2, locName: 'Demo Location 2', totalRevenue: 30000000, bookingCount: 15, avgReservationValue: 2000000 },
            ]);
        } finally {
            setStatsLoading(false);
        }
    };

    const handleDeleteLocation = async (locId: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa (vô hiệu hóa) địa điểm này?')) return;

        try {
            const accessToken = localStorage.getItem('accessToken');
            await apiCall(`/locations/${locId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            toast.success('Đã xóa địa điểm thành công');
            loadLocations();
        } catch (error: any) {
            console.error('Error deleting location:', error);
            toast.error(error.message || 'Không thể xóa địa điểm');
        }
    };

    const handleConfirmBooking = async (bookingId: number) => {
        try {
            await apiCall(`/owner/bookings/${bookingId}/confirm`, { method: 'PUT' });
            toast.success('Đã xác nhận đơn hàng');
            loadBookings();
        } catch (error: any) {
            toast.error(error.message || 'Lỗi khi xác nhận đơn hàng');
        }
    };

    const getTypeBadge = (type: string) => {
        const types: any = {
            hotel: { label: 'Khách sạn', variant: 'default' },
            restaurant: { label: 'Nhà hàng', variant: 'secondary' },
            entertainment: { label: 'Vui chơi', variant: 'outline' },
        };
        const config = types[type] || { label: type, variant: 'secondary' };
        return <Badge variant={config.variant as any}>{config.label}</Badge>;
    };

    if (!user || user.role !== 'business_owner') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <p className="text-xl text-muted-foreground mb-4">Trang chỉ dành cho chủ doanh nghiệp</p>
                    <Button onClick={() => setLocationRoute('/')}>Về trang chủ</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => setLocationRoute('/')}
                            className="mb-4 text-primary hover:text-primary/80 hover:bg-primary/10 glow-cyan"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Về trang chủ
                        </Button>
                        <h1 className="text-gradient neon-text">Quản lý doanh nghiệp</h1>
                        <p className="text-muted-foreground">Quản lý địa điểm và đơn đặt chỗ</p>
                    </div>
                    <Button onClick={() => setLocationRoute('/admin')} className="glow-cyan">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm địa điểm mới
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Tổng số địa điểm</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                <span className="text-3xl text-gradient">{stats.total}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Đánh giá trung bình</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-primary fill-primary" />
                                <span className="text-3xl text-gradient">{stats.avgRating.toFixed(1)}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Tổng số đánh giá</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                <span className="text-3xl text-gradient">{stats.totalReviews}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content with Tabs */}
                <Tabs defaultValue="locations" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="locations">Địa điểm của tôi</TabsTrigger>
                        <TabsTrigger value="bookings">
                            Đơn đặt chỗ
                            {bookings.filter(b => b.status === 'PENDING').length > 0 && (
                                <Badge className="ml-2 bg-red-500 text-white h-5 px-1.5">
                                    {bookings.filter(b => b.status === 'PENDING').length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="statistics">Thống kê</TabsTrigger>
                    </TabsList>

                    {/* Tab Locations */}
                    <TabsContent value="locations">
                        <Card>
                            <CardHeader>
                                <CardTitle>Danh sách địa điểm</CardTitle>

                                {/* ✅ BTL2 3.2: FILTERS */}
                                <div className="flex gap-3 mt-4 flex-wrap">
                                    <Input
                                        placeholder="Tìm kiếm theo tên..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && loadLocations()}
                                        className="max-w-xs"
                                    />

                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-3 py-2 border rounded-md bg-background"
                                    >
                                        <option value="all">Tất cả trạng thái</option>
                                        <option value="ACTIVE">Hoạt động</option>
                                        <option value="INACTIVE">Tạm ngưng</option>
                                    </select>

                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        className="px-3 py-2 border rounded-md bg-background"
                                    >
                                        <option value="all">Tất cả loại</option>
                                        <option value="hotel">Khách sạn</option>
                                        <option value="restaurant">Nhà hàng</option>
                                        <option value="entertainment">Vui chơi</option>
                                    </select>

                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-3 py-2 border rounded-md bg-background"
                                    >
                                        <option value="createdDate">Mới nhất</option>
                                        <option value="rating">Đánh giá cao</option>
                                        <option value="name">Tên A-Z</option>
                                    </select>

                                    <Button onClick={loadLocations} variant="default" className="glow-cyan">
                                        <Filter className="h-4 w-4 mr-2" />
                                        Lọc
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent>
                                {isLoading ? (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4 glow-cyan"></div>
                                        <p className="text-muted-foreground">Đang tải...</p>
                                    </div>
                                ) : locations.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p className="mb-4">Không tìm thấy địa điểm nào</p>
                                        <Button onClick={() => setLocationRoute('/admin')} className="glow-cyan">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Thêm địa điểm đầu tiên
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Hình ảnh</TableHead>
                                                    <TableHead>Tên địa điểm</TableHead>
                                                    <TableHead>Loại</TableHead>
                                                    <TableHead>Địa chỉ</TableHead>
                                                    <TableHead>Đánh giá</TableHead>
                                                    <TableHead>Trạng thái</TableHead>
                                                    <TableHead className="text-right">Thao tác</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {locations.map((location) => (
                                                    <TableRow key={location.locId}>
                                                        <TableCell>
                                                            <ImageWithFallback
                                                                src={location.imageUrl}
                                                                alt={location.locName}
                                                                className="w-16 h-16 object-cover rounded border border-border"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="max-w-xs">
                                                                <p className="truncate font-medium">{location.locName}</p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{getTypeBadge(location.locType)}</TableCell>
                                                        <TableCell>
                                                            <div className="text-sm text-muted-foreground">
                                                                {location.district}, {location.province}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1">
                                                                <Star className="h-4 w-4 fill-primary text-primary" />
                                                                <span>{location.avgRating?.toFixed(1) || 'N/A'}</span>
                                                                <span className="text-muted-foreground text-sm">({location.reviewCount || 0})</span>
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
                                                                    onClick={() => setLocationRoute(`/location/${location.locId}`)}
                                                                    className="hover:text-primary hover:bg-primary/10"
                                                                >
                                                                    Xem
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => setLocationRoute(`/admin?edit=${location.locId}`)}
                                                                    className="hover:text-primary hover:bg-primary/10"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleDeleteLocation(location.locId)}
                                                                    className="hover:text-destructive hover:bg-destructive/10"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab Bookings */}
                    <TabsContent value="bookings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Quản lý Đơn đặt chỗ</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {bookings.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        Chưa có đơn đặt chỗ nào.
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Mã đơn</TableHead>
                                                    <TableHead>Khách hàng</TableHead>
                                                    <TableHead>Địa điểm</TableHead>
                                                    <TableHead>Thời gian đặt</TableHead>
                                                    <TableHead>Tổng tiền</TableHead>
                                                    <TableHead>Trạng thái</TableHead>
                                                    <TableHead>Hành động</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {bookings.map((b) => (
                                                    <TableRow key={b.reservationID}>
                                                        <TableCell className="font-mono">#{b.reservationID}</TableCell>
                                                        <TableCell>
                                                            <div className="font-medium">{b.touristName}</div>
                                                            {b.note && <div className="text-xs text-muted-foreground italic">"{b.note}"</div>}
                                                        </TableCell>
                                                        <TableCell>{b.locName}</TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">
                                                            {new Date(b.resTimeStamp).toLocaleDateString('vi-VN')}
                                                            <br />
                                                            {new Date(b.resTimeStamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                        </TableCell>
                                                        <TableCell className="font-medium text-primary">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(b.totalAmount)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={
                                                                    b.status === 'PENDING' ? 'secondary' :
                                                                        b.status === 'CONFIRMED' ? 'default' :
                                                                            b.status === 'COMPLETED' ? 'outline' : 'destructive'
                                                                }
                                                                className={b.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30' : ''}
                                                            >
                                                                {b.status === 'PENDING' ? 'Chờ xác nhận' :
                                                                    b.status === 'CONFIRMED' ? 'Đã xác nhận' :
                                                                        b.status === 'COMPLETED' ? 'Hoàn thành' : 'Đã hủy'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {b.status === 'PENDING' && (
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleConfirmBooking(b.reservationID)}
                                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                                >
                                                                    <Check className="h-4 w-4 mr-1" /> Duyệt
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ✅ BTL2 3.3: STATISTICS TAB */}
                    <TabsContent value="statistics">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thống kê doanh thu</CardTitle>
                                <div className="flex gap-4 mt-4">
                                    <div>
                                        <label className="text-sm text-muted-foreground block mb-1">Từ ngày</label>
                                        <Input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground block mb-1">Đến ngày</label>
                                        <Input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </div>
                                    <Button onClick={loadStatistics} className="mt-6 glow-cyan">
                                        Xem báo cáo
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent>
                                {statsLoading ? (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4 glow-cyan"></div>
                                        <p className="mt-4 text-muted-foreground">Đang tải thống kê...</p>
                                    </div>
                                ) : statistics.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>Chưa có dữ liệu thống kê trong khoảng thời gian này</p>
                                    </div>
                                ) : (
                                    <div>
                                        {/* Summary Cards */}
                                        <div className="grid grid-cols-3 gap-4 mb-6">
                                            <Card className="border-primary/20">
                                                <CardContent className="pt-6">
                                                    <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
                                                    <h3 className="text-2xl font-bold text-gradient mt-2">
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(
                                                            statistics.reduce((sum, s) => sum + parseFloat(s.totalRevenue || 0), 0)
                                                        )}
                                                    </h3>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-primary/20">
                                                <CardContent className="pt-6">
                                                    <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
                                                    <h3 className="text-2xl font-bold text-gradient mt-2">
                                                        {statistics.reduce((sum, s) => sum + parseInt(s.bookingCount || 0), 0)}
                                                    </h3>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-primary/20">
                                                <CardContent className="pt-6">
                                                    <p className="text-sm text-muted-foreground">Địa điểm hoạt động</p>
                                                    <h3 className="text-2xl font-bold text-gradient mt-2">
                                                        {statistics.length}
                                                    </h3>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Table */}
                                        <div className="border rounded-lg">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Địa điểm</TableHead>
                                                        <TableHead className="text-right">Doanh thu</TableHead>
                                                        <TableHead className="text-right">Số đơn</TableHead>
                                                        <TableHead className="text-right">Trung bình/đơn</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {statistics.map((stat) => (
                                                        <TableRow key={stat.locID}>
                                                            <TableCell className="font-medium">
                                                                <div className="flex items-center gap-2">
                                                                    <MapPin className="h-4 w-4 text-primary" />
                                                                    {stat.locName}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right text-green-600 font-semibold">
                                                                {new Intl.NumberFormat('vi-VN', {
                                                                    style: 'currency',
                                                                    currency: 'VND'
                                                                }).format(stat.totalRevenue)}
                                                            </TableCell>
                                                            <TableCell className="text-right font-medium">
                                                                {stat.bookingCount}
                                                            </TableCell>
                                                            <TableCell className="text-right text-muted-foreground">
                                                                {new Intl.NumberFormat('vi-VN', {
                                                                    style: 'currency',
                                                                    currency: 'VND'
                                                                }).format(stat.avgReservationValue)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
