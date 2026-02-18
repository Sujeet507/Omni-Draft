"use client";

import { useState, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_POSTS, MOCK_COMMENTS, Platform, Comment } from '@/lib/data';
import PlatformNav from '@/components/PlatformNav';
import ChatPanel from '@/components/ChatPanel';
import CommenterMetadata from '@/components/CommenterMetadata';
import { CheckCircle2, ChevronLeft, Building2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type FilterType = 'All Comments' | 'Unread' | 'Replied' | 'Mentions' | 'Spam';

export default function PostDetailPage() {
    const params = useParams();
    const router = useRouter();
    const postId = params.postId as string;
    const post = MOCK_POSTS.find(p => p.id === postId);

    const [selectedPlatform, setSelectedPlatform] = useState<Platform>(() => {
        if (!post) return 'instagram';
        // Default to first platform with unread
        const firstUnread = post.platforms.find(p => post.stats[p].unreadCount > 0);
        return firstUnread || post.platforms[0];
    });

    const [currentFilter, setCurrentFilter] = useState<FilterType>('All Comments');

    const scrollPositions = useRef<Record<string, number>>({});
    const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

    // Local state for comments to support optimistic updates
    const [allComments, setAllComments] = useState<Record<string, Comment[]>>(() => ({ ...MOCK_COMMENTS }));

    const comments = useMemo(() => {
        if (!post) return [];
        const key = `${post.id}-${selectedPlatform}`;
        return allComments[key] || [];
    }, [post, selectedPlatform, allComments]);

    const counts = useMemo(() => {
        return {
            'All Comments': comments.length,
            'Unread': comments.filter(c => c.isUnread).length,
            'Replied': comments.filter(c => c.isReplied).length,
            'Mentions': comments.filter(c => c.isMention).length,
            'Spam': comments.filter(c => c.isSpam).length,
        };
    }, [comments]);

    const handleReply = (text: string) => {
        if (!post) return;

        const newComment: Comment = {
            id: `new-${Date.now()}`,
            postId: post.id,
            platform: selectedPlatform,
            author: {
                id: 'current-user',
                name: 'Dept. of Housing',
                avatar: 'https://github.com/shadcn.png', // Mock avatar
                handle: 'housing_dept',
                platform: selectedPlatform
            },
            content: text,
            timestamp: new Date().toISOString(),
            likes: 0,
            replies: [],
            isUnread: false // Self comment read
        };

        const key = `${post.id}-${selectedPlatform}`;

        setAllComments(prev => ({
            ...prev,
            [key]: [...(prev[key] || []), newComment]
        }));
    };

    if (!post) {
        return (
            <div className="h-screen flex items-center justify-center bg-background text-center">
                <div className="max-w-md space-y-4">
                    <h1 className="text-3xl font-bold tracking-tight">Post Not Found</h1>
                    <p className="text-muted-foreground">The post you are looking for does not exist or has been removed.</p>
                    <Button onClick={() => router.push('/')}>
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    // Sort comments (unread first, then date)
    const sortedComments = [...comments].sort((a, b) => {
        if (a.isUnread && !b.isUnread) return -1;
        if (!a.isUnread && b.isUnread) return 1;
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    const filteredComments = sortedComments.filter(c => {
        if (currentFilter === 'Unread') return c.isUnread;
        if (currentFilter === 'Replied') return c.isReplied;
        if (currentFilter === 'Mentions') return c.isMention;
        if (currentFilter === 'Spam') return c.isSpam;
        return true;
    });

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background font-sans">
            {/* Top Navigation Bar - Clean, no borders */}
            <header className="h-14 shrink-0 bg-background/80 backdrop-blur z-30 flex items-center justify-between px-4 border-b border-border/40 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 hover:bg-secondary/80 text-muted-foreground">
                        <ChevronLeft size={18} />
                    </Button>

                    <div className="h-6 w-px bg-border/40 hidden sm:block" />

                    {/* Channel Indicator - Now prominent */}
                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-sm">
                            <Image
                                src={post.thumbnail}
                                alt="Thumbnail"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="hidden sm:flex flex-col">
                            <h1 className="font-semibold text-sm max-w-[200px] truncate leading-tight text-foreground">
                                {post.caption}
                            </h1>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Badge variant="secondary" className="h-4 px-1 rounded-[4px] text-[9px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary/50">
                                    <Building2 size={8} className="mr-1" /> Housing Dept
                                </Badge>
                                <span className="text-[10px] text-muted-foreground font-medium">
                                    Posted {new Date(post.publishDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-emerald-500/20 text-emerald-600 bg-emerald-500/5 hidden sm:flex gap-1.5 h-7 px-2.5">
                        <CheckCircle2 size={12} /> Live Sync
                    </Badge>
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-md ml-2 hover:opacity-90 transition-opacity cursor-pointer">
                        DH
                    </div>
                </div>
            </header>

            {/* Main Content Layout */}
            <div className="flex flex-1 overflow-hidden">

                {/* Left Sidebar - Filters / Navigation - Cleaner */}
                <aside className="w-64 bg-secondary/20 hidden md:flex flex-col pt-6 pb-4 px-3 gap-6 shrink-0 border-r border-border/10">
                    <div>
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-3 mb-3 opacity-70">Filters</h3>
                        <nav className="space-y-1">
                            {(['All Comments', 'Unread', 'Replied', 'Mentions', 'Spam'] as FilterType[]).map((filter) => (
                                <Button
                                    key={filter}
                                    variant={currentFilter === filter ? "secondary" : "ghost"}
                                    onClick={() => setCurrentFilter(filter)}
                                    className={cn(
                                        "w-full justify-between h-9 text-sm font-medium transition-all hover:translate-x-1 cursor-pointer",
                                        currentFilter === filter ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                                    )}
                                >
                                    {filter}
                                    {counts[filter] > 0 && (
                                        <Badge variant={filter === 'Unread' || filter === 'Spam' ? "destructive" : "secondary"} className={cn("h-5 px-1.5 text-[10px] rounded-full shadow-sm", filter !== 'Unread' && filter !== 'Spam' && "bg-secondary text-foreground")}>
                                            {counts[filter]}
                                        </Badge>
                                    )}
                                </Button>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-auto">
                        <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/10">
                            <h4 className="font-semibold text-blue-600 text-sm mb-1 flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                Weekly Brief
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Citizen engagement up <strong>15%</strong>. Prioritize housing queries today.
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Center Panel - Platform Comments - No borders */}
                <main className="flex-1 flex flex-col min-w-0 bg-background relative z-10 shadow-xl shadow-black/5">
                    <PlatformNav
                        platforms={post.platforms}
                        stats={post.stats}
                        selectedPlatform={selectedPlatform}
                        onSelectPlatform={(p) => {
                            setSelectedPlatform(p);
                            setCurrentFilter('All Comments'); // Reset filter on platform switch
                        }}
                    />

                    <div className="flex-1 overflow-hidden relative">
                        <ChatPanel
                            comments={filteredComments}
                            platform={selectedPlatform}
                            onCommentClick={setSelectedComment}
                            activeCommentId={selectedComment?.id || null}
                            initialScrollTop={scrollPositions.current[selectedPlatform] || 0}
                            onScroll={(scrollTop) => {
                                scrollPositions.current[selectedPlatform] = scrollTop;
                            }}
                            onReply={handleReply}
                        />
                    </div>
                </main>

                {/* Right Sidebar - Commenter Metadata - No borders */}
                <aside className={`w-80 bg-background shrink-0 hidden lg:block overflow-hidden transition-all duration-300 ease-in-out border-l border-border/40 shadow-[-5px_0_30px_-10px_rgba(0,0,0,0.05)]`}>
                    <CommenterMetadata commenter={selectedComment?.author || null} />
                </aside>

            </div>
        </div>
    );
}
