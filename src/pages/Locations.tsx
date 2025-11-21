import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Database } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { LocationCard } from '../components/LocationCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { apiCall, getSession } from '../utils/api';
import { toast } from 'sonner@2.0.3';

export function Locations() {
  const [location] = useLocation();
  const [, setLocationRoute] = useLocation();
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [needsInit, setNeedsInit] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    province: '',
  });

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    // Parse URL params
    const params = new URLSearchParams(window.location.search);
    const newFilters = {
      search: params.get('search') || '',
      type: params.get('type') || 'all',
      province: params.get('province') || '',
    };
    setFilters(newFilters);
    loadLocationsWithUser(newFilters);
  }, [location, user]);

  const loadUser = async () => {
    try {
      const session = await getSession();
      setUser(session?.user || null);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadLocationsWithUser = async (searchFilters: any) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchFilters.search) params.set('search', searchFilters.search);
      if (searchFilters.type && searchFilters.type !== 'all') params.set('type', searchFilters.type);
      if (searchFilters.province) params.set('province', searchFilters.province);
      
      // Add userId for preference-based sorting if user is a tourist
      if (user && user.role === 'tourist') {
        params.set('userId', user.userId);
      }

      const data = await apiCall(`/locations?${params.toString()}`);
      setLocations(data.locations || []);
      
      // Check if we need to initialize data
      if (!data.locations || data.locations.length === 0) {
        setNeedsInit(true);
      } else {
        setNeedsInit(false);
      }
    } catch (error) {
      console.error('Error loading locations:', error);
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
    
    window.location.href = `/locations?${queryParams.toString()}`;
  };

  const getTypeLabel = () => {
    switch (filters.type) {
      case 'hotel':
        return 'Khách sạn';
      case 'restaurant':
        return 'Nhà hàng';
      case 'entertainment':
        return 'Địa điểm vui chơi';
      default:
        return 'Tất cả địa điểm';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border/50 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => setLocationRoute('/')}
            className="mb-4 text-primary hover:text-primary/80 hover:bg-primary/10 glow-cyan"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Về trang chủ
          </Button>
          <h1 className="mb-6 text-gradient tracking-tight animate-fade-in neon-text">Khám phá Việt Nam</h1>
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-gradient">{getTypeLabel()}</h2>
            <p className="text-muted-foreground">
              {isLoading ? 'Đang tải...' : `Tìm thấy ${locations.length} kết quả`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-card animate-pulse rounded-lg border border-border glow-cyan" />
            ))}
          </div>
        ) : locations.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location) => (
              <LocationCard key={location.locId} location={location} />
            ))}
          </div>
        ) : needsInit ? (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-lg bg-secondary/20">
            <Database className="h-20 w-20 text-muted-foreground mx-auto mb-6 opacity-50" />
            <p className="text-xl mb-2">Chưa có địa điểm nào trong hệ thống</p>
            <p className="text-muted-foreground/70 mb-8 max-w-md mx-auto">
              Vui lòng khởi tạo dữ liệu mẫu để trải nghiệm đầy đủ tính năng
              <br />
              (25+ địa điểm với reviews chân thực)
            </p>
            <Button
              onClick={handleInitData}
              disabled={isInitializing}
              size="lg"
              className="glow-cyan"
            >
              {isInitializing ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Đang khởi tạo dữ liệu...
                </>
              ) : (
                <>
                  <Database className="h-5 w-5 mr-2" />
                  Khởi tạo dữ liệu ngay
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-4">
              Không tìm thấy địa điểm phù hợp
            </p>
            <p className="text-muted-foreground/70">
              Thử thay đổi bộ lọc hoặc tìm kiếm để xem thêm kết quả
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
