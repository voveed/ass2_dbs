import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { apiCall } from '../utils/api';

export function Debug() {
  const [serverStatus, setServerStatus] = useState<any>(null);
  const [locations, setLocations] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkServer();
  }, []);

  const checkServer = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Test health endpoint
      const health = await apiCall('/health');
      setServerStatus(health);
      
      // Test locations endpoint
      const locs = await apiCall('/locations');
      setLocations(locs);
    } catch (err: any) {
      console.error('Debug error:', err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const initData = async () => {
    try {
      setError('');
      // Call with force: true to reset existing data
      await apiCall('/init-comprehensive-data', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ force: true })
      });
      alert('Data initialized! Refreshing...');
      window.location.reload();
    } catch (err: any) {
      setError(err.message || String(err));
    }
  };

  const testTypeFilter = async (type: string) => {
    try {
      setError('');
      const data = await apiCall(`/locations?type=${type}`);
      alert(`Found ${data.locations?.length || 0} ${type} locations`);
      console.log(`${type} locations:`, data.locations);
    } catch (err: any) {
      setError(err.message || String(err));
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-[#00E5FF] neon-text text-center">🔧 VivuViet Debug Panel</h1>

        {/* Data Mismatch Warning */}
        {!loading && locations?.locations && locations.locations.length > 0 && (
          <Card className="bg-red-900/30 border-red-500/50">
            <CardHeader>
              <CardTitle className="text-red-300 flex items-center gap-2">
                ⚠️ Data Mismatch Detected
              </CardTitle>
            </CardHeader>
            <CardContent className="text-red-200 space-y-3">
              <p>
                Hệ thống phát hiện dữ liệu cũ có thể chứa <strong>fake reviewCount</strong>.
              </p>
              <p className="text-sm text-red-300/80">
                Click button <strong>"🔥 Force Reset & Reload Data"</strong> bên dưới để xóa dữ liệu cũ 
                và tạo dữ liệu mới với reviews thật.
              </p>
              <div className="bg-red-950/50 p-3 rounded border border-red-500/30 text-xs">
                <div className="font-semibold mb-1">Sẽ xóa:</div>
                <ul className="list-disc list-inside space-y-1 text-red-300/70">
                  <li>Tất cả locations cũ</li>
                  <li>Tất cả reviews cũ</li>
                </ul>
                <div className="font-semibold mt-2 mb-1">Sẽ tạo mới:</div>
                <ul className="list-disc list-inside space-y-1 text-red-300/70">
                  <li>25+ locations với data đầy đủ</li>
                  <li>5-10 reviews thật cho mỗi location</li>
                  <li>avgRating tính từ reviews</li>
                  <li>reviewCount = số reviews thực tế</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card className="bg-[#1A1B1E] border-[#00E5FF]/30">
            <CardContent className="p-8 text-center text-white">
              Loading...
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="bg-red-900/20 border-red-500/50">
            <CardHeader>
              <CardTitle className="text-red-300">❌ Error</CardTitle>
            </CardHeader>
            <CardContent className="text-red-200">
              <pre className="whitespace-pre-wrap">{error}</pre>
            </CardContent>
          </Card>
        )}

        {!loading && (
          <>
            <Card className="bg-[#1A1B1E] border-[#00E5FF]/30">
              <CardHeader>
                <CardTitle className="text-[#00E5FF]">🏥 Server Health</CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                {serverStatus ? (
                  <pre className="bg-black/50 p-4 rounded overflow-auto">
                    {JSON.stringify(serverStatus, null, 2)}
                  </pre>
                ) : (
                  <p className="text-red-300">❌ Server not responding</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#1A1B1E] border-[#00E5FF]/30">
              <CardHeader>
                <CardTitle className="text-[#00E5FF]">📍 Locations Data</CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                {locations ? (
                  <>
                    <p className="mb-4">
                      Found <strong className="text-[#00E5FF]">{locations.locations?.length || 0}</strong> locations
                    </p>
                    {locations.locations?.length > 0 ? (
                      <div className="space-y-2">
                        {locations.locations.slice(0, 5).map((loc: any, i: number) => (
                          <div key={i} className="bg-black/50 p-3 rounded">
                            <div className="text-[#00E5FF]">{loc.locName}</div>
                            <div className="text-white/60 text-sm">
                              {loc.province} • {loc.locType}
                            </div>
                          </div>
                        ))}
                        {locations.locations.length > 5 && (
                          <p className="text-white/60">...and {locations.locations.length - 5} more</p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center p-6 border-2 border-yellow-500/50 bg-yellow-900/20 rounded-lg">
                        <p className="text-yellow-300 mb-2 text-lg">⚠️ No locations found in database</p>
                        <p className="text-white/60 text-sm mb-4">Click below to initialize sample data</p>
                        <Button
                          onClick={initData}
                          className="bg-[#00E5FF] text-black hover:bg-[#00FFC6] text-lg px-8 py-6"
                        >
                          🚀 Initialize 25+ Locations with Reviews
                        </Button>
                        <p className="text-white/40 text-xs mt-3">
                          Includes hotels, restaurants, entertainment venues + 5-10 reviews each
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-red-300">❌ Could not load locations</p>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={checkServer}
                className="bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 border border-[#00E5FF]/50"
              >
                🔄 Refresh Status
              </Button>
              <Button
                onClick={initData}
                className="bg-red-500 text-white hover:bg-red-600 border-2 border-red-400"
              >
                🔥 Force Reset & Reload Data
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                className="bg-[#00E5FF] text-black hover:bg-[#00FFC6]"
              >
                🏠 Go to Home
              </Button>
            </div>

            <Card className="bg-[#1A1B1E] border-[#00E5FF]/30">
              <CardHeader>
                <CardTitle className="text-[#00E5FF]">🧪 Test Type Filtering</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-white/80 text-sm">Test location filtering by type:</p>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    onClick={() => testTypeFilter('hotel')}
                    className="bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 border border-[#00E5FF]/50"
                  >
                    Test Hotels
                  </Button>
                  <Button
                    onClick={() => testTypeFilter('restaurant')}
                    className="bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 border border-[#00E5FF]/50"
                  >
                    Test Restaurants
                  </Button>
                  <Button
                    onClick={() => testTypeFilter('entertainment')}
                    className="bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 border border-[#00E5FF]/50"
                  >
                    Test Entertainment
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1B1E] border-[#00E5FF]/30">
              <CardHeader>
                <CardTitle className="text-[#00E5FF]">ℹ️ System Info</CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 space-y-2">
                <div>• URL: {window.location.href}</div>
                <div>• Access Token: {localStorage.getItem('accessToken') ? '✅ Present' : '❌ None'}</div>
                <div>• Timestamp: {new Date().toISOString()}</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
