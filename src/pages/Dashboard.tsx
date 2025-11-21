import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { User, MapPin, Calendar, Star, Settings, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { apiCall } from '../utils/api';
import { BusinessOwnerDashboard } from './BusinessOwnerDashboard';
import { Admin } from './Admin';

interface DashboardProps {
  user: any;
}

export function Dashboard({ user }: DashboardProps) {
  const [, setLocationRoute] = useLocation();
  
  // Route to correct dashboard based on user role
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">Vui lòng đăng nhập</p>
          <Button onClick={() => setLocationRoute('/auth')}>Đăng nhập</Button>
        </div>
      </div>
    );
  }
  
  // Admin dashboard
  if (user.role === 'admin') {
    return <Admin user={user} />;
  }
  
  // Business owner dashboard
  if (user.role === 'business_owner') {
    return <BusinessOwnerDashboard user={user} />;
  }
  
  // Tourist dashboard (default)
  return <TouristDashboard user={user} />;
}

function TouristDashboard({ user }: { user: any }) {
  const [, setLocationRoute] = useLocation();
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'tourist') {
      loadReservations();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadReservations = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const data = await apiCall('/reservations', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      setReservations(data.reservations || []);
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      PENDING: { label: 'Chờ xác nhận', variant: 'secondary' },
      CONFIRMED: { label: 'Đã xác nhận', variant: 'default' },
      COMPLETED: { label: 'Hoàn thành', variant: 'default' },
      CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
    };
    
    const config = variants[status] || { label: status, variant: 'secondary' };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => setLocationRoute('/')}
          className="mb-4 text-primary hover:text-primary/80 hover:bg-primary/10 glow-cyan"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Về trang chủ
        </Button>
        <div className="mb-8">
          <h1 className="mb-2 text-gradient neon-text">Tài khoản của tôi</h1>
          <p className="text-muted-foreground">Quản lý thông tin cá nhân và đơn đặt chỗ</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 border-2 border-primary/30">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <h3>{user.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Badge className="mt-2 bg-primary/20 text-primary border-primary/30">
                    {user.role === 'tourist' ? 'Du khách' : 
                     user.role === 'business_owner' ? 'Chủ doanh nghiệp' : 
                     'Quản trị viên'}
                  </Badge>
                </div>

                {user.role === 'tourist' && (
                  <div className="space-y-3 border-t border-border pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Hạng thành viên:</span>
                      <span className="text-primary">{user.rank || 'BRONZE'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tổng chi tiêu:</span>
                      <span>{formatCurrency(user.totalSpent || 0)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="info" className="w-full">
              <TabsList>
                <TabsTrigger value="info">
                  <User className="h-4 w-4 mr-2" />
                  Thông tin
                </TabsTrigger>
                {user.role === 'tourist' && (
                  <TabsTrigger value="reservations">
                    <Calendar className="h-4 w-4 mr-2" />
                    Đơn đặt chỗ
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="info" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    <Button
                      onClick={() => setLocationRoute('/profile')}
                      variant="outline"
                      size="sm"
                      className="border-primary/30 text-primary hover:bg-primary/10 glow-cyan"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Họ và tên</p>
                        <p>{user.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p>{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ngày sinh</p>
                        <p>{user.dob ? formatDate(user.dob) : 'Chưa cập nhật'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Địa chỉ</p>
                        <p>
                          {user.district && user.city
                            ? `${user.district}, ${user.city}`
                            : 'Chưa cập nhật'}
                        </p>
                      </div>
                      {user.role === 'tourist' && (
                        <>
                          <div>
                            <p className="text-sm text-muted-foreground">Quốc tịch</p>
                            <p>{user.nationality || 'Chưa cập nhật'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">CMND/CCCD</p>
                            <p>{user.legalID || 'Chưa cập nhật'}</p>
                          </div>
                        </>
                      )}
                      {user.role === 'business_owner' && (
                        <div>
                          <p className="text-sm text-muted-foreground">Mã số thuế</p>
                          <p>{user.taxCode || 'Chưa cập nhật'}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {user.role === 'tourist' && (
                <TabsContent value="reservations" className="mt-6">
                  <div className="space-y-4">
                    {isLoading ? (
                      <Card>
                        <CardContent className="py-8 text-center">
                          Đang tải...
                        </CardContent>
                      </Card>
                    ) : reservations.length === 0 ? (
                      <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                          Bạn chưa có đơn đặt chỗ nào
                        </CardContent>
                      </Card>
                    ) : (
                      reservations.map((reservation) => (
                        <Card key={reservation.reservationId}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Mã đơn: {reservation.reservationId}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Ngày đặt: {formatDate(reservation.createdAt)}
                                </p>
                              </div>
                              {getStatusBadge(reservation.status)}
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {formatDate(reservation.checkInDate)} -{' '}
                                  {formatDate(reservation.checkOutDate)}
                                </span>
                              </div>
                            </div>

                            <div className="border-t pt-4">
                              <div className="space-y-2 mb-3">
                                {reservation.items.map((item: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex justify-between text-sm"
                                  >
                                    <span>
                                      {item.productName} x {item.quantity}
                                    </span>
                                    <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-between pt-2 border-t">
                                <span>Tổng cộng:</span>
                                <span>{formatCurrency(reservation.finalAmount)}</span>
                              </div>
                            </div>

                            {reservation.note && (
                              <div className="mt-4 text-sm">
                                <span className="text-muted-foreground">Ghi chú: </span>
                                <span>{reservation.note}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
