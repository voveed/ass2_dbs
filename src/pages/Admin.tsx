import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Plus, Edit, Trash2, Search, ArrowUpDown, Save, X, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Textarea } from '../components/ui/textarea';
import { apiCall } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface AdminProps {
  user: any;
}

export function Admin({ user }: AdminProps) {
  const [, setLocation] = useLocation();
  const [locations, setLocations] = useState<any[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState('locName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [locationToDelete, setLocationToDelete] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    locName: '',
    locType: 'hotel',
    description: '',
    province: '',
    district: '',
    ward: '',
    street: '',
    locNo: '',
    priceLev: 'MODERATE',
    imageUrl: '',
    hotelStarRating: 3,
    standardCheckIn: '14:00',
    standardCheckOut: '12:00',
    cuisineType: '',
    attractionType: '',
    targetAudience: '',
    tags: [] as string[],
  });

  const [formErrors, setFormErrors] = useState<any>({});
  const [availablePreferences, setAvailablePreferences] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setLocation('/auth');
      return;
    }
    if (user.role !== 'business_owner') {
      toast.error('Bạn không có quyền truy cập trang này');
      setLocation('/');
      return;
    }
    loadLocations();
    loadPreferences();
  }, [user]);

  const loadPreferences = async () => {
    try {
      const response = await apiCall('/admin/preferences');
      const prefs = response.preferences.map((p: any) => p.prefName);
      setAvailablePreferences(prefs);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  useEffect(() => {
    filterAndSortLocations();
  }, [locations, searchTerm, filterType, sortField, sortOrder]);

  const loadLocations = async () => {
    setIsLoading(true);
    try {
      const data = await apiCall('/locations');
      setLocations(data.locations || []);
    } catch (error) {
      console.error('Error loading locations:', error);
      toast.error('Không thể tải danh sách địa điểm');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortLocations = () => {
    let result = [...locations];

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(loc =>
        loc.locName.toLowerCase().includes(searchLower) ||
        loc.description?.toLowerCase().includes(searchLower) ||
        loc.province?.toLowerCase().includes(searchLower) ||
        loc.district?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by type
    if (filterType && filterType !== 'all') {
      result = result.filter(loc => loc.locType === filterType);
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredLocations(result);
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const validateForm = () => {
    const errors: any = {};

    if (!formData.locName.trim()) {
      errors.locName = 'Tên địa điểm không được để trống';
    }

    if (!formData.province.trim()) {
      errors.province = 'Tỉnh/Thành phố không được để trống';
    }

    if (!formData.district.trim()) {
      errors.district = 'Quận/Huyện không được để trống';
    }

    if (!formData.description.trim()) {
      errors.description = 'Mô tả không được để trống';
    } else if (formData.description.length < 20) {
      errors.description = 'Mô tả phải có ít nhất 20 ký tự';
    }

    if (formData.locType === 'hotel') {
      if (formData.hotelStarRating < 1 || formData.hotelStarRating > 5) {
        errors.hotelStarRating = 'Xếp hạng sao phải từ 1 đến 5';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenCreateDialog = () => {
    setEditingLocation(null);
    setFormData({
      locName: '',
      locType: 'hotel',
      description: '',
      province: '',
      district: '',
      ward: '',
      street: '',
      locNo: '',
      priceLev: 'MODERATE',
      imageUrl: '',
      hotelStarRating: 3,
      standardCheckIn: '14:00',
      standardCheckOut: '12:00',
      cuisineType: '',
      attractionType: '',
      targetAudience: '',
      tags: [],
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (location: any) => {
    setEditingLocation(location);
    setFormData({
      locName: location.locName || '',
      locType: location.locType || 'hotel',
      description: location.description || '',
      province: location.province || '',
      district: location.district || '',
      ward: location.ward || '',
      street: location.street || '',
      locNo: location.locNo || '',
      priceLev: location.priceLev || 'MODERATE',
      imageUrl: location.imageUrl || '',
      hotelStarRating: location.hotelStarRating || 3,
      standardCheckIn: location.standardCheckIn || '14:00',
      standardCheckOut: location.standardCheckOut || '12:00',
      cuisineType: location.cuisineType || '',
      attractionType: location.attractionType || '',
      targetAudience: location.targetAudience || '',
      tags: location.tags || [],
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const toggleTag = (tag: string) => {
    if (formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
    } else {
      if (formData.tags.length >= 10) {
        toast.error('Bạn chỉ có thể chọn tối đa 10 tags');
        return;
      }
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin nhập vào');
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      
      if (editingLocation) {
        // Update location
        await apiCall(`/locations/${editingLocation.locId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        });
        toast.success('Cập nhật địa điểm thành công!');
      } else {
        // Create new location
        await apiCall('/locations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        });
        toast.success('Thêm địa điểm mới thành công!');
      }

      setIsDialogOpen(false);
      loadLocations();
    } catch (error: any) {
      console.error('Error saving location:', error);
      toast.error(error.message || 'Không thể lưu địa điểm');
    }
  };

  const handleDelete = async () => {
    if (!locationToDelete) return;

    try {
      const accessToken = localStorage.getItem('accessToken');
      await apiCall(`/locations/${locationToDelete.locId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      toast.success('Xóa địa điểm thành công!');
      setIsDeleteDialogOpen(false);
      setLocationToDelete(null);
      loadLocations();
    } catch (error: any) {
      console.error('Error deleting location:', error);
      toast.error(error.message || 'Không thể xóa địa điểm');
    }
  };

  const getLocationTypeLabel = (type: string) => {
    switch (type) {
      case 'hotel': return 'Khách sạn';
      case 'restaurant': return 'Nhà hàng';
      case 'entertainment': return 'Vui chơi';
      default: return type;
    }
  };

  const getPriceLevelLabel = (level: string) => {
    switch (level) {
      case 'LUXURY': return 'Cao cấp';
      case 'MODERATE': return 'Trung bình';
      case 'AFFORDABLE': return 'Bình dân';
      default: return level;
    }
  };

  if (!user || user.role !== 'business_owner') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-4 text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Về trang chủ
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-gradient neon-text">Quản lý địa điểm</h1>
              <p className="text-muted-foreground">
                Thêm, sửa, xóa và quản lý các địa điểm của bạn
              </p>
            </div>
            <Button
              onClick={handleOpenCreateDialog}
              className="glow-cyan hover:glow-cyan-strong"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm địa điểm mới
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 border-glow">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Tìm kiếm</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Tìm theo tên, mô tả, địa chỉ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 neon-border"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="filter-type">Lọc theo loại</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger id="filter-type" className="neon-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="hotel">Khách sạn</SelectItem>
                    <SelectItem value="restaurant">Nhà hàng</SelectItem>
                    <SelectItem value="entertainment">Vui chơi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <div className="text-sm text-muted-foreground">
                  Hiển thị <span className="text-primary neon-text">{filteredLocations.length}</span> / {locations.length} địa điểm
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-glow">
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4 glow-cyan"></div>
                <p className="text-muted-foreground">Đang tải...</p>
              </div>
            ) : filteredLocations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm || filterType !== 'all' 
                  ? 'Không tìm thấy địa điểm nào phù hợp'
                  : 'Chưa có địa điểm nào. Hãy thêm địa điểm mới!'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead 
                        className="cursor-pointer hover:text-primary transition-colors"
                        onClick={() => toggleSort('locName')}
                      >
                        <div className="flex items-center gap-2">
                          Tên địa điểm
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-primary transition-colors"
                        onClick={() => toggleSort('locType')}
                      >
                        <div className="flex items-center gap-2">
                          Loại hình
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-primary transition-colors"
                        onClick={() => toggleSort('province')}
                      >
                        <div className="flex items-center gap-2">
                          Địa chỉ
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-primary transition-colors"
                        onClick={() => toggleSort('priceLev')}
                      >
                        <div className="flex items-center gap-2">
                          Mức giá
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-primary transition-colors"
                        onClick={() => toggleSort('avgRating')}
                      >
                        <div className="flex items-center gap-2">
                          Đánh giá
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLocations.map((location) => (
                      <TableRow 
                        key={location.locId}
                        className="border-border/30 hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-medium">{location.locName}</TableCell>
                        <TableCell>
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            {getLocationTypeLabel(location.locType)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {location.district}, {location.province}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-accent/30">
                            {getPriceLevelLabel(location.priceLev)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {location.avgRating ? (
                            <span className="text-primary">{location.avgRating.toFixed(1)} ⭐</span>
                          ) : (
                            <span className="text-muted-foreground">Chưa có</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenEditDialog(location)}
                              className="border-primary/30 hover:border-primary hover:bg-primary/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setLocationToDelete(location);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="hover:glow-cyan-strong"
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

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-glow">
            <DialogHeader>
              <DialogTitle className="text-gradient neon-text">
                {editingLocation ? 'Chỉnh sửa địa điểm' : 'Thêm địa điểm mới'}
              </DialogTitle>
              <DialogDescription>
                {editingLocation 
                  ? 'Cập nhật thông tin địa điểm của bạn'
                  : 'Điền đầy đủ thông tin để thêm địa điểm mới'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Basic Info */}
              <div className="space-y-2">
                <Label htmlFor="locName">
                  Tên địa điểm <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="locName"
                  value={formData.locName}
                  onChange={(e) => setFormData({ ...formData, locName: e.target.value })}
                  placeholder="VD: Khách sạn Silk Path"
                  className={formErrors.locName ? 'border-destructive' : 'neon-border'}
                />
                {formErrors.locName && (
                  <p className="text-sm text-destructive">{formErrors.locName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="locType">
                    Loại hình <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.locType} onValueChange={(val) => setFormData({ ...formData, locType: val })}>
                    <SelectTrigger id="locType" className="neon-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Khách sạn</SelectItem>
                      <SelectItem value="restaurant">Nhà hàng</SelectItem>
                      <SelectItem value="entertainment">Vui chơi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priceLev">
                    Mức giá <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.priceLev} onValueChange={(val) => setFormData({ ...formData, priceLev: val })}>
                    <SelectTrigger id="priceLev" className="neon-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AFFORDABLE">Bình dân</SelectItem>
                      <SelectItem value="MODERATE">Trung bình</SelectItem>
                      <SelectItem value="LUXURY">Cao cấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Mô tả <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chi tiết về địa điểm..."
                  rows={4}
                  className={formErrors.description ? 'border-destructive' : 'neon-border'}
                />
                {formErrors.description && (
                  <p className="text-sm text-destructive">{formErrors.description}</p>
                )}
              </div>

              {/* Address */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="province">
                    Tỉnh/Thành phố <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="province"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    placeholder="VD: Hà Nội"
                    className={formErrors.province ? 'border-destructive' : 'neon-border'}
                  />
                  {formErrors.province && (
                    <p className="text-sm text-destructive">{formErrors.province}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">
                    Quận/Huyện <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="VD: Hoàn Kiếm"
                    className={formErrors.district ? 'border-destructive' : 'neon-border'}
                  />
                  {formErrors.district && (
                    <p className="text-sm text-destructive">{formErrors.district}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ward">Phường/Xã</Label>
                  <Input
                    id="ward"
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    placeholder="VD: Hàng Bạc"
                    className="neon-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Đường</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="VD: Lý Thái Tổ"
                    className="neon-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="locNo">Số nhà</Label>
                  <Input
                    id="locNo"
                    value={formData.locNo}
                    onChange={(e) => setFormData({ ...formData, locNo: e.target.value })}
                    placeholder="VD: 15"
                    className="neon-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL hình ảnh</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="neon-border"
                />
                <p className="text-xs text-muted-foreground">
                  Nhập URL hình ảnh từ internet hoặc để trống để sử dụng ảnh mặc định
                </p>
              </div>

              {/* Type-specific fields */}
              {formData.locType === 'hotel' && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hotelStarRating">Xếp hạng sao</Label>
                    <Input
                      id="hotelStarRating"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.hotelStarRating}
                      onChange={(e) => setFormData({ ...formData, hotelStarRating: parseInt(e.target.value) || 3 })}
                      className={formErrors.hotelStarRating ? 'border-destructive' : 'neon-border'}
                    />
                    {formErrors.hotelStarRating && (
                      <p className="text-sm text-destructive">{formErrors.hotelStarRating}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="standardCheckIn">Check-in</Label>
                    <Input
                      id="standardCheckIn"
                      type="time"
                      value={formData.standardCheckIn}
                      onChange={(e) => setFormData({ ...formData, standardCheckIn: e.target.value })}
                      className="neon-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="standardCheckOut">Check-out</Label>
                    <Input
                      id="standardCheckOut"
                      type="time"
                      value={formData.standardCheckOut}
                      onChange={(e) => setFormData({ ...formData, standardCheckOut: e.target.value })}
                      className="neon-border"
                    />
                  </div>
                </div>
              )}

              {formData.locType === 'restaurant' && (
                <div className="space-y-2">
                  <Label htmlFor="cuisineType">Loại ẩm thực</Label>
                  <Input
                    id="cuisineType"
                    value={formData.cuisineType}
                    onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
                    placeholder="VD: Việt Nam, Âu, Á"
                    className="neon-border"
                  />
                </div>
              )}

              {formData.locType === 'entertainment' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="attractionType">Loại hình</Label>
                    <Input
                      id="attractionType"
                      value={formData.attractionType}
                      onChange={(e) => setFormData({ ...formData, attractionType: e.target.value })}
                      placeholder="VD: Tự nhiên, Văn hóa"
                      className="neon-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Đối tượng</Label>
                    <Input
                      id="targetAudience"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                      placeholder="VD: Gia đình, Cặp đôi"
                      className="neon-border"
                    />
                  </div>
                </div>
              )}

              {/* Tags/Preferences Selection */}
              <div className="space-y-2">
                <Label>
                  Tags/Preferences <span className="text-destructive">*</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Chọn các tags mô tả địa điểm (tối đa 10 tags)
                </p>
                <div className="flex flex-wrap gap-2 p-3 bg-muted/20 rounded-lg border border-border/50 max-h-48 overflow-y-auto">
                  {availablePreferences.map((tag) => (
                    <Badge
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`cursor-pointer transition-all ${
                        formData.tags.includes(tag)
                          ? 'bg-[#00E5FF] text-black hover:bg-[#00FFC6] border-[#00E5FF]'
                          : 'bg-[#0A0A0B] text-white/70 hover:bg-[#00E5FF]/20 border-[#00E5FF]/30'
                      } border`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Đã chọn: {formData.tags.length}/10
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-muted"
              >
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                className="glow-cyan hover:glow-cyan-strong"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingLocation ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="border-destructive/50">
            <DialogHeader>
              <DialogTitle className="text-destructive">Xác nhận xóa</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa địa điểm <strong>{locationToDelete?.locName}</strong>?
                Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setLocationToDelete(null);
                }}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="glow-cyan-strong"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
