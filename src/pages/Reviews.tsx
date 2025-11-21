import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Star, Search, ArrowUpDown, Trash2, Edit, ArrowLeft, Eye } from 'lucide-react';
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

interface ReviewsProps {
  user: any;
}

export function Reviews({ user }: ReviewsProps) {
  const [, setLocation] = useLocation();
  const [reviews, setReviews] = useState<any[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  
  // Edit form state
  const [editFormData, setEditFormData] = useState({
    ratingPoint: 5,
    content: '',
  });

  useEffect(() => {
    if (!user) {
      setLocation('/auth');
      return;
    }
    loadReviews();
  }, [user]);

  useEffect(() => {
    filterAndSortReviews();
  }, [reviews, searchTerm, sortField, sortOrder]);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const data = await apiCall('/reviews', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Không thể tải danh sách đánh giá');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortReviews = () => {
    let result = [...reviews];

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(review =>
        review.content?.toLowerCase().includes(searchLower) ||
        review.userName?.toLowerCase().includes(searchLower) ||
        review.reviewId?.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredReviews(result);
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleOpenEditDialog = (review: any) => {
    setSelectedReview(review);
    setEditFormData({
      ratingPoint: review.ratingPoint,
      content: review.content || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateReview = async () => {
    if (!selectedReview) return;

    if (editFormData.ratingPoint < 1 || editFormData.ratingPoint > 5) {
      toast.error('Điểm đánh giá phải từ 1 đến 5');
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      await apiCall(`/reviews/${selectedReview.reviewId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(editFormData),
      });
      
      toast.success('Cập nhật đánh giá thành công!');
      setIsEditDialogOpen(false);
      setSelectedReview(null);
      loadReviews();
    } catch (error: any) {
      console.error('Error updating review:', error);
      toast.error(error.message || 'Không thể cập nhật đánh giá');
    }
  };

  const handleDeleteReview = async () => {
    if (!selectedReview) return;

    try {
      const accessToken = localStorage.getItem('accessToken');
      await apiCall(`/reviews/${selectedReview.reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      toast.success('Xóa đánh giá thành công!');
      setIsDeleteDialogOpen(false);
      setSelectedReview(null);
      loadReviews();
    } catch (error: any) {
      console.error('Error deleting review:', error);
      toast.error(error.message || 'Không thể xóa đánh giá');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  if (!user) {
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
            className="mb-4 text-primary hover:text-primary/80 hover:bg-primary/10 glow-cyan"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Về trang chủ
          </Button>
          <div>
            <h1 className="mb-2 text-gradient neon-text">Quản lý đánh giá</h1>
            <p className="text-muted-foreground">
              Xem và quản lý các đánh giá từ người dùng
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 border-glow">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4 items-end">
              <div>
                <Label htmlFor="search">Tìm kiếm</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Tìm theo nội dung, người đánh giá..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 neon-border"
                  />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Hiển thị <span className="text-primary neon-text">{filteredReviews.length}</span> / {reviews.length} đánh giá
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Table */}
        <Card className="border-glow">
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4 glow-cyan"></div>
                <p className="text-muted-foreground">Đang tải...</p>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm 
                  ? 'Không tìm thấy đánh giá nào phù hợp'
                  : 'Chưa có đánh giá nào'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead 
                        className="cursor-pointer hover:text-primary transition-colors"
                        onClick={() => toggleSort('userName')}
                      >
                        <div className="flex items-center gap-2">
                          Người đánh giá
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-primary transition-colors"
                        onClick={() => toggleSort('ratingPoint')}
                      >
                        <div className="flex items-center gap-2">
                          Điểm
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Nội dung</TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-primary transition-colors"
                        onClick={() => toggleSort('createdAt')}
                      >
                        <div className="flex items-center gap-2">
                          Ngày tạo
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReviews.map((review) => (
                      <TableRow 
                        key={review.reviewId}
                        className="border-border/30 hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-medium">{review.userName || 'Unknown'}</TableCell>
                        <TableCell>
                          {renderStars(review.ratingPoint)}
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {review.content || 'Không có nội dung'}
                          </p>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {user.userId === review.userId && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleOpenEditDialog(review)}
                                  className="border-primary/30 hover:border-primary hover:bg-primary/10"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setSelectedReview(review);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  className="hover:glow-cyan-strong"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="border-glow">
            <DialogHeader>
              <DialogTitle className="text-gradient neon-text">Chỉnh sửa đánh giá</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin đánh giá của bạn
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="rating">
                  Điểm đánh giá <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={editFormData.ratingPoint}
                  onChange={(e) => setEditFormData({ ...editFormData, ratingPoint: parseInt(e.target.value) || 1 })}
                  className="neon-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Nội dung</Label>
                <Textarea
                  id="content"
                  value={editFormData.content}
                  onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                  placeholder="Chia sẻ trải nghiệm của bạn..."
                  rows={4}
                  className="neon-border"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleUpdateReview} className="glow-cyan hover:glow-cyan-strong">
                Cập nhật
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="border-glow">
            <DialogHeader>
              <DialogTitle className="text-destructive">Xác nhận xóa</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDeleteReview} className="hover:glow-cyan-strong">
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
