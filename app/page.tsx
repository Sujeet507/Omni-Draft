"use client";

import { MOCK_POSTS } from '@/lib/data';
import PostCard from '@/components/PostCard';
import { Filter, Calendar, Zap, Search, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-muted/20 font-sans text-foreground pb-20 selection:bg-primary/10">

      {/* Header & Filters - Frosted, borderless feel */}
      <div className="bg-background/80 sticky top-0 z-20 backdrop-blur-xl supports-backdrop-filter:bg-background/60 shadow-sm border-b border-border/10">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#c2272d]">
                Omni Comments
              </h1>
              <p className="text-muted-foreground text-sm mt-1.5 font-medium opacity-80">
                Unified citizen engagement across all department channels.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="secondary" className="hidden sm:flex h-9 text-xs font-semibold shadow-sm bg-background hover:bg-muted transition-all">
                <Calendar size={14} className="mr-2 opacity-70" /> This Month
              </Button>
              <Button className="h-9 text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                <Zap size={14} className="mr-2" fill="currentColor" /> Quick Action
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-xs group">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                type="search"
                placeholder="Search agency posts..."
                className="pl-9 h-10 bg-secondary/30 border-transparent focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:bg-background transition-all rounded-xl"
              />
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              <Tabs defaultValue="all" className="w-auto">
                <TabsList className="h-10 bg-secondary/30 rounded-xl p-1">
                  <TabsTrigger value="all" className="text-xs font-medium rounded-lg px-4 transition-all">All Posts</TabsTrigger>
                  <TabsTrigger value="unread" className="text-xs font-medium rounded-lg px-4 transition-all data-[state=active]:text-destructive">Priority</TabsTrigger>
                  <TabsTrigger value="scheduled" className="text-xs font-medium rounded-lg px-4 transition-all">Scheduled</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="h-4 w-px bg-border/20 hidden sm:block" />

              <div className="flex bg-secondary/30 p-1 rounded-lg">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md bg-background shadow-sm text-foreground hover:bg-background">
                  <LayoutGrid size={14} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-muted-foreground hover:bg-background/50 hover:text-foreground">
                  <List size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Grid - Spacious, clean */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {MOCK_POSTS.map((post, i) => (
            <div key={post.id} className="h-full" style={{ animationDelay: `${i * 100}ms` }}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
