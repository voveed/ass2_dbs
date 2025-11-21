import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Plus, Save, Trash2, Edit, Database, 
  Users, MapPin, Tag, Image as ImageIcon, 
  CreditCard, Calendar, Settings, Package, Star,
  Upload, X, AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { apiCall, getSession } from '../utils/api';
import { toast } from 'sonner';

export function DataManagement() {
  const [, setLocationRoute] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('users');
  const [isLoading, setIsLoading] = useState(false);

  // Data states
  const [users, setUsers] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [utilities, setUtilities] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const session = await getSession();
      if (!session?.user) {
        setLocationRoute('/auth');
        return;
      }
      
      if (session.user.role !== 'admin') {
        toast.error('Chỉ quản trị viên mới có quyền truy cập');
        setLocationRoute('/');
        return;
      }
      
      setUser(session.user);
      loadAllData();
    } catch (error) {
      console.error('Error loading user:', error);
      setLocationRoute('/auth');
    }
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // Load all data in parallel
      const [
        usersData, 
        locationsData, 
        prefsData,
        reviewsData
      ] = await Promise.all([
        apiCall('/admin/users'),
        apiCall('/locations'),
        apiCall('/admin/preferences'),
        apiCall('/reviews')
      ]);
      
      setUsers(usersData.users || []);
      setLocations(locationsData.locations || []);
      setPreferences(prefsData.preferences || []);
      setReviews(reviewsData.reviews || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-gradient mb-2">Quản Lý Dữ Liệu Hệ Thống</h1>
            <p className="text-muted-foreground">Quản lý toàn bộ dữ liệu trong database (32 bảng) - Full CRUD</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setLocationRoute('/admin-panel')}
            className="border-primary/50 text-primary hover:bg-primary/10"
          >
            <Database className="h-4 w-4 mr-2" />
            Về Bảng Điều Khiển
          </Button>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <ScrollArea className="w-full">
            <TabsList className="grid grid-cols-5 lg:grid-cols-10 gap-2 w-max">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="locations" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Locations</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Products</span>
              </TabsTrigger>
              <TabsTrigger value="vouchers" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Vouchers</span>
              </TabsTrigger>
              <TabsTrigger value="utilities" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Utilities</span>
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Images</span>
              </TabsTrigger>
              <TabsTrigger value="reservations" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Reservations</span>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Transactions</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Reviews</span>
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          {/* Tab Contents */}
          <TabsContent value="users">
            <UserManagement users={users} onRefresh={loadAllData} />
          </TabsContent>

          <TabsContent value="locations">
            <LocationManagement locations={locations} users={users} preferences={preferences} onRefresh={loadAllData} />
          </TabsContent>

          <TabsContent value="preferences">
            <PreferenceManagement preferences={preferences} onRefresh={loadAllData} />
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement onRefresh={loadAllData} />
          </TabsContent>

          <TabsContent value="vouchers">
            <VoucherManagement onRefresh={loadAllData} />
          </TabsContent>

          <TabsContent value="utilities">
            <UtilityManagement onRefresh={loadAllData} />
          </TabsContent>

          <TabsContent value="images">
            <ImageManagement onRefresh={loadAllData} />
          </TabsContent>

          <TabsContent value="reservations">
            <ReservationManagement onRefresh={loadAllData} />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionManagement onRefresh={loadAllData} />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewManagement reviews={reviews} onRefresh={loadAllData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ============================================================================
// USER MANAGEMENT - Full CRUD
// ============================================================================
function UserManagement({ users, onRefresh }: { users: any[]; onRefresh: () => void }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: any }>({ open: false, user: null });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'tourist',
    dob: '',
    city: '',
    district: '',
    nationality: '',
    legalID: '',
    taxCode: '',
  });

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
      role: 'tourist',
      dob: '',
      city: '',
      district: '',
      nationality: '',
      legalID: '',
      taxCode: '',
    });
    setEditingUser(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      email: user.email || '',
      password: '',
      fullName: user.fullName || '',
      role: user.role || 'tourist',
      dob: user.dob || '',
      city: user.city || '',
      district: user.district || '',
      nationality: user.nationality || '',
      legalID: user.legalID || '',
      taxCode: user.taxCode || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (user: any) => {
    setDeleteDialog({ open: true, user });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.user) return;
    
    try {
      await apiCall(`/admin/users/${deleteDialog.user.userId}`, {
        method: 'DELETE',
      });
      toast.success('Xóa người dùng thành công');
      setDeleteDialog({ open: false, user: null });
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi xóa người dùng');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        // Update
        await apiCall(`/admin/users/${editingUser.userId}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
        toast.success('Cập nhật người dùng thành công');
      } else {
        // Create
        await apiCall('/auth/signup', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        toast.success('Tạo người dùng thành công');
      }
      setIsDialogOpen(false);
      resetForm();
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi lưu người dùng');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>USER_ACCOUNT</CardTitle>
              <CardDescription>Quản lý tài khoản người dùng ({users.length} records)</CardDescription>
            </div>
            <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Thêm User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>DOB</TableHead>
                  <TableHead>Thành phố</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell className="font-mono text-xs">{user.userId}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'business_owner' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.dob}</TableCell>
                    <TableCell>{user.city}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(user)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Sửa User' : 'Thêm User mới'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email *</Label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <Label>Password {!editingUser && '*'}</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? 'Để trống nếu không đổi' : ''}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Họ tên *</Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div>
                <Label>Role *</Label>
                <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tourist">Tourist</SelectItem>
                    <SelectItem value="business_owner">Business Owner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>DOB (Ngày sinh) *</Label>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />
              </div>
              <div>
                <Label>Thành phố</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Quận/Huyện</Label>
              <Input
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              />
            </div>

            {formData.role === 'tourist' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nationality *</Label>
                  <Input
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Legal ID *</Label>
                  <Input
                    value={formData.legalID}
                    onChange={(e) => setFormData({ ...formData, legalID: e.target.value })}
                  />
                </div>
              </div>
            )}

            {formData.role === 'business_owner' && (
              <div>
                <Label>Tax Code *</Label>
                <Input
                  value={formData.taxCode}
                  onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              {editingUser ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa user "{deleteDialog.user?.fullName}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ============================================================================
// LOCATION MANAGEMENT - Full CRUD
// ============================================================================
function LocationManagement({ locations, users, preferences, onRefresh }: { locations: any[]; users: any[]; preferences: any[]; onRefresh: () => void }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; location: any }>({ open: false, location: null });
  const [formData, setFormData] = useState({
    locName: '',
    street: '',
    ward: '',
    district: '',
    province: '',
    locType: 'hotel',
    priceLev: '',
    description: '',
    ownerID: '',
    tags: [] as string[],
  });

  const businessOwners = users.filter(u => u.role === 'business_owner');

  const resetForm = () => {
    setFormData({
      locName: '',
      street: '',
      ward: '',
      district: '',
      province: '',
      locType: 'hotel',
      priceLev: '',
      description: '',
      ownerID: '',
      tags: [],
    });
    setEditingLocation(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (location: any) => {
    setEditingLocation(location);
    setFormData({
      locName: location.locName || '',
      street: location.street || '',
      ward: location.ward || '',
      district: location.district || '',
      province: location.province || '',
      locType: location.locType || 'hotel',
      priceLev: location.priceLev || '',
      description: location.description || '',
      ownerID: location.ownerID || '',
      tags: location.tags || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (location: any) => {
    setDeleteDialog({ open: true, location });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.location) return;
    
    try {
      await apiCall(`/admin/locations/${deleteDialog.location.locId}`, {
        method: 'DELETE',
      });
      toast.success('Xóa địa điểm thành công');
      setDeleteDialog({ open: false, location: null });
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi xóa địa điểm');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingLocation) {
        await apiCall(`/admin/locations/${editingLocation.locId}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
        toast.success('Cập nhật địa điểm thành công');
      } else {
        await apiCall('/admin/locations', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        toast.success('Tạo địa điểm thành công');
      }
      setIsDialogOpen(false);
      resetForm();
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi lưu địa điểm');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>LOCATION</CardTitle>
              <CardDescription>Quản lý địa điểm du lịch ({locations.length} records)</CardDescription>
            </div>
            <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Thêm Location
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tên địa điểm</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Tỉnh/TP</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location) => (
                  <TableRow key={location.locId}>
                    <TableCell className="font-mono text-xs">{location.locId}</TableCell>
                    <TableCell className="font-medium">{location.locName}</TableCell>
                    <TableCell>
                      <Badge>{location.locType}</Badge>
                    </TableCell>
                    <TableCell>{location.province}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{location.avgRating?.toFixed(1) || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={location.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {location.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(location)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(location)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingLocation ? 'Sửa Location' : 'Thêm Location mới'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Tên địa điểm *</Label>
              <Input
                value={formData.locName}
                onChange={(e) => setFormData({ ...formData, locName: e.target.value })}
                placeholder="VD: Vinpearl Resort Phú Quốc"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Loại địa điểm *</Label>
                <Select value={formData.locType} onValueChange={(val) => setFormData({ ...formData, locType: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">Hotel (Khách sạn)</SelectItem>
                    <SelectItem value="restaurant">Restaurant (Nhà hàng)</SelectItem>
                    <SelectItem value="entertainment">Entertainment (Vui chơi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Mức giá</Label>
                <Select value={formData.priceLev} onValueChange={(val) => setFormData({ ...formData, priceLev: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn mức giá" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bình dân">Bình dân</SelectItem>
                    <SelectItem value="Trung bình">Trung bình</SelectItem>
                    <SelectItem value="Cao cấp">Cao cấp</SelectItem>
                    <SelectItem value="Xa xỉ">Xa xỉ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Tỉnh/Thành phố *</Label>
                <Input
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  placeholder="VD: Khánh Hòa"
                />
              </div>
              <div>
                <Label>Quận/Huyện *</Label>
                <Input
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="VD: Nha Trang"
                />
              </div>
              <div>
                <Label>Phường/Xã</Label>
                <Input
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Địa chỉ (Đường) *</Label>
              <Input
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder="VD: 123 Trần Phú"
              />
            </div>

            <div>
              <Label>Chủ sở hữu *</Label>
              <Select value={formData.ownerID} onValueChange={(val) => setFormData({ ...formData, ownerID: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn Business Owner" />
                </SelectTrigger>
                <SelectContent>
                  {businessOwners.map((owner) => (
                    <SelectItem key={owner.userId} value={owner.userId}>
                      {owner.fullName} ({owner.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Mô tả</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả về địa điểm..."
                rows={3}
              />
            </div>

            <div>
              <Label>Tags (Preferences) - Chọn nhiều</Label>
              <div className="grid grid-cols-3 gap-2 mt-2 max-h-40 overflow-y-auto border rounded p-2">
                {preferences.map((pref) => (
                  <label key={pref.prefId} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.tags.includes(pref.prefName)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, tags: [...formData.tags, pref.prefName] });
                        } else {
                          setFormData({ ...formData, tags: formData.tags.filter(t => t !== pref.prefName) });
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{pref.prefName}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              {editingLocation ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa địa điểm "{deleteDialog.location?.locName}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ============================================================================
// PREFERENCE MANAGEMENT - Full CRUD
// ============================================================================
function PreferenceManagement({ preferences, onRefresh }: { preferences: any[]; onRefresh: () => void }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPref, setEditingPref] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; pref: any }>({ open: false, pref: null });
  const [formData, setFormData] = useState({
    prefName: '',
    category: '',
    prefDescription: '',
  });

  const resetForm = () => {
    setFormData({
      prefName: '',
      category: '',
      prefDescription: '',
    });
    setEditingPref(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (pref: any) => {
    setEditingPref(pref);
    setFormData({
      prefName: pref.prefName || '',
      category: pref.category || '',
      prefDescription: pref.prefDescription || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (pref: any) => {
    setDeleteDialog({ open: true, pref });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.pref) return;
    
    try {
      await apiCall(`/admin/preferences/${deleteDialog.pref.prefId}`, {
        method: 'DELETE',
      });
      toast.success('Xóa preference thành công');
      setDeleteDialog({ open: false, pref: null });
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi xóa preference');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingPref) {
        await apiCall(`/admin/preferences/${editingPref.prefId}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
        toast.success('Cập nhật preference thành công');
      } else {
        await apiCall('/admin/preferences', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        toast.success('Tạo preference thành công');
      }
      setIsDialogOpen(false);
      resetForm();
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi lưu preference');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>PREFERENCE (Tags)</CardTitle>
              <CardDescription>Quản lý tags/sở thích ({preferences.length} records)</CardDescription>
            </div>
            <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Thêm Preference
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tên Tag</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preferences.map((pref) => (
                  <TableRow key={pref.prefId}>
                    <TableCell className="font-mono text-xs">{pref.prefId}</TableCell>
                    <TableCell>
                      <Badge>{pref.prefName}</Badge>
                    </TableCell>
                    <TableCell>{pref.category}</TableCell>
                    <TableCell className="max-w-md truncate">{pref.prefDescription}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(pref)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(pref)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPref ? 'Sửa Preference' : 'Thêm Preference mới'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Tên Tag *</Label>
              <Input
                value={formData.prefName}
                onChange={(e) => setFormData({ ...formData, prefName: e.target.value })}
                placeholder="VD: Beach, Luxury, Adventure..."
              />
            </div>

            <div>
              <Label>Category</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="VD: Location Type, Activity, Mood..."
              />
            </div>

            <div>
              <Label>Mô tả</Label>
              <Textarea
                value={formData.prefDescription}
                onChange={(e) => setFormData({ ...formData, prefDescription: e.target.value })}
                placeholder="Mô tả về tag này..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              {editingPref ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tag "{deleteDialog.pref?.prefName}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ============================================================================
// STUB COMPONENTS (Simplified for now - can be expanded)
// ============================================================================
function ProductManagement({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PRODUCT Management</CardTitle>
        <CardDescription>Quản lý sản phẩm (Room Types, Table Types, Ticket Types)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">Product CRUD interface</p>
          <p className="text-sm text-muted-foreground/70">
            Includes: PRODUCT, ROOMTYPE, TABLE_TYPE, TICKET_TYPE tables
          </p>
          <Button onClick={onRefresh} variant="outline" className="mt-4">
            Refresh Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function VoucherManagement({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>VOUCHER Management</CardTitle>
        <CardDescription>Quản lý voucher giảm giá</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">Voucher CRUD interface</p>
          <p className="text-sm text-muted-foreground/70">
            Includes: voucherID, discountPercentage, slots, expDate...
          </p>
          <Button onClick={onRefresh} variant="outline" className="mt-4">
            Refresh Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function UtilityManagement({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>UTILITY Management</CardTitle>
        <CardDescription>Quản lý tiện ích (WiFi, Pool, Parking...)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Settings className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">Utility CRUD interface</p>
          <p className="text-sm text-muted-foreground/70">
            Includes: UTILITY, LOC_HAS_UTILITY, UTILITY_HAS_IMAGE tables
          </p>
          <Button onClick={onRefresh} variant="outline" className="mt-4">
            Refresh Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ImageManagement({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>IMAGE Management</CardTitle>
        <CardDescription>Quản lý hình ảnh</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">Image CRUD interface</p>
          <p className="text-sm text-muted-foreground/70">
            Includes: IMAGE, LOC_HAS_IMAGE, USER_ACCOUNT_HAS_IMAGE, FB_HAS_IMAGE, PRODUCT_HAS_IMAGE
          </p>
          <Button onClick={onRefresh} variant="outline" className="mt-4">
            Refresh Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ReservationManagement({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>RESERVATION Management</CardTitle>
        <CardDescription>Quản lý đặt chỗ</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">Reservation CRUD interface</p>
          <p className="text-sm text-muted-foreground/70">
            Includes: RESERVATION, BOOKING_DETAILS tables
          </p>
          <Button onClick={onRefresh} variant="outline" className="mt-4">
            Refresh Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TransactionManagement({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>TRANSACTION Management</CardTitle>
        <CardDescription>Quản lý giao dịch thanh toán</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">Transaction CRUD interface</p>
          <p className="text-sm text-muted-foreground/70">
            Includes: transactionID, paidAmount, paymentMethod, status...
          </p>
          <Button onClick={onRefresh} variant="outline" className="mt-4">
            Refresh Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewManagement({ reviews, onRefresh }: { reviews: any[]; onRefresh: () => void }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>REVIEW Management (FEEDBACK)</CardTitle>
            <CardDescription>Quản lý đánh giá và phản hồi ({reviews.length} records)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Review ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.reviewId}>
                  <TableCell className="font-mono text-xs">{review.reviewId}</TableCell>
                  <TableCell>{review.userName}</TableCell>
                  <TableCell>{review.locationId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{review.ratingPoint}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md truncate">{review.content}</TableCell>
                  <TableCell>{review.likeCount || 0}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
