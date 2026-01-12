import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QuickFilter {
  label: string;
  query: string;
}

interface QuickFiltersProps {
  onFilterClick: (query: string) => void;
}

const popularSearches: QuickFilter[] = [
  { label: "Kamera DSLR", query: "Kamera DSLR" },
  { label: "Studio Foto", query: "Studio Foto" },
  { label: "Masjid", query: "Masjid" },
  { label: "Aula", query: "Aula" },
  { label: "Lapangan", query: "Lapangan" },
  { label: "Gedung Pertemuan", query: "Gedung Pertemuan" },
  { label: "Tenda", query: "Tenda" },
  { label: "Sound System", query: "Sound System" },
];

export function QuickFilters({ onFilterClick }: QuickFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <p className="text-xs text-muted-foreground">Pencarian Populer :</p>
      <div className="flex flex-wrap gap-2">
        {popularSearches.map((filter) => (
          <Button
            key={filter.label}
            variant="outline"
            size="sm"
            onClick={() => onFilterClick(filter.query)}
            className="h-8 text-xs rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
