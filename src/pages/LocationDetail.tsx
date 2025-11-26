// import { useEffect, useState } from 'react';
// import { useRoute, useLocation } from 'wouter';
// import { MapPin, Star, Clock, DollarSign, Phone, ArrowLeft } from 'lucide-react';
// import { ImageWithFallback } from '../components/figma/ImageWithFallback';
// import { BookingForm } from '../components/BookingForm';
// import { ReviewSection } from '../components/ReviewSection';
// import { Badge } from '../components/ui/badge';
// import { Card, CardContent } from '../components/ui/card';
// import { Separator } from '../components/ui/separator';
// import { Button } from '../components/ui/button';
// import { apiCall } from '../utils/api';
// import { toast } from 'sonner@2.0.3';

// interface LocationDetailProps {
//   user: any;
// }

// export function LocationDetail({ user }: LocationDetailProps) {
//   const [, params] = useRoute('/location/:id');
//   const [, setLocationRoute] = useLocation();
//   const [location, setLocation] = useState<any>(null);
//   const [products, setProducts] = useState<any[]>([]); // Thêm state products
//   const [reviews, setReviews] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (params?.id) {
//       loadLocationDetail(params.id);
//     }
//   }, [params?.id]);

//   const loadLocationDetail = async (id: string) => {
//     setIsLoading(true);
//     try {
//       const data = await apiCall(`/locations/${id}`);
//       setLocation(data.location);
//       setProducts(data.products || []); // Lưu products vào state
//       setReviews(data.reviews || []);
//     } catch (error) {
//       console.error('Error loading location detail:', error);
//       toast.error('Không thể tải thông tin địa điểm');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleBooking = async (bookingData: any) => {
//     try {
//       const accessToken = localStorage.getItem('accessToken');
//       if (!accessToken) {
//         toast.error('Vui lòng đăng nhập để đặt chỗ');
//         return;
//       }

//       await apiCall('/reservations', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(bookingData),
//       });

//       toast.success('Đặt chỗ thành công! Kiểm tra đơn đặt chỗ của bạn trong tài khoản.');
//     } catch (error: any) {
//       console.error('Error creating reservation:', error);
//       toast.error(error.message || 'Không thể tạo đơn đặt chỗ');
//     }
//   };

//   const handleSubmitReview = async (reviewData: any) => {
//     try {
//       const accessToken = localStorage.getItem('accessToken');
//       if (!accessToken) {
//         toast.error('Vui lòng đăng nhập để viết đánh giá');
//         return;
//       }

//       await apiCall('/reviews', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(reviewData),
//       });

//       toast.success('Đánh giá của bạn đã được gửi thành công!');

//       // Reload location to get updated reviews
//       if (params?.id) {
//         loadLocationDetail(params.id);
//       }
//     } catch (error: any) {
//       console.error('Error submitting review:', error);
//       toast.error(error.message || 'Không thể gửi đánh giá');
//     }
//   };

//   const getPriceLevelLabel = (level: string) => {
//     switch (level) {
//       case 'LUXURY':
//         return 'Cao cấp';
//       case 'MODERATE':
//         return 'Trung bình';
//       case 'AFFORDABLE':
//         return 'Bình dân';
//       default:
//         return level;
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="text-center">
//           <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6 glow-cyan-strong"></div>
//           <p className="text-muted-foreground animate-pulse text-xl">Đang tải địa điểm...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!location) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="text-center">
//           <p className="text-xl text-muted-foreground mb-4">Không tìm thấy địa điểm</p>
//           <Button onClick={() => setLocationRoute('/locations')} className="glow-cyan">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Quay lại danh sách
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Back Button */}
//       <div className="container mx-auto px-4 py-4">
//         <Button
//           variant="ghost"
//           onClick={() => setLocationRoute('/locations')}
//           className="text-primary hover:text-primary/80 hover:bg-primary/10 glow-cyan"
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Quay lại danh sách
//         </Button>
//       </div>

//       {/* Hero Image */}
//       <div className="h-96 relative">
//         <ImageWithFallback
//           src={location.imageUrl}
//           alt={location.locName}
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
//       </div>

