import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X, User, LogOut, MapPin, ShoppingCart, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useCart } from '../utils/cartContext';

interface HeaderProps {
  user: any;
  onSignOut: () => void;
}

export function Header({ user, onSignOut }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Lấy số lượng item từ Cart Context để hiển thị Badge
  const { getItemCount } = useCart();
  const cartCount = getItemCount();

  // Helper để kiểm tra role an toàn (chuyển về chữ hoa để so sánh)
  const checkRole = (roleToCheck: string) => {
    return user?.role?.toUpperCase() === roleToCheck;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 group cursor-pointer">
            <MapPin className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
            <span className="text-2xl text-gradient tracking-tight font-bold">VivuViet</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/locations">
            <span className="text-muted-foreground hover:text-primary transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full pb-1 cursor-pointer">
              Khám phá
            </span>
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          
          {/* NÚT GIỎ HÀNG: Hiện với Khách (chưa login) HOẶC Tourist */}
          {(!user || checkRole('TOURIST')) && (
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 group">
                <ShoppingCart className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white rounded-full text-xs animate-in zoom-in">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
          )}

          {/* User Menu */}
          {user ? (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:text-primary">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="hidden md:inline font-medium">{user.fullName}</span>
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-56 border-primary/20">
                  {/* Chung cho mọi user */}
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" /> Hồ sơ của tôi
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="w-full flex items-center gap-2 cursor-pointer">
                      <MapPin className="h-4 w-4" /> 
                      {checkRole('TOURIST') ? 'Đơn đặt chỗ' : 'Quản lý đơn hàng'}
                    </Link>
                  </DropdownMenuItem>

                  {/* Riêng cho Business Owner */}
                  {checkRole('BUSINESS_OWNER') && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="w-full flex items-center gap-2 cursor-pointer text-primary">
                        <MapPin className="h-4 w-4" /> Quản lý địa điểm
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {/* Riêng cho Admin */}
                  {checkRole('ADMIN') && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin-panel" className="w-full flex items-center gap-2 cursor-pointer text-primary">
                          <MapPin className="h-4 w-4" /> Admin Panel
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/data-management" className="w-full flex items-center gap-2 cursor-pointer">
                          <MapPin className="h-4 w-4" /> Quản lý Dữ liệu
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* Riêng cho Tourist & Admin (Reviews) */}
                  {(checkRole('TOURIST') || checkRole('ADMIN')) && (
                    <DropdownMenuItem asChild>
                      <Link href="/reviews" className="w-full flex items-center gap-2 cursor-pointer">
                        <Star className="h-4 w-4" /> Đánh giá của tôi
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem 
                    onClick={onSignOut} 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer mt-2 border-t border-border/50"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/auth">
              <Button className="glow-cyan font-semibold">Đăng nhập</Button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-card animate-in slide-in-from-top-5">
          <nav className="container mx-auto flex flex-col gap-4 p-4">
            <Link href="/locations">
              <span className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Khám phá địa điểm
              </span>
            </Link>
            
            {(!user || checkRole('TOURIST')) && (
                <Link href="/cart">
                <span className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer block py-2 flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    Giỏ hàng 
                    {cartCount > 0 && <Badge className="bg-primary text-white h-5 w-5 flex items-center justify-center p-0 rounded-full">{cartCount}</Badge>}
                </span>
                </Link>
            )}

            {user && (
              <>
                <div className="h-px bg-border/50 my-2" />
                <Link href="/profile">
                  <span className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                    Hồ sơ cá nhân
                  </span>
                </Link>
                <Link href="/dashboard">
                  <span className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                    {checkRole('TOURIST') ? 'Đơn đặt chỗ của tôi' : 'Quản lý đơn hàng'}
                  </span>
                </Link>
                <Button 
                    variant="destructive" 
                    className="w-full mt-4"
                    onClick={() => {
                        onSignOut();
                        setIsMobileMenuOpen(false);
                    }}
                >
                    Đăng xuất
                </Button>
              </>
            )}
            
            {!user && (
                <Link href="/auth">
                    <Button className="w-full mt-4 glow-cyan" onClick={() => setIsMobileMenuOpen(false)}>Đăng nhập / Đăng ký</Button>
                </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}