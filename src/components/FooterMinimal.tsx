import { Mail, MapPin } from 'lucide-react';

export function FooterMinimal() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border/50 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-semibold text-gradient">VivuViet</span>
          </div>

          {/* Copyright & Contact */}
          <div className="text-sm text-muted-foreground text-center md:text-right">
            <p>
              © {currentYear} VivuViet. All rights reserved.
            </p>
            <a 
              href="mailto:vivuviet@vvv.com.vn"
              className="flex items-center justify-center md:justify-end gap-1 text-primary hover:underline mt-1"
            >
              <Mail className="h-3 w-3" />
              vivuviet@vvv.com.vn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
