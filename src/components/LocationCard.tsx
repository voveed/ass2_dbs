import { Link } from 'wouter';
import { MapPin, Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LocationCardProps {
  location: any;
}

export function LocationCard({ location }: LocationCardProps) {
  const getLocationTypeLabel = (type: string) => {
    switch (type) {
      case 'hotel':
        return 'Khách sạn';
      case 'restaurant':
        return 'Nhà hàng';
      case 'entertainment':
        return 'Vui chơi';
      default:
        return type;
    }
  };

  const getPriceLevelLabel = (level: string) => {
    switch (level) {
      case 'LUXURY':
        return 'Cao cấp';
      case 'MODERATE':
        return 'Trung bình';
      case 'AFFORDABLE':
        return 'Bình dân';
      default:
        return level;
    }
  };

  return (
    <Link href={`/location/${location.locId}`}>
      <Card className="overflow-hidden hover:shadow-xl hover:shadow-primary/30 hover:glow-cyan transition-all duration-300 cursor-pointer h-full border-border/50 hover:border-primary/50 bg-card group hover:transform hover:scale-[1.02]">
        <div className="relative h-48 overflow-hidden">
          <ImageWithFallback
            src={location.imageUrl}
            alt={location.locName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Badge className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm border-primary/30 shadow-lg">
            {getLocationTypeLabel(location.locType)}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="mb-2 group-hover:text-primary transition-colors duration-300">{location.locName}</h3>
          <div className="flex items-center gap-1 mb-2">
            <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            <span className="text-sm text-muted-foreground">
              {location.district}, {location.province}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {location.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm">
  {Number(location.avgRating || 0).toFixed(1)}
</span>
              <span className="text-sm text-muted-foreground">
                ({location.reviewCount || 0} đánh giá)
              </span>
            </div>
            <Badge variant="outline" className="border-primary/30 group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">{getPriceLevelLabel(location.priceLev)}</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}