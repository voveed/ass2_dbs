// import { useState, useEffect } from 'react';
// import { useLocation } from 'wouter';
// import { ShoppingCart, Trash2, Calendar, MapPin, Tag, ArrowRight, CreditCard, Ticket } from 'lucide-react';
// import { useCart } from '../utils/cartContext';
// import { Button } from '../components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
// import { Separator } from '../components/ui/separator';
// import { ImageWithFallback } from '../components/figma/ImageWithFallback';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
// import { toast } from 'sonner';
// import { apiCall } from '../utils/api';

// export function Cart() {
//   const { items, removeItem, clearCart, getTotalAmount } = useCart();
//   const [, setLocation] = useLocation();
  
//   // --- State cho Voucher ---
//   const [availableVouchers, setAvailableVouchers] = useState<any[]>([]);
//   const [selectedVoucherId, setSelectedVoucherId] = useState<string>('none');
//   const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   // -------------------------

//   // Tính toán tiền
//   const subTotal = getTotalAmount();
//   let discountAmount = 0;

//   if (appliedVoucher) {
//     // Logic giảm giá: Min(Tổng tiền * %, Giới hạn tối đa)
//     discountAmount = Math.min(
//       subTotal * appliedVoucher.discountPercentage, // backend trả về dạng số thập phân (0.1) hoặc % tùy logic
//       appliedVoucher.limitVal > 0 ? appliedVoucher.limitVal : Infinity
//     );
//   }
  
//   const finalTotal = Math.max(0, subTotal - discountAmount);

//   // Load vouchers khi vào giỏ hàng
//   useEffect(() => {
//     const loadVouchers = async () => {
//       try {
//         // Gọi API lấy voucher khả dụng cho user này
//         const data = await apiCall('/vouchers/available');
//         if (data.success) {
//           setAvailableVouchers(data.vouchers || []);
//         }
//       } catch (e) { 
//         console.error('Failed to load vouchers', e); 
//       }
//     };
//     loadVouchers();
//   }, []);

//   // Xử lý khi chọn voucher từ Dropdown
//   const handleSelectVoucher = (val: string) => {
//     setSelectedVoucherId(val);
    
//     if (val === 'none') {
//         setAppliedVoucher(null);
//         toast.info('Đã bỏ áp dụng voucher');
//     } else {
//         const v = availableVouchers.find(item => item.id.toString() === val);
//         if (v) {
//             setAppliedVoucher(v);
//             toast.success(`Đã áp dụng: ${v.description}`);
//         }
//     }
//   };

//   const handleCheckout = async () => {
//     setLoading(true);
//     try {
//       // 1. Gom nhóm các item theo LocationID (vì mỗi Location tạo 1 đơn hàng riêng)
//       const itemsByLoc: { [key: string]: typeof items } = {};
      
//       items.forEach(i => { 
//         if (!itemsByLoc[i.locationId]) itemsByLoc[i.locationId] = []; 
//         itemsByLoc[i.locationId].push(i); 
//       });

//       // 2. Gửi API tạo đơn hàng cho từng Location
//       await Promise.all(Object.keys(itemsByLoc).map(locId => {
//         const locItems = itemsByLoc[locId];
        
//         // Tính tổng tiền riêng cho đơn hàng này
//         const locTotal = locItems.reduce((s, i) => s + i.totalPrice, 0);

//         // JSON chi tiết sản phẩm cho Stored Procedure
//         const itemsJSON = JSON.stringify(locItems.map(i => ({
//             productID: i.productId, 
//             quantity: i.quantity, 
//             unitPrice: i.unitPrice,
//             checkin: i.checkInDate, 
//             checkout: i.checkOutDate || null // Null nếu là nhà hàng, SP tự tính
//         })));

//         return apiCall('/reservations', {
//             method: 'POST',
//             body: JSON.stringify({
//                 locationId: locId,
//                 voucherID: appliedVoucher?.id || null, // Áp dụng voucher cho tất cả đơn (đơn giản hóa)
//                 note: 'Đặt từ giỏ hàng',
//                 totalAmount: locTotal,
//                 itemsJSON: itemsJSON
//             })
//         });
//       }));

//       toast.success('Đặt chỗ thành công! Vui lòng kiểm tra mục Đơn đặt chỗ.');
//       clearCart();
//       setLocation('/dashboard');

//     } catch (e: any) { 
//       console.error(e);
//       toast.error(e.message || 'Lỗi khi thanh toán'); 
//     } finally { 
//       setLoading(false); 
//     }
//   };

