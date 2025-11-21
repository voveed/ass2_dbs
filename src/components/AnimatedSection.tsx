// src/components/AnimatedSection.tsx
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from './ui/utils'; // Import hàm cn từ file utils của bạn

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Thêm delay (ms) nếu muốn
}

export function AnimatedSection({ children, className, delay = 0 }: AnimatedSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true, // Chỉ kích hoạt 1 lần
    threshold: 0.1,    // Kích hoạt khi 10% của component hiện ra
  });

  return (
    <div
      ref={ref}
      className={cn(
        'fade-in-section', // Class CSS chúng ta đã tạo trong index.css
        inView ? 'is-visible' : '',
        className
      )}
      style={{
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}