export interface Exhibit {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  source: string;
  uploadedAt: string;
}

export interface Page<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  last: boolean;
}
