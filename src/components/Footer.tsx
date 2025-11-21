import { Mail, MapPin } from 'lucide-react';
import { Separator } from './ui/separator';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-gradient">VivuViet</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Nền tảng du lịch Việt Nam toàn diện, kết nối du khách với các địa điểm độc đáo trên khắp cả nước.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-semibold mb-3">Liên hệ</h3>
            <div className="space-y-2">
              <a 
                href="mailto:vivuviet@vvv.com.vn"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                vivuviet@vvv.com.vn
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="font-semibold mb-3">Pháp lý</h3>
            <div className="space-y-2">
              <a href="/privacy" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Chính sách bảo mật
              </a>
              <a href="/terms" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Điều khoản sử dụng
              </a>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} VivuViet. All rights reserved. | Contact:{' '}
            <a 
              href="mailto:vivuviet@vvv.com.vn" 
              className="text-primary hover:underline"
            >
              vivuviet@vvv.com.vn
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
