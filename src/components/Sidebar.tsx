import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  User, 
  LogOut, 
  Home, 
  Compass, 
  Settings, 
  Database, 
  ShieldCheck, 
  Menu, 
  X, 
  ShoppingCart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { useCart } from '../utils/cartContext';
import { cn } from './ui/utils';

interface SidebarProps {
  user: any;
  onSignOut: () => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ user, onSignOut, onCollapsedChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [location] = useLocation();
  const { getItemCount } = useCart();
  const cartCount = getItemCount();

  const handleToggleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    onCollapsedChange?.(collapsed);
  };

  const isActive = (path: string) => location === path;

  // 1. Menu Chính
  const navItems = [
    { path: '/', icon: Home, label: 'Trang chủ', roles: ['all'] },
    { path: '/locations', icon: Compass, label: 'Khám phá', roles: ['all'] },
    { 
      path: '/cart', 
      icon: ShoppingCart, 
      label: 'Giỏ đặt chỗ', 
      badge: cartCount, 
      roles: ['TOURIST', 'ADMIN'] 
    },
  ];

  // 2. Menu User (ĐÃ BỎ MỤC ĐÁNH GIÁ)
  const userItems = user ? [
    { path: '/profile', icon: User, label: 'Hồ sơ', roles: ['all'] },
    { path: '/dashboard', icon: Settings, label: 'Tài khoản', roles: ['all'] },
    
    // Admin & Business Owner Menu
    ...(user.role === 'BUSINESS_OWNER' || user.role === 'ADMIN' ? [
      { path: '/admin', icon: Settings, label: 'Quản lý địa điểm', roles: ['BUSINESS_OWNER', 'ADMIN'] },
    ] : []),
    
    // Admin Only Menu
    ...(user.role === 'ADMIN' ? [
      { path: '/admin-panel', icon: ShieldCheck, label: 'Quản trị hệ thống', roles: ['ADMIN'] },
      { path: '/data-management', icon: Database, label: 'Quản lý dữ liệu', roles: ['ADMIN'] },
      { path: '/preferences-management', icon: Settings, label: 'Quản lý Sở thích', roles: ['ADMIN'] },
      { path: '/utilities-management', icon: Settings, label: 'Quản lý Tiện ích', roles: ['ADMIN'] },
      { path: '/vouchers-management', icon: Settings, label: 'Quản lý Voucher', roles: ['ADMIN'] },
    ] : []),
  ] : [];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes('all') || (user && item.roles.includes(user.role))
  );

  return (
    <>
      {/* Nút Menu Mobile (Giữ nguyên) */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-card border border-border/50 hover:bg-card/80"
        onClick={() => handleToggleCollapse(!isCollapsed)}
      >
        {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </Button>

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-card border-r border-border/50 shadow-2xl transition-all duration-300 z-40 flex flex-col",
          isCollapsed ? "-translate-x-full md:translate-x-0 md:w-20" : "translate-x-0 w-64"
        )}
      >
        {/* --- PHẦN TRÊN: LOGO (Dùng ảnh logo.png) --- */}
        <div className={cn(
          "flex items-center h-20 border-b border-border/50 transition-all shrink-0", // h-20 cho thoáng
          isCollapsed ? "justify-center px-0" : "px-6 gap-3"
        )}>
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group w-full">
              <div className="relative flex-shrink-0 flex items-center justify-center">
                {/* Dùng thẻ IMG cho logo như yêu cầu */}
                <img 
                  src="/logo.png" 
                  alt="VivuViet Logo" 
                  className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                />
                {/* Hiệu ứng glow nhẹ phía sau logo */}
                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </div>
              
              {!isCollapsed && (
                <span className="text-2xl text-gradient tracking-tight font-bold whitespace-nowrap overflow-hidden animate-fade-in">
                  VIVUVIET
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* --- PHẦN GIỮA: MENU (Đã tăng padding và khoảng cách) --- */}
        <ScrollArea className="flex-1 py-6">
          <div className="px-3 space-y-2"> {/* Tăng khoảng cách giữa các item */}
            {filteredNavItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 group", // Tăng padding y lên py-3
                    isActive(item.path) 
                      ? "bg-primary/10 text-primary font-medium border border-primary/20" 
                      : "hover:bg-accent hover:text-foreground text-muted-foreground border border-transparent",
                    isCollapsed && "justify-center px-2"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className={cn(
                    "h-5 w-5 shrink-0 transition-transform",
                    isActive(item.path) ? "scale-105" : "group-hover:scale-105"
                  )} />
                  
                  {!isCollapsed && (
                    <span className="flex-1 text-sm truncate">{item.label}</span>
                  )}
                  
                  {item.badge !== undefined && item.badge > 0 && (
                    isCollapsed ? (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-card" />
                    ) : (
                      <Badge className="bg-primary text-primary-foreground px-1.5 py-0 text-[10px] h-5 min-w-5 flex items-center justify-center">
                        {item.badge}
                      </Badge>
                    )
                  )}
                </div>
              </Link>
            ))}

            {user && (
              <>
                <div className="py-2">
                  <Separator className="opacity-50" />
                </div>
                {userItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <div className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 group",
                      isActive(item.path)
                        ? "bg-primary/10 text-primary font-medium border border-primary/20"
                        : "hover:bg-accent hover:text-foreground text-muted-foreground border border-transparent",
                      isCollapsed && "justify-center px-2"
                    )}
                    title={isCollapsed ? item.label : undefined}
                    >
                      <item.icon className="h-5 w-5 shrink-0 group-hover:scale-105 transition-transform" />
                      {!isCollapsed && <span className="flex-1 text-sm truncate">{item.label}</span>}
                    </div>
                  </Link>
                ))}
              </>
            )}
          </div>
        </ScrollArea>

        {/* --- PHẦN DƯỚI: USER & ACTION --- */}
        <div className="p-4 border-t border-border/50 bg-card/30 mt-auto">
          {user ? (
            <div className="space-y-3">
              {!isCollapsed && (
                <div className="px-3 py-2.5 bg-secondary/30 rounded-md border border-border/50 mb-2 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary font-bold">
                    {user.fullName?.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="truncate font-medium text-sm text-foreground">{user.fullName}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                       {/* Hiển thị role đẹp hơn */}
                       {user.role === 'TOURIST' ? 'Du khách' : 
                        user.role === 'BUSINESS_OWNER' ? 'Đối tác' : 
                        user.role === 'ADMIN' ? 'Quản trị' : user.role}
                    </p>
                  </div>
                </div>
              )}

              <Button
                onClick={onSignOut}
                variant="outline"
                size={isCollapsed ? "icon" : "default"}
                className={cn(
                  "w-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors",
                  isCollapsed && "h-10 w-10 mx-auto"
                )}
                title="Đăng xuất"
              >
                <LogOut className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">Đăng xuất</span>}
              </Button>
            </div>
          ) : (
            <Link href="/auth">
              <Button 
                className={cn("w-full glow-cyan", isCollapsed && "px-0 h-10 w-10 mx-auto")}
                size={isCollapsed ? "icon" : "default"}
                title="Đăng nhập"
              >
                <User className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">Đăng nhập</span>}
              </Button>
            </Link>
          )}

          {/* Nút Thu Gọn - Đặt ở dưới cùng */}
          <div className="hidden md:flex mt-4 pt-2 border-t border-border/20 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleToggleCollapse(!isCollapsed)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground ml-auto transition-colors"
              title={isCollapsed ? "Mở rộng" : "Thu gọn"}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => handleToggleCollapse(true)}
        />
      )}
    </>
  );
}