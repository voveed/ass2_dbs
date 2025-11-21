import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Ban, CheckCircle, Users, MapPin, Trash2, Database, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { getAllUsers, deactivateAccount, reactivateAccount, deactivateLocation, reactivateLocation, apiCall } from '../utils/api';
import { toast } from 'sonner';

interface AdminPanelProps {
  user: any;
}

export function AdminPanel({ user }: AdminPanelProps) {
  const [, setLocation] = useLocation();
  const [users, setUsers] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: 'deactivate-user' | 'reactivate-user' | 'deactivate-location' | 'reactivate-location' | null;
    target: any;
  }>({ open: false, type: null, target: null });

  useEffect(() => {
    if (!user) {
      setLocation('/auth');
      return;
    }
    if (user.role !== 'admin') {
      toast.error('Chỉ quản trị viên mới có quyền truy cập');
      setLocation('/');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersData, locationsData] = await Promise.all([
        getAllUsers(),
        apiCall('/locations'),
      ]);
      setUsers(usersData.users || []);
      setLocations(locationsData.locations || []);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error(error.message || 'Không thể tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserAction = (action: 'deactivate' | 'reactivate', targetUser: any) => {
    setActionDialog({
      open: true,
      type: action === 'deactivate' ? 'deactivate-user' : 'reactivate-user',
      target: targetUser,
    });
  };

  const handleLocationAction = (action: 'deactivate' | 'reactivate', targetLocation: any) => {
    setActionDialog({
      open: true,
      type: action === 'deactivate' ? 'deactivate-location' : 'reactivate-location',
      target: targetLocation,
    });
  };
  
  // Hàm duyệt Owner mới thêm
  const handleVerifyOwner = async (ownerId: string | number) => {
    try {
      await apiCall(`/admin/verify-owner/${ownerId}`, { method: 'PUT' });
      toast.success('Đã duyệt tài khoản doanh nghiệp thành công!');
      loadData(); // Tải lại dữ liệu để cập nhật trạng thái
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi duyệt tài khoản');
    }
  };

  const executeAction = async () => {
    if (!actionDialog.type || !actionDialog.target) return;

    try {
      switch (actionDialog.type) {
        case 'deactivate-user':
          await deactivateAccount(actionDialog.target.userId);
          toast.success('Đã vô hiệu hóa tài khoản');
          break;
        case 'reactivate-user':
          await reactivateAccount(actionDialog.target.userId);
          toast.success('Đã kích hoạt lại tài khoản');
          break;
        case 'deactivate-location':
          await deactivateLocation(actionDialog.target.locId);
          toast.success('Đã vô hiệu hóa địa điểm');
          break;
        case 'reactivate-location':
          await reactivateLocation(actionDialog.target.locId);
          toast.success('Đã kích hoạt lại địa điểm');
          break;
      }
      await loadData();
      setActionDialog({ open: false, type: null, target: null });
    } catch (error: any) {
      console.error('Error executing action:', error);
      toast.error(error.message || 'Thao tác thất bại');
    }
  };

  const getActionDialogContent = () => {
    if (!actionDialog.type || !actionDialog.target) return { title: '', description: '' };

    const actions = {
      'deactivate-user': {
        title: 'Vô hiệu hóa tài khoản',
        description: `Bạn có chắc chắn muốn vô hiệu hóa tài khoản "${actionDialog.target.fullName}"? Người dùng sẽ không thể đăng nhập.`,
      },
      'reactivate-user': {
        title: 'Kích hoạt lại tài khoản',
        description: `Bạn có chắc chắn muốn kích hoạt lại tài khoản "${actionDialog.target.fullName}"?`,
      },
      'deactivate-location': {
        title: 'Vô hiệu hóa địa điểm',
        description: `Bạn có chắc chắn muốn vô hiệu hóa địa điểm "${actionDialog.target.locName}"? Địa điểm sẽ không hiển thị cho người dùng.`,
      },
      'reactivate-location': {
        title: 'Kích hoạt lại địa điểm',
        description: `Bạn có chắc chắn muốn kích hoạt lại địa điểm "${actionDialog.target.locName}"?`,
      },
    };

    return actions[actionDialog.type];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-[#00E5FF]">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      {/* Header */}
      <div className="border-b border-[#00E5FF]/20 bg-[#1A1B1E]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="text-[#00E5FF] hover:text-[#00FFC6] hover:bg-[#00E5FF]/10"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Trang chủ
            </Button>
            <h1 className="text-[#00E5FF] neon-text">Quản Trị Hệ Thống</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#1A1B1E] border-[#00E5FF]/30">
            <CardHeader>
              <CardTitle className="text-[#00E5FF] flex items-center gap-2">
                <Users className="w-5 h-5" />
                Tổng Người Dùng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white">
                {users.length} người dùng
              </div>
              <div className="text-white/60 mt-1">
                {users.filter(u => u.status === 'ACTIVE').length} hoạt động
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1B1E] border-[#00E5FF]/30">
            <CardHeader>
              <CardTitle className="text-[#00E5FF] flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Tổng Địa Điểm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white">
                {locations.length} địa điểm
              </div>
              <div className="text-white/60 mt-1">
                {locations.filter(l => l.status === 'ACTIVE').length} hoạt động
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1B1E] border-[#00E5FF]/30">
            <CardHeader>
              <CardTitle className="text-[#00E5FF]">Quản Lý Nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={() => setLocation('/data-management')}
                className="w-full bg-[#00E5FF] text-black hover:bg-[#00FFC6]"
              >
                <Database className="w-4 h-4 mr-2" />
                Quản Lý Dữ Liệu (32 bảng)
              </Button>
              <Button
                onClick={() => setLocation('/admin')}
                className="w-full bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20"
              >
                Quản lý địa điểm
              </Button>
              <Button
                onClick={() => setLocation('/reviews')}
                className="w-full bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20"
              >
                Quản lý đánh giá
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-[#1A1B1E] border border-[#00E5FF]/30">
            <TabsTrigger value="users" className="data-[state=active]:bg-[#00E5FF] data-[state=active]:text-black">
              Quản Lý Người Dùng
            </TabsTrigger>
            <TabsTrigger value="locations" className="data-[state=active]:bg-[#00E5FF] data-[state=active]:text-black">
              Quản Lý Địa Điểm
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-[#1A1B1E] border-[#00E5FF]/30">
              <CardHeader>
                <CardTitle className="text-[#00E5FF]">Danh Sách Người Dùng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#00E5FF]/20 hover:bg-[#00E5FF]/5">
                        <TableHead className="text-[#00E5FF]">Người dùng</TableHead>
                        <TableHead className="text-[#00E5FF]">Email</TableHead>
                        <TableHead className="text-[#00E5FF]">Vai trò</TableHead>
                        <TableHead className="text-[#00E5FF]">Trạng thái</TableHead>
                        <TableHead className="text-[#00E5FF]">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.userId} className="border-[#00E5FF]/10 hover:bg-[#00E5FF]/5">
                          <TableCell className="text-white">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10 border border-[#00E5FF]/30">
                                <AvatarImage src={u.avatar} />
                                <AvatarFallback className="bg-[#00E5FF]/20 text-[#00E5FF]">
                                  {u.fullName?.charAt(0) || '?'}
                                </AvatarFallback>
                              </Avatar>
                              <span>{u.fullName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-white/80">{u.email}</TableCell>
                          <TableCell>
                            <Badge className={`${
                              u.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/50' :
                              u.role === 'business_owner' ? 'bg-blue-500/20 text-blue-300 border-blue-500/50' :
                              'bg-green-500/20 text-green-300 border-green-500/50'
                            } border`}>
                              {u.role === 'admin' ? 'Quản trị viên' :
                               u.role === 'business_owner' ? 'Chủ doanh nghiệp' : 'Du khách'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {u.role === 'business_owner' && u.auStatus === 'PENDING' ? (
                                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50 border">
                                    Chờ duyệt
                                </Badge>
                            ) : (
                                <Badge className={`${
                                  u.status === 'ACTIVE'
                                    ? 'bg-green-500/20 text-green-300 border-green-500/50'
                                    : 'bg-red-500/20 text-red-300 border-red-500/50'
                                } border`}>
                                  {u.status === 'ACTIVE' ? 'Hoạt động' : 'Vô hiệu hóa'}
                                </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                                {/* Nút Duyệt Owner */}
                                {u.role === 'business_owner' && u.auStatus === 'PENDING' && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleVerifyOwner(u.userId)}
                                      className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                                    >
                                      <Check className="w-4 h-4 mr-1" /> Duyệt KD
                                    </Button>
                                )}

                                {u.userId !== user.userId && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleUserAction(
                                        u.status === 'ACTIVE' ? 'deactivate' : 'reactivate',
                                        u
                                      )
                                    }
                                    className={`${
                                      u.status === 'ACTIVE'
                                        ? 'border-red-500/50 text-red-300 hover:bg-red-500/10'
                                        : 'border-green-500/50 text-green-300 hover:bg-green-500/10'
                                    }`}
                                  >
                                    {u.status === 'ACTIVE' ? (
                                      <>
                                        <Ban className="w-4 h-4 mr-1" />
                                        Vô hiệu hóa
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Kích hoạt lại
                                      </>
                                    )}
                                  </Button>
                                )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations">
            <Card className="bg-[#1A1B1E] border-[#00E5FF]/30">
              <CardHeader>
                <CardTitle className="text-[#00E5FF]">Danh Sách Địa Điểm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#00E5FF]/20 hover:bg-[#00E5FF]/5">
                        <TableHead className="text-[#00E5FF]">Tên địa điểm</TableHead>
                        <TableHead className="text-[#00E5FF]">Loại</TableHead>
                        <TableHead className="text-[#00E5FF]">Tỉnh/Thành</TableHead>
                        <TableHead className="text-[#00E5FF]">Đánh giá</TableHead>
                        <TableHead className="text-[#00E5FF]">Trạng thái</TableHead>
                        <TableHead className="text-[#00E5FF]">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {locations.map((loc) => (
                        <TableRow key={loc.locId} className="border-[#00E5FF]/10 hover:bg-[#00E5FF]/5">
                          <TableCell className="text-white">{loc.locName}</TableCell>
                          <TableCell>
                            <Badge className="bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/50 border">
                              {loc.locType === 'hotel' ? 'Khách sạn' :
                               loc.locType === 'restaurant' ? 'Nhà hàng' : 'Giải trí'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white/80">{loc.province}</TableCell>
                          <TableCell className="text-white/80">
                            ⭐ {loc.avgRating?.toFixed(1) || '0.0'} ({loc.reviewCount || 0})
                          </TableCell>
                          <TableCell>
                            <Badge className={`${
                              loc.status === 'ACTIVE'
                                ? 'bg-green-500/20 text-green-300 border-green-500/50'
                                : 'bg-red-500/20 text-red-300 border-red-500/50'
                            } border`}>
                              {loc.status === 'ACTIVE' ? 'Hoạt động' : 'Vô hiệu hóa'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleLocationAction(
                                  loc.status === 'ACTIVE' ? 'deactivate' : 'reactivate',
                                  loc
                                )
                              }
                              className={`${
                                loc.status === 'ACTIVE'
                                  ? 'border-red-500/50 text-red-300 hover:bg-red-500/10'
                                  : 'border-green-500/50 text-green-300 hover:bg-green-500/10'
                              }`}
                            >
                              {loc.status === 'ACTIVE' ? (
                                <>
                                  <Ban className="w-4 h-4 mr-1" />
                                  Vô hiệu hóa
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Kích hoạt lại
                                </>
                              )}
                            </Button>
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

      {/* Action Confirmation Dialog */}
      <AlertDialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ open: false, type: null, target: null })}>
        <AlertDialogContent className="bg-[#1A1B1E] border-[#00E5FF]/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#00E5FF]">
              {getActionDialogContent().title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/80">
              {getActionDialogContent().description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#00E5FF]/30 text-white hover:bg-[#00E5FF]/10">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeAction}
              className="bg-[#00E5FF] text-black hover:bg-[#00FFC6]"
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}