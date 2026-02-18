import { Commenter } from '@/lib/data';
import Image from 'next/image';
import { User, MessageCircle, BarChart, Smile, ExternalLink, Calendar, MapPin, Hash, Mail, Activity, BarChart2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

export default function CommenterMetadata({ commenter }: { commenter: Commenter | null }) {
    if (!commenter) {
        return (
            <div className="h-full flex items-center justify-center p-8 text-center text-muted-foreground select-none">
                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500 opacity-60">
                    <div className="bg-secondary p-4 rounded-full shadow-inner">
                        <User size={32} className="opacity-50" />
                    </div>
                    <div>
                        <p className="font-semibold text-foreground">Select a Citizen</p>
                        <p className="text-sm max-w-[200px] mx-auto mt-2">
                            Click on a comment to view public sentiment and engagement history.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <ScrollArea className="h-full bg-background/50">
            <div className="p-6 space-y-8">
                {/* Profile Header - Cleaner, no borders */}
                <div className="flex flex-col items-center text-center animate-in slide-in-from-right duration-300">
                    <Avatar className="w-20 h-20 shadow-lg ring-4 ring-background mb-4 transition-transform hover:scale-105 duration-300">
                        <AvatarImage src={commenter.avatar} alt={commenter.name} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">{commenter.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <h2 className="text-lg font-bold tracking-tight text-foreground">{commenter.name}</h2>

                    <Button variant="link" className="h-auto p-0 mt-1 text-muted-foreground hover:text-primary transition-colors text-sm" asChild>
                        <a href={`https://${commenter.platform}.com/${commenter.handle}`} target="_blank" rel="noopener noreferrer">
                            @{commenter.handle} <ExternalLink size={10} className="ml-1 opacity-50" />
                        </a>
                    </Button>

                    {commenter.bio && (
                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-[260px] italic opacity-80">
                            "{commenter.bio}"
                        </p>
                    )}

                    <div className="flex flex-wrap gap-2 justify-center mt-5">
                        <Badge variant="secondary" className="font-medium bg-secondary/50 hover:bg-secondary transition-colors text-xs py-0.5 px-2 rounded-full shadow-sm">
                            <MapPin size={10} className="mr-1 opacity-60" /> Local Resident
                        </Badge>
                        <Badge variant="secondary" className="font-medium bg-secondary/50 hover:bg-secondary transition-colors text-xs py-0.5 px-2 rounded-full shadow-sm">
                            <Calendar size={10} className="mr-1 opacity-60" /> Active since '21
                        </Badge>
                    </div>
                </div>

                {/* Engagement Overview - Replacing "Journey" */}
                {/* No Card borders, relying on background subtle separation */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/30 rounded-xl p-4 text-center transition-colors hover:bg-secondary/50">
                        <div className="flex justify-center mb-2">
                            <MessageSquare size={18} className="text-primary opacity-80" />
                        </div>
                        <div className="text-xl font-bold text-foreground">{commenter.totalCommentsOnPost}</div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">Post Claims</div>
                    </div>

                    <div className="bg-secondary/30 rounded-xl p-4 text-center transition-colors hover:bg-secondary/50">
                        <div className="flex justify-center mb-2">
                            <Activity size={18} className="text-blue-500 opacity-80" />
                        </div>
                        <div className="text-xl font-bold text-foreground">{commenter.totalCommentsBrand}</div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">Total History</div>
                    </div>
                </div>

                {/* Sentiment Analysis - Renamed to Public Sentiment / Civic Tone */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                            <Smile size={16} className="text-muted-foreground" /> Civic Tone
                        </h3>
                        <Badge variant="outline" className={cn(
                            "border-0 font-bold shadow-sm",
                            (commenter.sentimentScore || 0) >= 70 ? "bg-green-500/10 text-green-600" : (commenter.sentimentScore || 0) >= 40 ? "bg-yellow-500/10 text-yellow-600" : "bg-red-500/10 text-red-600"
                        )}>
                            {(commenter.sentimentScore || 0) >= 70 ? "Pro-Agency" : (commenter.sentimentScore || 0) >= 40 ? "Neutral" : "Critical"}
                        </Badge>
                    </div>

                    <div className="bg-secondary/20 p-4 rounded-xl space-y-3">
                        <div className="flex justify-between text-xs font-medium text-muted-foreground mb-1">
                            <span>Negative</span>
                            <span>Neutral</span>
                            <span>Positive</span>
                        </div>
                        <Progress
                            value={commenter.sentimentScore}
                            className="h-2.5 bg-secondary"
                            indicatorClassName={cn(
                                "rounded-full transition-all duration-1000 ease-out",
                                (commenter.sentimentScore || 0) >= 70 ? "bg-green-500" : (commenter.sentimentScore || 0) >= 40 ? "bg-yellow-500" : "bg-red-500"
                            )}
                        />
                        <p className="text-xs text-muted-foreground leading-relaxed mt-2 opacity-80">
                            Based on language analysis of recent public comments.
                        </p>
                    </div>
                </div>

                {/* Actions - No "Resolve" */}
                <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1 mb-2">Agency Actions</h3>
                    <div className="grid grid-cols-1 gap-2">
                        <Button variant="secondary" className="justify-start h-10 w-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all shadow-sm">
                            <Mail size={14} className="mr-2 opacity-70" /> Contact Citizen
                        </Button>
                        <Button variant="ghost" className="justify-start h-10 w-full text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all">
                            <Hash size={14} className="mr-2 opacity-70" /> View Previous Cases
                        </Button>
                    </div>
                </div>

                {/* Last Interaction */}
                <div className="text-center pt-4 border-t border-border/10">
                    <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-semibold">
                        Last Interaction
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                        {commenter.lastInteraction ? new Date(commenter.lastInteraction).toLocaleDateString(undefined, {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        }) : 'N/A'}
                    </p>
                </div>
            </div>
        </ScrollArea>
    );
}
