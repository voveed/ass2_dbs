import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { MapPin, Star, TrendingUp, Database } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { LocationCard } from '../components/LocationCard';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { apiCall } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { AnimatedSection } from '../components/AnimatedSection'; // <-- 1. IMPORT COMPONENT MỚI

export function Home() {
  const [, setLocation] = useLocation();
  const [featuredLocations, setFeaturedLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [needsInit, setNeedsInit] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    loadFeaturedLocations();
  }, []);

  const loadFeaturedLocations = async () => {
    try {
      const data = await apiCall('/locations');
      
      // Check if we need to initialize data
      if (!data.locations || data.locations.length === 0) {
        console.warn('⚠️ No locations found - need to initialize data');
        setNeedsInit(true);
        toast.warning('Chưa có dữ liệu địa điểm. Vui lòng khởi tạo dữ liệu mẫu!', {
          duration: 5000,
        });
      } else {
        setFeaturedLocations(data.locations.slice(0, 4));
        setNeedsInit(false);
      }
    } catch (error) {
      console.error('Error loading featured locations:', error);
      setNeedsInit(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitData = async () => {
    setIsInitializing(true);
    try {
      toast.info('Đang khởi tạo dữ liệu... Vui lòng đợi!');
      
      // Call with force: true to reset existing data
      await apiCall('/init-comprehensive-data', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ force: true })
      });
      
      toast.success('Khởi tạo dữ liệu thành công! Đang tải lại...');
      
      // Reload locations
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error('Error initializing data:', error);
      toast.error('Không thể khởi tạo dữ liệu: ' + (error.message || 'Unknown error'));
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSearch = (params: any) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.set('search', params.search);
    if (params.type && params.type !== 'all') queryParams.set('type', params.type);
    if (params.province) queryParams.set('province', params.province);
    
    setLocation(`/locations?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Init Data Banner */}
      {needsInit && (
        <div className="bg-yellow-500/20 border-y border-yellow-500/50 py-4 sticky top-0 z-50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Database className="h-6 w-6 text-yellow-400 animate-pulse" />
                <div>
                  <p className="font-semibold text-yellow-100">
                    ⚠️ Chưa có dữ liệu trong hệ thống
                  </p>
                  <p className="text-sm text-yellow-200/80">
                    Vui lòng khởi tạo dữ liệu mẫu để trải nghiệm đầy đủ tính năng (25+ địa điểm + reviews)
                  </p>
                </div>
              </div>
              <Button
                onClick={handleInitData}
                disabled={isInitializing}
                className="bg-yellow-500 text-black hover:bg-yellow-400 font-semibold glow-cyan"
              >
                {isInitializing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                    Đang khởi tạo...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Khởi tạo dữ liệu ngay
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* SỬA 1: Giảm độ mờ lớp phủ đen từ 95% xuống 60% */}
        <div className="absolute inset-0 gradient-dark opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20 animate-pulse" style={{ animationDuration: '8s' }} />
        <ImageWithFallback
          // SỬA 2: Đổi link ảnh
          src="https://images.unsplash.com/photo-1598544919456-fcb105fa7a6f?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // (Đây là link nếu bạn đặt ảnh trong thư mục /public)
          alt="VIVUVIET"
          // SỬA 3: Tăng độ mờ ảnh nền từ 20% lên 40%
          className="absolute inset-0 w-full h-full object-cover -z-10 opacity-60"
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-8">
            {/* 2. BỌC CÁC PHẦN TỬ BẰNG AnimatedSection */}
            <AnimatedSection delay={0}>
              <h1 className="text-5xl mb-8 text-foreground/80">
                KHÁM PHÁ VIỆT NAM CÙNG VIVUVIET
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <p className="text-x5 mb-8 text-foreground/80">
                Nền tảng hoạch định du lịch toàn diện với hàng ngàn địa điểm, đánh giá chân thực từ cộng đồng
              </p>
            </AnimatedSection>
          </div>
          <AnimatedSection delay={400} className="max-w-4xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </AnimatedSection>
        </div>
      </section>

      {/* 3. BỌC "FEATURES SECTION" */}
      <AnimatedSection>
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4 border border-primary/30 group-hover:border-primary group-hover:glow-cyan transition-all duration-300">
                  <MapPin className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="mb-2 group-hover:text-primary transition-colors duration-300">Hàng ngàn địa điểm</h3>
                <p className="text-muted-foreground">
                  Khách sạn, nhà hàng, điểm vui chơi khắp Việt Nam
                </p>
              </div>
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4 border border-primary/30 group-hover:border-primary group-hover:glow-cyan transition-all duration-300">
                  <Star className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="mb-2 group-hover:text-primary transition-colors duration-300">Đánh giá chân thực</h3>
                <p className="text-muted-foreground">
                  Hàng triệu đánh giá từ những người đã trải nghiệm
                </p>
              </div>
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4 border border-primary/30 group-hover:border-primary group-hover:glow-cyan transition-all duration-300">
                  <TrendingUp className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="mb-2 group-hover:text-primary transition-colors duration-300">Đặt chỗ dễ dàng</h3>
                <p className="text-muted-foreground">
                  Quy trình đặt chỗ nhanh chóng và an toàn
                </p>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* 4. BỌC "FEATURED LOCATIONS" */}
      <AnimatedSection>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="mb-2 text-gradient">Địa điểm nổi bật</h2>
                <p className="text-muted-foreground">
                  Những địa điểm được yêu thích nhất bởi cộng đồng
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setLocation('/locations')}
              >
                Xem tất cả
              </Button>
            </div>

            {/* (Giữ nguyên logic isLoading/featuredLocations/needsInit) */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-80 bg-card animate-pulse rounded-lg border border-border" />
                ))}
              </div>
            ) : featuredLocations.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredLocations.map((location) => (
                  <LocationCard key={location.locId} location={location} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-border rounded-lg bg-secondary/20">
                <Database className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="mb-2 text-muted-foreground">Chưa có địa điểm nào</h3>
                <p className="text-sm text-muted-foreground/60 mb-6">
                  Vui lòng khởi tạo dữ liệu mẫu để xem địa điểm nổi bật
                </p>
                <Button
                  onClick={handleInitData}
                  disabled={isInitializing}
                  className="glow-cyan"
                >
                  {isInitializing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Đang khởi tạo...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Khởi tạo dữ liệu
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </section>
      </AnimatedSection>

      {/* 5. BỌC "CTA SECTION" */}
      <AnimatedSection>
        <section className="py-16 gradient-cyan relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background/30 to-transparent"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="mb-6 text-primary-foreground tracking-tight">
              Khám phá Việt Nam cùng VivuViet
            </h2>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setLocation('/locations')}
                className="bg-background text-foreground hover:bg-background/90 hover:glow-cyan-strong transition-all duration-300"
              >
                Bắt đầu khám phá
              </Button>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}