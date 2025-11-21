import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { createClient } from '../utils/supabase/client';
import { apiCall, getPreferenceTags } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface AuthProps {
  onAuthSuccess: (user: any, accessToken: string) => void;
}

export function Auth({ onAuthSuccess }: AuthProps) {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up State
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [role, setRole] = useState('tourist');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [nationality, setNationality] = useState('');
  const [legalID, setLegalID] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [availablePreferences, setAvailablePreferences] = useState<string[]>([]);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const prefs = await getPreferenceTags();
      setAvailablePreferences(prefs);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const togglePreference = (pref: string) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences(selectedPreferences.filter(p => p !== pref));
    } else {
      if (selectedPreferences.length >= 10) {
        toast.error('Bạn chỉ có thể chọn tối đa 10 sở thích');
        return;
      }
      setSelectedPreferences([...selectedPreferences, pref]);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await apiCall('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({
          email: signInEmail,
          password: signInPassword,
        }),
      });

      localStorage.setItem('accessToken', data.accessToken);
      onAuthSuccess(data.user, data.accessToken);
      toast.success('Đăng nhập thành công!');
      setLocation('/');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Đăng nhập thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const signUpData: any = {
        email: signUpEmail,
        password: signUpPassword,
        fullName,
        dob,
        role,
        city,
        district,
      };

      if (role === 'tourist') {
        signUpData.nationality = nationality;
        signUpData.legalID = legalID;
        signUpData.preferences = selectedPreferences;
      } else if (role === 'business_owner') {
        signUpData.taxCode = taxCode;
      }

      await apiCall('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(signUpData),
      });

      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      
      // Switch to sign in tab
      const signInTab = document.querySelector('[value="signin"]') as HTMLButtonElement;
      signInTab?.click();
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <Button
        variant="ghost"
        onClick={() => setLocation('/')}
        className="absolute top-4 left-4 text-primary hover:text-primary/80 hover:bg-primary/10 glow-cyan z-20"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Về trang chủ
      </Button>
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="h-8 w-8 text-primary animate-bounce glow-cyan" style={{ animationDuration: '2s' }} />
            <span className="text-3xl text-gradient tracking-tight neon-text">VivuViet</span>
          </div>
          <p className="text-muted-foreground">
            Nền tảng hoạch định du lịch Việt Nam
          </p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Đăng nhập</TabsTrigger>
            <TabsTrigger value="signup">Đăng ký</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Đăng nhập</CardTitle>
                <CardDescription>
                  Đăng nhập vào tài khoản VivuViet của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="email@example.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Mật khẩu</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Đăng ký tài khoản</CardTitle>
                <CardDescription>
                  Tạo tài khoản mới để bắt đầu sử dụng VivuViet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Loại tài khoản</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tourist">Du khách</SelectItem>
                        <SelectItem value="business_owner">Chủ doanh nghiệp</SelectItem>
                        <SelectItem value="admin">Quản trị viên</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullname">Họ và tên</Label>
                    <Input
                      id="fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob">Ngày sinh</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      max={new Date(Date.now() - 567648000000).toISOString().split('T')[0]} // 18 years ago
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="email@example.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mật khẩu</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Thành phố</Label>
                      <Input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">Quận/Huyện</Label>
                      <Input
                        id="district"
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                      />
                    </div>
                  </div>

                  {role === 'tourist' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="nationality">Quốc tịch</Label>
                        <Input
                          id="nationality"
                          type="text"
                          value={nationality}
                          onChange={(e) => setNationality(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="legalID">CMND/CCCD</Label>
                        <Input
                          id="legalID"
                          type="text"
                          value={legalID}
                          onChange={(e) => setLegalID(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Sở thích du lịch (tùy chọn, tối đa 10)</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Chọn sở thích để chúng tôi gợi ý địa điểm phù hợp nhất
                        </p>
                        <div className="flex flex-wrap gap-2 p-3 bg-muted/20 rounded-lg border border-border/50">
                          {availablePreferences.map((pref) => (
                            <Badge
                              key={pref}
                              onClick={() => togglePreference(pref)}
                              className={`cursor-pointer transition-all ${
                                selectedPreferences.includes(pref)
                                  ? 'bg-[#00E5FF] text-black hover:bg-[#00FFC6] border-[#00E5FF]'
                                  : 'bg-[#0A0A0B] text-white/70 hover:bg-[#00E5FF]/20 border-[#00E5FF]/30'
                              } border`}
                            >
                              {pref}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Đã chọn: {selectedPreferences.length}/10
                        </p>
                      </div>
                    </>
                  )}

                  {role === 'business_owner' && (
                    <div className="space-y-2">
                      <Label htmlFor="taxCode">Mã số thuế</Label>
                      <Input
                        id="taxCode"
                        type="text"
                        value={taxCode}
                        onChange={(e) => setTaxCode(e.target.value)}
                      />
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
