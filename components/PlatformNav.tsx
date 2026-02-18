import { PlatformStats, Platform } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface PlatformNavProps {
    platforms: Platform[];
    stats: Record<Platform, PlatformStats>;
    selectedPlatform: Platform;
    onSelectPlatform: (platform: Platform) => void;
}

export default function PlatformNav({ platforms, stats, selectedPlatform, onSelectPlatform }: PlatformNavProps) {
    return (
        <div className="z-20 sticky top-0 px-6 py-3 bg-background/80 backdrop-blur-md border-b border-border/20 shadow-sm">
            <Tabs
                value={selectedPlatform}
                onValueChange={(val) => onSelectPlatform(val as Platform)}
                className="w-full"
            >
                <TabsList className="w-full justify-start h-auto p-1 bg-secondary/30 rounded-full overflow-hidden">
                    {platforms.map(platform => {
                        const stat = stats[platform];
                        let Icon = Twitter;
                        let activeColor = 'text-sky-500';

                        if (platform === 'instagram') { Icon = Instagram; activeColor = 'text-pink-600'; }
                        if (platform === 'facebook') { Icon = Facebook; activeColor = 'text-blue-600'; }
                        if (platform === 'twitter') { Icon = Twitter; activeColor = 'text-sky-500'; }
                        if (platform === 'linkedin') { Icon = Linkedin; activeColor = 'text-blue-700'; }

                        return (
                            <TabsTrigger
                                key={platform}
                                value={platform}
                                className="flex items-center gap-2 px-4 py-2 rounded-full data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-300 ease-out"
                            >
                                <Icon className={cn("w-4 h-4", selectedPlatform === platform ? activeColor : "text-muted-foreground")} />
                                <span className="capitalize hidden sm:inline text-xs font-medium tracking-wide">{platform}</span>
                                {stat?.unreadCount > 0 && (
                                    <Badge variant="destructive" className="h-4 px-1 text-[9px] rounded-full shadow-none animate-pulse">
                                        {stat.unreadCount}
                                    </Badge>
                                )}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
            </Tabs>
        </div>
    );
}
