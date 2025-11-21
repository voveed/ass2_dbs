import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Wrench } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
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

export function UtilitiesManagement() {
  const [utilities, setUtilities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUtil, setEditingUtil] = useState<any>(null);
  const [formData, setFormData] = useState({
    utiName: '',
    description: '',
  });

  useEffect(() => {
    loadUtilities();
  }, []);

  const loadUtilities = async () => {
    try {
      const data = await apiCall('/utilities');
      setUtilities(data.utilities || []);
    } catch (error) {
      console.error('Error loading utilities:', error);
      toast.error('Lỗi khi tải tiện ích');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUtil) {
        await apiCall(`/utilities/${editingUtil.utiId}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
        toast.success('Cập nhật tiện ích thành công!');
      } else {
        await apiCall('/utilities', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        toast.success('Tạo tiện ích thành công!');
      }
      
      setIsDialogOpen(false);
      setFormData({ utiName: '', description: '' });
      setEditingUtil(null);
      loadUtilities();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (util: any) => {
    setEditingUtil(util);
    setFormData({
      utiName: util.utiName,
      description: util.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (utiId: string) => {
    if (!confirm('Bạn có chắc muốn xóa tiện ích này?')) return;
    
    try {
      await apiCall(`/utilities/${utiId}`, {
        method: 'DELETE',
      });
      toast.success('Xóa tiện ích thành công!');
      loadUtilities();
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa tiện ích');
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingUtil(null);
    setFormData({ utiName: '', description: '' });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 text-gradient flex items-center gap-3">
            <Wrench className="h-8 w-8" />
            Quản lý Tiện ích (Utilities)
          </h1>
          <p className="text-muted-foreground">
            Use Case 76-79: Tạo, đọc, cập nhật và xóa các tiện ích
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Danh sách Tiện ích</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleDialogClose()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm Tiện ích
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingUtil ? 'Sửa Tiện ích' : 'Tạo Tiện ích mới'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tên Tiện ích</Label>
                      <Input
                        value={formData.utiName}
                        onChange={(e) =>
                          setFormData({ ...formData, utiName: e.target.value })
                        }
                        placeholder="Ví dụ: WiFi, Bãi đỗ xe, Hồ bơi..."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mô tả (không bắt buộc)</Label>
                      <Input
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        placeholder="Mô tả ngắn gọn..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        {editingUtil ? 'Cập nhật' : 'Tạo mới'}
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
            ) : utilities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có tiện ích nào. Hãy tạo mới!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tên Tiện ích</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Số lượng sử dụng</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {utilities.map((util) => (
                    <TableRow key={util.utiId}>
                      <TableCell>
                        <Badge variant="outline">{util.utiId}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-primary/20 text-primary">
                          {util.utiName}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {util.description || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{util.usageCount || 0}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(util)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(util.utiId)}
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
              <Wrench className="h-5 w-5 text-primary" />
              Use Cases được hỗ trợ
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-500">✓ UC76</Badge>
                <span>Tạo Tiện ích (Utility) - INSERT vào UTILITY</span>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-500">✓ UC77</Badge>
                <span>Đọc Tiện ích - SELECT toàn bộ UTILITY</span>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-500">✓ UC78</Badge>
                <span>Sửa Tiện ích - UPDATE UTILITY</span>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-500">✓ UC79</Badge>
                <span>Xóa Tiện ích - DELETE UTILITY</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
