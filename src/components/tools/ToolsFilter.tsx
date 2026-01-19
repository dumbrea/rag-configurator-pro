import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ToolsFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  discoverableFilter: string;
  onDiscoverableChange: (value: string) => void;
}

const ToolsFilter = ({
  searchQuery,
  onSearchChange,
  discoverableFilter,
  onDiscoverableChange,
}: ToolsFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by function name or description..."
          className="pl-10 bg-card/50 border-border/50"
        />
      </div>
      <div className="flex gap-3">
        <Select value={discoverableFilter} onValueChange={onDiscoverableChange}>
          <SelectTrigger className="w-[160px] bg-card/50 border-border/50">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tools</SelectItem>
            <SelectItem value="discoverable">Discoverable</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ToolsFilter;
