import { Database, Zap, Server, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
}

const StatCard = ({ title, value, icon, gradient }: StatCardProps) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-xl border border-border/50 p-6',
      'bg-gradient-to-br backdrop-blur-sm transition-all duration-300',
      'hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5',
      gradient
    )}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{title}</p>
      </div>
      <div className="rounded-lg bg-background/20 p-2.5">
        {icon}
      </div>
    </div>
    <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
  </div>
);

interface StatsCardsProps {
  ragCount: number;
  apiCount: number;
  mcpCount: number;
  actionCount: number;
}

const StatsCards = ({ ragCount, apiCount, mcpCount, actionCount }: StatsCardsProps) => {
  const stats = [
    {
      title: 'RAG Tools',
      value: ragCount,
      icon: <Database className="h-5 w-5 text-primary" />,
      gradient: 'from-card to-card/80 hover:from-primary/10 hover:to-card',
    },
    {
      title: 'API Tools',
      value: apiCount,
      icon: <Zap className="h-5 w-5 text-warning" />,
      gradient: 'from-card to-card/80 hover:from-warning/10 hover:to-card',
    },
    {
      title: 'MCP Tools',
      value: mcpCount,
      icon: <Server className="h-5 w-5 text-success" />,
      gradient: 'from-card to-card/80 hover:from-success/10 hover:to-card',
    },
    {
      title: 'Actions',
      value: actionCount,
      icon: <Play className="h-5 w-5 text-accent" />,
      gradient: 'from-card to-card/80 hover:from-accent/10 hover:to-card',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

export default StatsCards;
