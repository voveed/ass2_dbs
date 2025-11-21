import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
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

export function PreferencesManagement() {
  const [preferences, setPreferences] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPref, setEditingPref] = useState<any>(null);
  const [formData, setFormData] = useState({
    prefName: '',
    description: '',
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const data = await apiCall('/preferences');
      setPreferences(data.preferences || []);
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast.error('Lỗi khi tải sở thích');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPref) {
        // Update
        await apiCall(`/preferences/${editingPref.prefId}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
        toast.success('Cập nhật sở thích thành công!');
      } else {
        // Create
        await apiCall('/preferences', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        toast.success('Tạo sở thích thành công!');
      }
      
      setIsDialogOpen(false);
      setFormData({ prefName: '', description: '' });
      setEditingPref(null);
      loadPreferences();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (pref: any) => {
    setEditingPref(pref);
    setFormData({
      prefName: pref.prefName,
      description: pref.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (prefId: string) => {
    if (!confirm('Bạn có chắc muốn xóa sở thích này?')) return;
    
    try {
      await apiCall(`/preferences/${prefId}`, {
        method: 'DELETE',
      });
      toast.success('Xóa sở thích thành công!');
      loadPreferences();
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa sở thích');
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingPref(null);
    setFormData({ prefName: '', description: '' });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 text-gradient flex items-center gap-3">
            <Tag className="h-8 w-8" />
            Quản lý Sở thích (Preferences)
          </h1>
          <p className="text-muted-foreground">
            Use Case 72-75: Tạo, đọc, cập nhật và xóa các thẻ sở thích
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Danh sách Sở thích</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleDialogClose()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm Sở thích
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingPref ? 'Sửa Sở thích' : 'Tạo Sở thích mới'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tên Sở thích</Label>
                      <Input
                        value={formData.prefName}
                        onChange={(e) =>
                          setFormData({ ...formData, prefName: e.target.value })
                        }
                        placeholder="Ví dụ: Biển, Núi, Ẩm thực..."
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
                        {editingPref ? 'Cập nhật' : 'Tạo mới'}
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
            ) : preferences.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có sở thích nào. Hãy tạo mới!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tên Sở thích</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Số lượng sử dụng</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preferences.map((pref) => (
                    <TableRow key={pref.prefId}>
                      <TableCell>
                        <Badge variant="outline">{pref.prefId}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-primary/20 text-primary">
                          {pref.prefName}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {pref.description || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{pref.usageCount || 0}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(pref)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(pref.prefId)}
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
              <Tag className="h-5 w-5 text-primary" />
              Use Cases được hỗ trợ
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-500">✓ UC72</Badge>
                <span>Tạo Thẻ (Preference) - INSERT vào PREFERENCE</span>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-500">✓ UC73</Badge>
                <span>Đọc Thẻ - SELECT toàn bộ PREFERENCE</span>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-500">✓ UC74</Badge>
                <span>Sửa Thẻ - UPDATE PREFERENCE</span>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-500">✓ UC75</Badge>
                <span>Xóa Thẻ - DELETE PREFERENCE</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
