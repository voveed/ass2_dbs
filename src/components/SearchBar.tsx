import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface SearchBarProps {
  onSearch: (params: { search: string; type: string; province: string }) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [province, setProvince] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ search, type, province: province === 'all' ? '' : province });
  };

  const provinces = [
    'Hà Nội',
    'Hồ Chí Minh',
    'Đà Nẵng',
    'Hải Phòng',
    'Cần Thơ',
    'Quảng Ninh',
    'Lào Cai',
    'Khánh Hòa',
    'Lâm Đồng',
    'Thừa Thiên Huế',
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col md:flex-row gap-3 glass-effect p-4 rounded-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm kiếm địa điểm, khách sạn, nhà hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-primary/20 focus:border-primary transition-all duration-300"
          />
        </div>

        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full md:w-[180px] border-primary/20 hover:border-primary transition-all duration-300">
            <SelectValue placeholder="Loại hình" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="hotel">Khách sạn</SelectItem>
            <SelectItem value="restaurant">Nhà hàng</SelectItem>
            <SelectItem value="entertainment">Vui chơi</SelectItem>
          </SelectContent>
        </Select>

        <Select value={province} onValueChange={setProvince}>
          <SelectTrigger className="w-full md:w-[180px] border-primary/20 hover:border-primary transition-all duration-300">
            <SelectValue placeholder="Tỉnh thành" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {provinces.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button type="submit" className="w-full md:w-auto hover:glow-cyan transition-all duration-300 group">
          <Search className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
          Tìm kiếm
        </Button>
      </div>
    </form>
  );
}
