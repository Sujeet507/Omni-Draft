import { Post } from '@/lib/data';
import Image from 'next/image';
import { Instagram, Facebook, Twitter, Linkedin, MessageCircle, Calendar } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const PlatformIcon = ({ platform, unreadCount }: { platform: string, unreadCount: number }) => {
    let Icon = Twitter;
    let color = 'text-muted-foreground';
    let bg = 'bg-secondary/20';

    if (platform === 'instagram') { Icon = Instagram; color = 'text-pink-600'; bg = 'bg-pink-500/10'; }
    if (platform === 'facebook') { Icon = Facebook; color = 'text-blue-600'; bg = 'bg-blue-600/10'; }
    if (platform === 'twitter') { Icon = Twitter; color = 'text-sky-500'; bg = 'bg-sky-400/10'; }
    if (platform === 'linkedin') { Icon = Linkedin; color = 'text-blue-700'; bg = 'bg-blue-700/10'; }

    return (
        <div className="relative group">
            <div className={cn("p-1 rounded-full transition-all hover:bg-secondary", bg)}>
                <Icon className={cn("w-3 h-3", color)} />
            </div>
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c2272d] text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full shadow-sm ring-1 ring-white">
                    {unreadCount}
                </span>
            )}
        </div>
    );
};

export default function PostCard({ post }: { post: Post }) {
    const date = new Date(post.publishDate).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric'
    });

    return (
        <Link href={`/brand/${post.brandId}/post/${post.id}`} className="block h-full group focus:outline-none rounded-xl cursor-pointer">
            <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white overflow-hidden rounded-xl flex flex-col hover:-translate-y-1 ring-1 ring-black/5 py-0 gap-1">
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                    <Image
                        src={post.thumbnail}
                        alt="Post thumbnail"
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/20 to-transparent" />

                    {post.totalUnread > 0 && (
                        <Badge className="absolute top-2 right-2 border-0 shadow-sm h-5 px-1.5 text-[9px] bg-[#c2272d] hover:bg-[#a01f24] text-white font-semibold tracking-wide">
                            {post.totalUnread} NEW
                        </Badge>
                    )}
                </div>

                <CardContent className="p-3 flex flex-col justify-between flex-1 gap-2">
                    <p className="font-semibold text-sm line-clamp-2 leading-snug text-slate-800 group-hover:text-[#c2272d] transition-colors">
                        {post.caption}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-1">
                        <div className="flex items-center gap-3 text-[10px] font-medium text-slate-500">
                            <div className="flex items-center gap-1">
                                <Calendar size={11} className="text-[#c2272d]" /> {date}
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageCircle size={11} className="text-slate-400" />
                                <span>{post.totalComments}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            {post.platforms.map(p => (
                                <PlatformIcon key={p} platform={p} unreadCount={post.stats[p]?.unreadCount || 0} />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