//       <div className="container mx-auto px-4 -mt-20 relative z-10">
//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             <Card>
//               <CardContent className="pt-6">
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <h1 className="mb-2 text-gradient">{location.locName}</h1>
//                     <div className="flex items-center gap-4 flex-wrap">
//                       <div className="flex items-center gap-1">
//                         <MapPin className="h-5 w-5 text-muted-foreground" />
//                         <span className="text-muted-foreground">
//                           {location.district}, {location.province}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Star className="h-5 w-5 fill-primary text-primary" />
//                         <span>
//                           {location.avgRating?.toFixed(1) || 'N/A'}
//                         </span>
//                         <span className="text-muted-foreground">
//                           ({location.reviewCount || 0} đánh giá)
//                         </span>
//                       </div>
//                       <Badge className="bg-primary/20 text-primary border-primary/30">{getPriceLevelLabel(location.priceLev)}</Badge>
//                     </div>
//                   </div>
//                 </div>

//                 <Separator className="my-4" />

//                 <div className="space-y-4">
//                   <div>
//                     <h3 className="mb-2">Giới thiệu</h3>
//                     <p className="text-muted-foreground">{location.description}</p>
//                   </div>

//                   {location.openingHours && location.openingHours.length > 0 && (
//                     <div>
//                       <h3 className="mb-2 flex items-center gap-2">
//                         <Clock className="h-5 w-5" />
//                         Giờ mở cửa
//                       </h3>
//                       <div className="space-y-1 text-muted-foreground">
//                         {location.openingHours.map((hours: any, index: number) => (
//                           <p key={index}>
//                             {hours.dayOfWeek}: {hours.openTime} - {hours.closeTime}
//                           </p>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {location.utilities && location.utilities.length > 0 && (
//                     <div>
//                       <h3 className="mb-2">Tiện ích</h3>
//                       <div className="flex flex-wrap gap-2">
//                         {location.utilities.map((utility: string, index: number) => (
//                           <Badge key={index} variant="secondary" className="bg-secondary/50 border-border/50">
//                             {utility}
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {location.locType === 'hotel' && (
//                     <div>
//                       <h3 className="mb-2">Thông tin khách sạn</h3>
//                       <div className="grid grid-cols-2 gap-4 text-sm">
//                         <div>
//                           <p className="text-muted-foreground">Xếp hạng sao</p>
//                           <p className="flex items-center gap-1">
//                             {location.hotelStarRating}
//                             <Star className="h-4 w-4 fill-primary text-primary" />
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-muted-foreground">Check-in / Check-out</p>
//                           <p>
//                             {location.standardCheckIn} / {location.standardCheckOut}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {location.locType === 'restaurant' && location.cuisineType && (
//                     <div>
//                       <h3 className="mb-2">Ẩm thực</h3>
//                       <Badge variant="secondary" className="bg-secondary/50 border-border/50">{location.cuisineType}</Badge>
//                     </div>
//                   )}

//                   {location.locType === 'entertainment' && (
//                     <div>
//                       <h3 className="mb-2">Thông tin điểm vui chơi</h3>
//                       <div className="space-y-2 text-sm">
//                         {location.attractionType && (
//                           <div>
//                             <span className="text-muted-foreground">Loại hình: </span>
//                             <span>{location.attractionType}</span>
//                           </div>
//                         )}
//                         {location.targetAudience && (
//                           <div>
//                             <span className="text-muted-foreground">Đối tượng: </span>
//                             <span>{location.targetAudience}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Reviews */}
//             <Card>
//               <CardContent className="pt-6">
//                 <ReviewSection
//                   reviews={reviews}
//                   locationId={location.locId}
//                   user={user}
//                   onSubmitReview={handleSubmitReview}
//                 />
//               </CardContent>
//             </Card>
//           </div>

//           {/* Sidebar - Booking Form */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-20">
//               {/* TRUYỀN PRODUCTS XUỐNG BOOKING FORM */}
//               <BookingForm
//                 location={location}
//                 products={products} 
//                 user={user}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { MapPin, Star, Clock, DollarSign, CheckCircle, ArrowLeft, Wifi, Car, Coffee } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { BookingForm } from '../components/BookingForm';
import { ReviewSection } from '../components/ReviewSection';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';
import { apiCall } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { ScrollArea, ScrollBar } from '../components/ui/scroll-area';

interface LocationDetailProps {
    user: any;
}

export function LocationDetail({ user }: LocationDetailProps) {
    const [, params] = useRoute('/location/:id');
    const [, setLocationRoute] = useLocation();
    const [location, setLocation] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [utilities, setUtilities] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (params?.id) {
            loadLocationDetail(params.id);
        }
    }, [params?.id]);

    const loadLocationDetail = async (id: string) => {
        setIsLoading(true);
        try {
            const data = await apiCall(`/locations/${id}`);
            setLocation(data.location);
            setProducts(data.products || []);
            setUtilities(data.utilities || []);
            setReviews(data.reviews || []);
        } catch (error) {
            console.error('Error loading location detail:', error);
            toast.error('Không thể tải thông tin địa điểm');
        } finally {
            setIsLoading(false);
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

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!location) return <div>Not Found</div>;

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header & Back Button */}
            <div className="relative h-[400px]">
                <ImageWithFallback src={location.imageUrl} alt={location.locName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <Button
                    variant="ghost"
                    onClick={() => setLocationRoute('/locations')}
                    className="absolute top-6 left-6 text-white hover:bg-black/20"
                >
                    <ArrowLeft className="mr-2 h-5 w-5" /> Quay lại
                </Button>

                <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="container mx-auto">
                        <Badge className="mb-2 bg-primary text-primary-foreground">{location.locType}</Badge>
                        <h1 className="text-4xl font-bold text-white mb-2 shadow-sm">{location.locName}</h1>
                        <div className="flex items-center gap-4 text-white/90">
                            <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {location.district}, {location.province}</span>
                            <span className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" /> {location.avgRating?.toFixed(1)} ({location.reviewCount} đánh giá)</span>
                            <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1" /> {getPriceLevelLabel(location.priceLev)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8 grid lg:grid-cols-3 gap-8">
                {/* MAIN CONTENT */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Description */}
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="text-xl font-bold mb-4">Giới thiệu</h3>
                            <p className="text-muted-foreground leading-relaxed">{location.description}</p>
                        </CardContent>
                    </Card>

                    {/* UTILITIES with Images */}
                    {utilities.length > 0 && (
                        <Card>
                            <CardHeader><CardTitle>Tiện ích & Dịch vụ</CardTitle></CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {utilities.map((uti: any, idx: number) => (
                                        <div key={idx} className="flex flex-col items-center text-center p-3 rounded-lg border border-border/50 bg-secondary/10">
                                            {uti.image ? (
                                                <ImageWithFallback src={uti.image} className="w-12 h-12 rounded-full object-cover mb-2" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 text-primary">
                                                    <CheckCircle className="w-6 h-6" />
                                                </div>
                                            )}
                                            <span className="font-medium text-sm">{uti.uName}</span>
                                            {uti.UDescription && <span className="text-xs text-muted-foreground mt-1">{uti.UDescription}</span>}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* PRODUCTS LIST (Room/Table/Ticket) */}
                    {products.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                {location.locType === 'HOTEL' ? 'Các loại phòng' : location.locType === 'RESTAURANT' ? 'Thực đơn & Bàn' : 'Vé tham quan'}
                            </h3>
                            {products.map((prod: any) => (
                                <Card key={prod.productID} className="overflow-hidden hover:border-primary/50 transition-all">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Product Image */}
                                        <div className="md:w-1/3 h-48 md:h-auto relative">
                                            <ImageWithFallback
                                                src={prod.images && prod.images.length > 0 ? prod.images[0] : location.imageUrl}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {/* Product Info */}
                                        <div className="flex-1 p-6 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-lg font-bold text-primary">{prod.productName}</h4>
                                                    <div className="text-right">
                                                        <span className="text-xl font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.basePrice)}</span>
                                                        <p className="text-xs text-muted-foreground">/ {prod.pricingUnit}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-2 mb-4">{prod.description}</p>

                                                {/* Subtype Attributes */}
                                                <div className="flex flex-wrap gap-2">
                                                    {prod.roomCapacity && <Badge variant="outline">Sức chứa: {prod.roomCapacity} người</Badge>}
                                                    {prod.tableCapacity && <Badge variant="outline">Bàn {prod.tableCapacity} ghế</Badge>}
                                                    {prod.tableView && <Badge variant="secondary">{prod.tableView}</Badge>}
                                                    {prod.ticketAudience && <Badge variant="outline">Dành cho: {prod.ticketAudience}</Badge>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Reviews Section */}
                    <Card>
                        <CardContent className="pt-6">
                            <ReviewSection
                                reviews={reviews}
                                locationId={location.locId}
                                user={user}
                                onSubmitReview={async (data) => {
                                    await apiCall('/reviews', { method: 'POST', body: JSON.stringify(data) });
                                    toast.success('Đã gửi đánh giá!');
                                    loadLocationDetail(location.locId);
                                }}
                                onUpdateSuccess={() => loadLocationDetail(location.locId)}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* SIDEBAR - BOOKING FORM */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <BookingForm
                            location={location}
                            products={products}
                            user={user}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}