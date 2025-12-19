export interface JobHighlight {
  id: string;
  restaurantName: string;
  headline: string;
  location: string;
  salary: string;
  duration: string;
  tags: string[];
  featured?: boolean;
  imageUrl?: string;
}

export interface JobHighlightCardProps {
  job: JobHighlight;
  onSelect?: (job: JobHighlight) => void;
}

export interface JobHighlightGridProps {
  jobs: JobHighlight[];
  onSelect?: (job: JobHighlight) => void;
  actionLabel?: string;
  columns?: 1 | 2 | 3;
}
