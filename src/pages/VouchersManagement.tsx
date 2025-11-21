import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Ticket, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { apiCall } from '../utils/api';

export function VouchersManagement() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<any>(null);
  const [formData, setFormData] = useState({
    voucherCode: '',
    discountPercentage: 10,
    maxDiscount: 100000,
    minOrderAmount: 0,
    slots: 100,
    expDate: '',
    description: '',
  });

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      const data = await apiCall('/vouchers');
      setVouchers(data.vouchers || []);
    } catch (error) {
      console.error('Error loading vouchers:', error);
      toast.error('Lỗi khi tải voucher');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingVoucher) {
        await apiCall(`/vouchers/${editingVoucher.voucherID}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
        toast.success('Cập nhật voucher thành công!');
      } else {
        await apiCall('/vouchers', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        toast.success('Tạo voucher thành công!');
      }
      
      setIsDialogOpen(false);
      resetForm();
      loadVouchers();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (voucher: any) => {
    setEditingVoucher(voucher);
    setFormData({
      voucherCode: voucher.voucherCode,
      discountPercentage: voucher.discountPercentage,
      maxDiscount: voucher.maxDiscount,
      minOrderAmount: voucher.minOrderAmount || 0,
      slots: voucher.slots,
      expDate: voucher.expDate?.split('T')[0] || '',
      description: voucher.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (voucherId: string) => {
    if (!confirm('Bạn có chắc muốn xóa voucher này?')) return;
    
    try {
      await apiCall(`/vouchers/${voucherId}`, {
        method: 'DELETE',
      });
      toast.success('Xóa voucher thành công!');
      loadVouchers();
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa voucher');
    }
  };

  const resetForm = () => {
    setEditingVoucher(null);
    setFormData({
      voucherCode: '',
      discountPercentage: 10,
      maxDiscount: 100000,
      minOrderAmount: 0,
      slots: 100,
      expDate: '',
      description: '',
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getStatusBadge = (voucher: any) => {
    const now = new Date();
    const expDate = new Date(voucher.expDate);
    
    if (expDate < now) {
      return <Badge variant="destructive">Hết hạn</Badge>;
    }
    if (voucher.usedSlots >= voucher.slots) {
      return <Badge variant="destructive">Hết slot</Badge>;
    }
    return <Badge className="bg-green-500/20 text-green-500">Hoạt động</Badge>;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 text-gradient flex items-center gap-3">
            <Ticket className="h-8 w-8" />
            Quản lý Voucher
          </h1>
          <p className="text-muted-foreground">
            Use Case 80-83: Tạo, đọc, cập nhật và xóa voucher khuyến mãi
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Danh sách Voucher</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleDialogClose()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo Voucher
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingVoucher ? 'Sửa Voucher' : 'Tạo Voucher mới'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Mã Voucher</Label>
                      <Input
                        value={formData.voucherCode}
                        onChange={(e) =>
                          setFormData({ ...formData, voucherCode: e.target.value.toUpperCase() })
                        }
                        placeholder="SUMMER2024"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Giảm giá (%)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={formData.discountPercentage}
                          onChange={(e) =>
                            setFormData({ ...formData, discountPercentage: Number(e.target.value) })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Giảm tối đa (₫)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.maxDiscount}
                          onChange={(e) =>
                            setFormData({ ...formData, maxDiscount: Number(e.target.value) })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Đơn tối thiểu (₫)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.minOrderAmount}
                          onChange={(e) =>
                            setFormData({ ...formData, minOrderAmount: Number(e.target.value) })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Số lượng</Label>
                        <Input
                          type="number"
                          min="1"
                          value={formData.slots}
                          onChange={(e) =>
                            setFormData({ ...formData, slots: Number(e.target.value) })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Ngày hết hạn</Label>
                      <Input
                        type="date"
                        value={formData.expDate}
                        onChange={(e) =>
                          setFormData({ ...formData, expDate: e.target.value })
                        }
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Mô tả</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        placeholder="Mô tả về voucher..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        {editingVoucher ? 'Cập nhật' : 'Tạo mới'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleDialogClose}
                      >
                        Hủy
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Đang tải...</div>
            ) : vouchers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có voucher nào. Hãy tạo mới!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã Voucher</TableHead>
                    <TableHead>Giảm giá</TableHead>
                    <TableHead>Giới hạn</TableHead>
                    <TableHead>Đã dùng/Tổng</TableHead>
                    <TableHead>Hết hạn</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vouchers.map((voucher) => (
                    <TableRow key={voucher.voucherID}>
                      <TableCell>
                        <Badge className="bg-primary font-mono">
                          {voucher.voucherCode}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-primary">
                            {voucher.discountPercentage}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Tối đa {formatCurrency(voucher.maxDiscount)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {voucher.minOrderAmount > 0 
                          ? `Đơn ≥ ${formatCurrency(voucher.minOrderAmount)}`
                          : 'Không giới hạn'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {voucher.usedSlots || 0}/{voucher.slots}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(voucher.expDate).toLocaleDateString('vi-VN')}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(voucher)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(voucher)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(voucher.voucherID)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="mb-2 flex items-center gap-2">
              <Ticket className="h-5 w-5 text-primary" />
              Use Cases được hỗ trợ
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-500">✓ UC80</Badge>
                <span>Tạo Voucher - INSERT vào VOUCHER</span>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-500">✓ UC81</Badge>
                <span>Đọc Voucher - SELECT toàn bộ VOUCHER</span>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-500">✓ UC82</Badge>
                <span>Cập nhật Voucher - UPDATE VOUCHER</span>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-500">✓ UC83</Badge>
                <span>Xóa Voucher - DELETE VOUCHER</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