//   const fmt = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

//   if (items.length === 0) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background p-4">
//         <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-2">
//             <ShoppingCart className="w-10 h-10 text-muted-foreground"/>
//         </div>
//         <h2 className="text-xl font-bold">Giỏ hàng trống</h2>
//         <p className="text-muted-foreground text-center max-w-md">
//             Bạn chưa chọn dịch vụ nào. Hãy khám phá các địa điểm thú vị nhé!
//         </p>
//         <Button onClick={() => setLocation('/locations')} className="glow-cyan">
//             Khám phá ngay <ArrowRight className="ml-2 h-4 w-4"/>
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background p-4 md:p-8">
//         <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
            
//             {/* DANH SÁCH SẢN PHẨM */}
//             <div className="lg:col-span-2 space-y-4">
//                 <h1 className="text-2xl font-bold flex gap-2 items-center neon-text">
//                     <ShoppingCart className="h-6 w-6"/> Giỏ hàng ({items.length})
//                 </h1>
                
//                 {items.map(item => (
//                     <Card key={item.id} className="border-primary/20 hover:border-primary/50 transition-all">
//                         <div className="flex flex-col sm:flex-row">
//                             <div className="sm:w-48 h-48 sm:h-auto relative">
//                                 <ImageWithFallback src={item.locationImage} className="w-full h-full object-cover" alt={item.locationName}/>
//                             </div>
//                             <div className="p-4 flex-1 flex flex-col justify-between">
//                                 <div>
//                                     <div className="flex justify-between items-start">
//                                         <h3 className="font-bold text-lg text-primary">{item.locationName}</h3>
//                                         <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive hover:bg-destructive/10">
//                                             <Trash2 className="w-4 h-4"/>
//                                         </Button>
//                                     </div>
//                                     <p className="text-sm text-muted-foreground flex gap-1 items-center mt-1">
//                                         <MapPin className="w-3 h-3"/> {item.productName}
//                                     </p>
//                                     <div className="text-sm mt-3 bg-muted/30 p-2 rounded border border-border/50">
//                                         <div className="flex items-center gap-2 mb-1">
//                                             <Calendar className="w-3 h-3 text-primary"/>
//                                             <span>
//                                                 {new Date(item.checkInDate).toLocaleDateString('vi-VN')} 
//                                                 {item.checkOutDate && ` - ${new Date(item.checkOutDate).toLocaleDateString('vi-VN')}`}
//                                             </span>
//                                         </div>
//                                         <div className="text-xs text-muted-foreground">
//                                             Số lượng: {item.quantity} | Khách: {item.numGuests}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="text-right font-bold text-xl text-primary mt-3">
//                                     {fmt(item.totalPrice)}
//                                 </div>
//                             </div>
//                         </div>
//                     </Card>
//                 ))}
//             </div>

//             {/* SUMMARY & THANH TOÁN */}
//             <div>
//                 <Card className="sticky top-24 border-primary/30 shadow-lg">
//                     <CardHeader>
//                         <CardTitle>Thanh toán</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-6">
                        
//                         {/* DROPDOWN CHỌN VOUCHER */}
//                         <div className="space-y-2">
//                             <label className="text-sm font-medium flex items-center gap-2">
//                                 <Ticket className="w-4 h-4 text-primary"/> Mã giảm giá
//                             </label>
                            
