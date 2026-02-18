import { useState, useRef, useEffect, type UIEvent } from 'react';
import { Comment, Platform } from '@/lib/data';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { formatDistanceToNow, format } from 'date-fns';
import { MoreHorizontal, Reply, Heart, Send, CheckCheck, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface ChatPanelProps {
    comments: Comment[];
    platform: Platform;
    onCommentClick: (comment: Comment) => void;
    activeCommentId: string | null;
    initialScrollTop?: number;
    onScroll?: (scrollTop: number) => void;
    onReply: (text: string) => void;
}

const CommentItem = ({
    comment,
    platform,
    level = 0,
    onCommentClick,
    activeCommentId
}: {
    comment: Comment;
    platform: Platform;
    level?: number;
    onCommentClick: (c: Comment) => void;
    activeCommentId: string | null;
}) => {
    const isActive = activeCommentId === comment.id;
    const isOwner = comment.author.id === 'current-user-id'; // robust check needed later

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn("flex flex-col gap-2 relative group", level > 0 && "ml-12 border-l-2 border-border pl-4")}
        >

            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onCommentClick(comment);
                }}
                className={cn(
                    "flex gap-4 p-4 rounded-xl transition-all cursor-pointer relative border",
                    isActive
                        ? "bg-muted/50 border-primary/20 shadow-sm"
                        : "hover:bg-muted/30 border-transparent hover:border-border"
                )}
            >
                <div className="relative shrink-0">
                    <Avatar className="w-10 h-10 border border-border">
                        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    {platform === 'instagram' && (
                        <div className="absolute -bottom-1 -right-1 bg-linear-to-tr from-yellow-400 to-purple-600 rounded-full p-[2px] border-2 border-background">
                            <div className="w-1.5 h-1.5 bg-transparent" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-foreground truncate">
                                {comment.author.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                            </span>
                        </div>
                        {comment.isUnread && (
                            <Badge variant="default" className="h-5 px-1.5 text-[10px] uppercase font-bold tracking-wider">
                                New
                            </Badge>
                        )}
                    </div>

                    <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word text-card-foreground">
                        {comment.content}
                    </p>

                    <div className="mt-3 flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                            <Heart size={14} className="mr-1.5" /> {comment.likes}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCommentClick(comment);
                                // Optional: focus input?
                            }}
                            className="h-6 px-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10"
                        >
                            <Reply size={14} className="mr-1.5" /> Reply
                        </Button>
                    </div>
                </div>
            </div>

            {/* Render Replies Recursively */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            platform={platform}
                            level={level + 1}
                            onCommentClick={onCommentClick}
                            activeCommentId={activeCommentId}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default function ChatPanel({ comments, platform, onCommentClick, activeCommentId, initialScrollTop = 0, onScroll, onReply }: ChatPanelProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = initialScrollTop;
        }
    }, [platform]); // When platform changes, restore scroll

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        if (onScroll) {
            onScroll(e.currentTarget.scrollTop);
        }
    };

    const handleSend = () => {
        if (!replyText.trim()) return;
        onReply(replyText);
        setReplyText('');
        // Scroll to bottom ideally
        if (scrollContainerRef.current) {
            const scrollHeight = scrollContainerRef.current.scrollHeight;
            scrollContainerRef.current.scrollTo({ top: scrollHeight, behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col h-full relative bg-background/50">
            {/* Comments Feed */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
            >
                {comments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 select-none animate-in fade-in duration-500">
                        <div className="bg-muted p-6 rounded-full mb-6">
                            <CheckCheck size={48} className="text-muted-foreground/50" />
                        </div>
                        <p className="text-lg font-medium">All caught up!</p>
                        <p className="text-sm">No comments on this platform yet.</p>
                    </div>
                ) : (
                    <AnimatePresence mode='popLayout'>
                        {comments.map(comment => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                platform={platform}
                                onCommentClick={onCommentClick}
                                activeCommentId={activeCommentId}
                            />
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky bottom-0 z-10 w-full animate-in slide-in-from-bottom duration-500">
                {activeCommentId && (
                    <div className="flex items-center justify-between mb-2 px-2 animate-in slide-in-from-bottom-2">
                        <span className="text-xs text-muted-foreground">
                            Replying to comment...
                        </span>
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => onCommentClick({} as any)}>
                            <span className="sr-only">Cancel</span>
                            &times;
                        </Button>
                    </div>
                )}
                <div className="relative flex items-end gap-2 bg-muted/50 p-2 rounded-xl ring-1 ring-border focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10 text-muted-foreground hover:text-primary">
                        <Smile size={20} />
                    </Button>

                    <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Reply as Brand Name on ${platform}...`}
                        className="min-h-[44px] max-h-32 w-full resize-none border-0 bg-transparent py-3 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
                        rows={1}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />

                    <Button
                        onClick={handleSend}
                        disabled={!replyText.trim()}
                        size="icon"
                        className={cn("shrink-0 h-10 w-10 transition-all", replyText.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground hover:bg-muted/80")}
                    >
                        <Send size={18} className={cn(replyText.trim() && "ml-0.5")} />
                    </Button>
                </div>

                <div className="flex items-center justify-between px-2 mt-2">
                    <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Real-time sync active
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                        Press Enter to send
                    </span>
                </div>
            </div>
        </div>
    );
}
