import { useState } from 'react';
import { Input, Select, Button } from '../ui';
import { Search, Filter, X } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: {
    key: string;
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
  }[];
  onClearFilters?: () => void;
  placeholder?: string;
  className?: string;
}

export function SearchFilter({
  searchValue,
  onSearchChange,
  filters = [],
  onClearFilters,
  placeholder = 'Search...',
  className = ''
}: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  
  const hasActiveFilters = filters.some(filter => filter.value !== '');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {filters.length > 0 && (
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className={`${hasActiveFilters ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {filters.filter(f => f.value !== '').length}
              </span>
            )}
          </Button>
        )}
        
        {hasActiveFilters && onClearFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && filters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border">
          {filters.map((filter) => (
            <Select
              key={filter.key}
              label={filter.label}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              options={[
                { value: '', label: `All ${filter.label}` },
                ...filter.options
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}