//                             {availableVouchers.length > 0 ? (
//                                 <Select value={selectedVoucherId} onValueChange={handleSelectVoucher}>
//                                     <SelectTrigger className="w-full border-primary/30">
//                                         <SelectValue placeholder="Chọn ưu đãi..." />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="none">Không sử dụng</SelectItem>
//                                         {availableVouchers.map((v) => (
//                                             <SelectItem key={v.id} value={v.id.toString()}>
//                                                 <div className="flex flex-col items-start py-1">
//                                                     <span className="font-bold text-primary">Giảm {v.discountPercent}%</span>
//                                                     <span className="text-xs text-muted-foreground truncate max-w-[200px]">{v.description}</span>
//                                                 </div>
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             ) : (
//                                 <p className="text-xs text-muted-foreground italic">Không có voucher khả dụng cho bạn.</p>
//                             )}
//                         </div>

//                         {appliedVoucher && (
//                             <div className="bg-green-500/10 border border-green-500/30 text-green-500 p-2 rounded-md text-sm flex items-center gap-2">
//                                 <Tag className="w-4 h-4" />
//                                 <span>Đã giảm: <strong>-{fmt(discountAmount)}</strong></span>
//                             </div>
//                         )}
                        
//                         <Separator/>
                        
//                         <div className="space-y-2 text-sm">
//                             <div className="flex justify-between">
//                                 <span className="text-muted-foreground">Tạm tính</span>
//                                 <span>{fmt(subTotal)}</span>
//                             </div>
//                             <div className="flex justify-between text-green-500 font-medium">
//                                 <span>Giảm giá</span>
//                                 <span>-{fmt(discountAmount)}</span>
//                             </div>
//                             <div className="flex justify-between font-bold text-xl text-primary pt-2 border-t border-border/50">
//                                 <span>Tổng cộng</span>
//                                 <span>{fmt(finalTotal)}</span>
//                             </div>
//                         </div>
//                     </CardContent>
//                     <CardFooter>
//                         <Button 
//                             className="w-full glow-cyan h-12 text-lg font-bold" 
//                             onClick={handleCheckout} 
//                             disabled={loading}
//                         >
//                             {loading ? (
//                                 <span className="flex items-center gap-2">
//                                     <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/>
//                                     Đang xử lý...
//                                 </span>
//                             ) : (
//                                 <span className="flex items-center gap-2">
//                                     <CreditCard className="w-5 h-5"/> Thanh toán ngay
//                                 </span>
//                             )}
//                         </Button>
//                     </CardFooter>
//                 </Card>
//             </div>
//         </div>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ShoppingCart, Trash2, Calendar, MapPin, Tag, ArrowRight, CreditCard, Ticket, BedDouble, Utensils } from 'lucide-react';
import { useCart } from '../utils/cartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { apiCall } from '../utils/api';

export function Cart() {
  const { items, removeItem, clearCart, getTotalAmount } = useCart();
  const [, setLocation] = useLocation();
  
  const [availableVouchers, setAvailableVouchers] = useState<any[]>([]);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string>('none');
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const subTotal = getTotalAmount();
  let discountAmount = 0;

  if (appliedVoucher) {
    discountAmount = Math.min(
      subTotal * appliedVoucher.discountPercentage,
      appliedVoucher.limitVal > 0 ? appliedVoucher.limitVal : Infinity
    );
  }
  
  const finalTotal = Math.max(0, subTotal - discountAmount);

  useEffect(() => {
    const loadVouchers = async () => {
      try {
        const data = await apiCall('/vouchers/available');
        if (data.success) setAvailableVouchers(data.vouchers || []);
      } catch (e) { console.error('Failed to load vouchers'); }
    };
    loadVouchers();
  }, []);

  const handleSelectVoucher = (val: string) => {
    setSelectedVoucherId(val);
    if (val === 'none') {
        setAppliedVoucher(null);
        toast.info('Đã bỏ áp dụng voucher');
    } else {
        const v = availableVouchers.find(item => item.id.toString() === val);
        if (v) {
            setAppliedVoucher(v);
            toast.success(`Đã áp dụng: ${v.description}`);
        }
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const itemsByLoc: { [key: string]: typeof items } = {};
      items.forEach(i => { 
        if (!itemsByLoc[i.locationId]) itemsByLoc[i.locationId] = []; 
        itemsByLoc[i.locationId].push(i); 
      });

      await Promise.all(Object.keys(itemsByLoc).map(locId => {
        const locItems = itemsByLoc[locId];
        const locTotal = locItems.reduce((s, i) => s + i.totalPrice, 0);

        // JSON chi tiết sản phẩm cho Stored Procedure
        const itemsJSON = JSON.stringify(locItems.map(i => ({
            productID: i.productId, 
            quantity: i.quantity, // Số phòng/bàn/vé
            unitPrice: i.unitPrice, // Giá (đã nhân đêm với hotel) để trigger tính đúng tổng
            checkin: i.checkInDate, 
            checkout: i.checkOutDate || null 
        })));

        return apiCall('/reservations', {
            method: 'POST',
            body: JSON.stringify({
                locationId: locId,
                voucherID: appliedVoucher?.id || null, 
                note: 'Đặt từ giỏ hàng',
                totalAmount: locTotal,
                itemsJSON: itemsJSON
            })
        });
      }));

      toast.success('Đặt chỗ thành công! Vui lòng kiểm tra mục Đơn đặt chỗ.');
      clearCart();
      setLocation('/dashboard');
    } catch (e: any) { 
      toast.error(e.message || 'Lỗi khi thanh toán'); 
    } finally { 
      setLoading(false); 
    }
  };

  const fmt = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  // Helper hiển thị thông tin số lượng
  const renderQuantityInfo = (item: any) => {
    if (item.category === 'ROOMTYPE') {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BedDouble className="w-4 h-4"/>
                <span>{item.quantity} phòng</span>
                <span>×</span>
                <span>{item.nights} đêm</span>
            </div>
        );
    } else if (item.category === 'TABLE_TYPE') {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Utensils className="w-4 h-4"/>
                <span>{item.quantity} bàn</span>
            </div>
        );
    } else {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Ticket className="w-4 h-4"/>
                <span>{item.quantity} vé</span>
            </div>
        );
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background p-4">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-2">
            <ShoppingCart className="w-10 h-10 text-muted-foreground"/>
        </div>
        <h2 className="text-xl font-bold">Giỏ hàng trống</h2>
        <Button onClick={() => setLocation('/locations')} className="glow-cyan">
            Khám phá ngay <ArrowRight className="ml-2 h-4 w-4"/>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                <h1 className="text-2xl font-bold flex gap-2 items-center neon-text">
                    <ShoppingCart className="h-6 w-6"/> Giỏ hàng ({items.length})
                </h1>
                
                {items.map(item => (
                    <Card key={item.id} className="border-primary/20 hover:border-primary/50 transition-all">
                        <div className="flex flex-col sm:flex-row">
                            <div className="sm:w-48 h-48 sm:h-auto relative">
                                <ImageWithFallback src={item.locationImage} className="w-full h-full object-cover" alt={item.locationName}/>
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg text-primary">{item.locationName}</h3>
                                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive hover:bg-destructive/10">
                                            <Trash2 className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground flex gap-1 items-center mt-1">
                                        <MapPin className="w-3 h-3"/> {item.productName}
                                    </p>
                                    
                                    <div className="mt-3 bg-muted/30 p-2 rounded border border-border/50 space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-primary"/>
                                            <span>
                                                {new Date(item.checkInDate).toLocaleDateString('vi-VN')} 
                                                {item.checkOutDate && ` - ${new Date(item.checkOutDate).toLocaleDateString('vi-VN')}`}
                                            </span>
                                        </div>
                                        {renderQuantityInfo(item)}
                                    </div>
                                </div>
                                <div className="text-right font-bold text-xl text-primary mt-3">
                                    {fmt(item.totalPrice)}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div>
                <Card className="sticky top-24 border-primary/30 shadow-lg">
                    <CardHeader><CardTitle>Thanh toán</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Ticket className="w-4 h-4 text-primary"/> Mã giảm giá
                            </label>
                            {availableVouchers.length > 0 ? (
                                <Select value={selectedVoucherId} onValueChange={handleSelectVoucher}>
                                    <SelectTrigger className="w-full border-primary/30">
                                        <SelectValue placeholder="Chọn ưu đãi..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Không sử dụng</SelectItem>
                                        {availableVouchers.map((v) => (
                                            <SelectItem key={v.id} value={v.id.toString()}>
                                                <div className="flex flex-col items-start py-1">
                                                    <span className="font-bold text-primary">Giảm {v.discountPercent}%</span>
                                                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">{v.description}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className="text-xs text-muted-foreground italic">Không có voucher khả dụng.</p>
                            )}
                        </div>

                        {appliedVoucher && (
                            <div className="bg-green-500/10 border border-green-500/30 text-green-500 p-2 rounded-md text-sm flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                <span>Đã giảm: <strong>-{fmt(discountAmount)}</strong></span>
                            </div>
                        )}
                        
                        <Separator/>
                        
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tạm tính</span>
                                <span>{fmt(subTotal)}</span>
                            </div>
                            <div className="flex justify-between text-green-500 font-medium">
                                <span>Giảm giá</span>
                                <span>-{fmt(discountAmount)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl text-primary pt-2 border-t border-border/50">
                                <span>Tổng cộng</span>
                                <span>{fmt(finalTotal)}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full glow-cyan h-12 text-lg font-bold" onClick={handleCheckout} disabled={loading}>
                            {loading ? 'Đang xử lý...' : <><CreditCard className="w-5 h-5 mr-2"/> Thanh toán ngay</>}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>
  );
}