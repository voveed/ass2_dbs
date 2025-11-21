// src/components/ReviewSection.tsx (PHIÊN BẢN HOÀN THIỆN - CÓ LIKE)

import { useState } from 'react';
import { useLocation } from 'wouter';
import { Star, ThumbsUp, CornerDownRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner'; // Import toast
import { apiCall, toggleLikeFeedback } from '../utils/api'; // Import hàm mới
import { cn } from './ui/utils'; // Import cn (hoặc utils)

interface ReviewSectionProps {
  reviews: any[];
  locationId: string;
  user: any;
  onSubmitReview: (reviewData: any) => void;
}

// ====================================================================
// COMPONENT FEEDBACK (ĐÃ SỬA ĐỂ CÓ LIKE)
// ====================================================================
function FeedbackItem({ item, user, isReply = false }: { item: any, user: any, isReply?: boolean }) {
  const [, setLocationRoute] = useLocation();

  // --- State cho Like (QUAN TRỌNG) ---
  const [isLiked, setIsLiked] = useState(item.hasLiked);
  const [likeCount, setLikeCount] = useState(item.likeCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  // ---

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Vừa xong';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleLike = async () => {
    if (isLiking) return; // Chặn spam click

    if (!user) {
        toast.error('Bạn phải đăng nhập để thích bình luận này.');
        setLocationRoute('/auth');
        return;
    }
    
    setIsLiking(true);
    try {
        // Cập nhật UI trước (Optimistic Update)
        setIsLiked(!isLiked);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

        // Gọi API
        const response = await toggleLikeFeedback(item.fbID);
        
        // Đồng bộ lại state với server (phòng trường hợp 2 người cùng like)
        setLikeCount(response.newLikeCount);

    } catch (error: any) {
        // Hoàn tác lại nếu API lỗi
        setIsLiked(!isLiked);
        setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
        
        console.error("Lỗi khi like:", error);
        toast.error(error.message || 'Không thể thích bình luận này.');
    } finally {
        setIsLiking(false);
    }
  };

  return (
    <div className={`flex gap-4 ${isReply ? 'ml-6 md:ml-8 mt-4 pt-4 border-t border-border/50' : ''}`}>
      <Avatar className={isReply ? 'w-8 h-8' : 'w-10 h-10'}>
        <AvatarImage src={item.userAvatar} alt={item.userName} />
        <AvatarFallback>
          {item.userName?.charAt(0).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className={isReply ? 'text-sm font-medium' : 'font-semibold'}>{item.userName}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(item.createdAt)}
            </p>
          </div>
          {item.ratingPoint && (
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= item.ratingPoint
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
        {item.content && (
            <p className="text-foreground mb-3 text-sm">{item.content}</p>
        )}
        
        {item.images && item.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {item.images.map((imgUrl: string, index: number) => (
              <ImageWithFallback
                key={index}
                src={imgUrl}
                alt={`Ảnh feedback ${index + 1}`}
                className="h-20 w-20 object-cover rounded-md border"
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {/* NÚT LIKE ĐÃ SỬA */}
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={cn(
                "flex items-center gap-1 transition-colors",
                isLiked ? "text-primary hover:text-primary/80" : "hover:text-primary",
                isLiking ? "opacity-50" : ""
            )}
          >
            <ThumbsUp className={cn("h-4 w-4", isLiked ? "fill-primary" : "")} />
            <span>Hữu ích ({likeCount})</span>
          </button>
          
           <button className="flex items-center gap-1 hover:text-primary transition-colors">
              <CornerDownRight className="h-4 w-4" />
              <span>Trả lời</span>
            </button>

          {item.isVerified && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              ✓ Đã xác thực
            </span>
          )}
        </div>

        {item.replies && item.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {item.replies.map((reply: any) => (
              // Truyền `user` xuống cho các cấp con
              <FeedbackItem key={reply.fbID} item={reply} user={user} isReply={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ====================================================================
// COMPONENT REVIEW SECTION (Truyền `user` vào `FeedbackItem`)
// ====================================================================
export function ReviewSection({ reviews, locationId, user, onSubmitReview }: ReviewSectionProps) {
  const [, setLocationRoute] = useLocation();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCount, setShowCount] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Vui lòng đăng nhập để viết đánh giá');
      setLocationRoute('/auth');
      return;
    }
    if (user.role !== 'TOURIST') { // Đảm bảo khớp với DB (TOURIST)
      toast.error('Chỉ du khách mới có thể viết đánh giá');
      return;
    }
    onSubmitReview({
      locationId,
      ratingPoint: rating,
      content,
    });
    setContent('');
    setRating(5);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2>Đánh giá ({reviews.length})</h2>
         {!user ? (
          <Button onClick={() => setLocationRoute('/auth')} className="glow-cyan">
            Đăng nhập để viết đánh giá
          </Button>
        ) : user.role === 'TOURIST' ? ( // Đảm bảo khớp với DB (TOURIST)
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="glow-cyan">Viết đánh giá</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Viết đánh giá của bạn</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* ... (Phần form giữ nguyên) ... */}
                <div className="space-y-2">
                  <label className="text-sm">Đánh giá của bạn</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= rating
                              ? 'fill-primary text-primary'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Nội dung đánh giá</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn..."
                    rows={5}
                    required
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit">Gửi đánh giá</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá địa điểm này!
            </CardContent>
          </Card>
        ) : (
          <>
            {reviews.slice(0, showCount).map((review) => (
              <Card key={review.reviewId}>
                <CardContent className="pt-6">
                  {/* SỬA LỖI: Truyền `user` vào FeedbackItem */}
                  <FeedbackItem item={review} user={user} isReply={false} />
                </CardContent>
              </Card>
            ))}
            
            {showCount < reviews.length && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCount(prev => Math.min(prev + 5, reviews.length))}
                  className="border-primary/30 hover:bg-primary/10 hover:text-primary"
                >
                  Xem thêm đánh giá ({reviews.length - showCount} còn lại)
                </Button>
              </div>
            )}
            
            {showCount > 5 && showCount >= reviews.length && (
              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowCount(5)}
                  className="text-muted-foreground hover:text-primary"
                >
                  Thu gọn
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}