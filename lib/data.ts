export type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin';

export interface Commenter {
    id: string;
    name: string;
    avatar: string; // URL
    handle: string;
    bio?: string;
    sentimentScore?: number; // 0-100
    totalCommentsOnPost?: number;
    totalCommentsBrand?: number;
    lastInteraction?: string;
    platform?: Platform;
}

export interface Comment {
    id: string;
    postId: string;
    platform: Platform;
    author: Commenter;
    content: string;
    timestamp: string;
    likes: number;
    replies?: Comment[];
    isUnread?: boolean;
    isReplied?: boolean;
    isMention?: boolean;
    isSpam?: boolean;
}

export interface PlatformStats {
    platform: Platform;
    unreadCount: number;
    totalComments: number;
    lastActivity?: string;
}

export interface Post {
    id: string;
    brandId: string;
    thumbnail: string; // URL
    caption: string;
    publishDate: string;
    platforms: Platform[];
    stats: Record<Platform, PlatformStats>;
    totalUnread: number;
    totalComments: number;
}

export const MOCK_POSTS: Post[] = [
    {
        id: 'p1',
        brandId: 'b1',
        thumbnail: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&w=300&q=80',
        caption: 'Launching our new summer collection! ☀️ #summer #fashion',
        publishDate: '2023-06-15T10:00:00Z',
        platforms: ['instagram', 'facebook', 'twitter'],
        stats: {
            instagram: { platform: 'instagram', unreadCount: 4, totalComments: 5 },
            facebook: { platform: 'facebook', unreadCount: 1, totalComments: 1 },
            twitter: { platform: 'twitter', unreadCount: 0, totalComments: 0 },
            linkedin: { platform: 'linkedin', unreadCount: 0, totalComments: 0 }
        },
        totalUnread: 5,
        totalComments: 6,
    },
    {
        id: 'p2',
        brandId: 'b1',
        thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80',
        caption: 'Behind the scenes at our latest photoshoot 📸',
        publishDate: '2023-06-10T14:30:00Z',
        platforms: ['instagram', 'linkedin'],
        stats: {
            instagram: { platform: 'instagram', unreadCount: 0, totalComments: 8 },
            facebook: { platform: 'facebook', unreadCount: 0, totalComments: 0 },
            twitter: { platform: 'twitter', unreadCount: 0, totalComments: 0 },
            linkedin: { platform: 'linkedin', unreadCount: 2, totalComments: 4 }
        },
        totalUnread: 2,
        totalComments: 12,
    },
    {
        id: 'p3',
        brandId: 'b1',
        thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80',
        caption: 'Black Friday Sale starts NOW! 🛍️',
        publishDate: '2023-11-24T00:00:00Z',
        platforms: ['instagram', 'facebook', 'twitter', 'linkedin'],
        stats: {
            instagram: { platform: 'instagram', unreadCount: 15, totalComments: 45 },
            facebook: { platform: 'facebook', unreadCount: 8, totalComments: 20 },
            twitter: { platform: 'twitter', unreadCount: 5, totalComments: 10 },
            linkedin: { platform: 'linkedin', unreadCount: 2, totalComments: 5 }
        },
        totalUnread: 30,
        totalComments: 80,
    }
];

export const MOCK_COMMENTS: Record<string, Comment[]> = {
    'p1-instagram': [
        {
            id: 'c1',
            postId: 'p1',
            platform: 'instagram',
            author: {
                id: 'u1',
                name: 'Alice Johnson',
                handle: '@alice.j',
                avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
                bio: 'Fashion enthusiast | Traveler',
                sentimentScore: 85,
                totalCommentsOnPost: 1,
                totalCommentsBrand: 5,
                lastInteraction: '2023-06-15T12:00:00Z',
                platform: 'instagram'
            },
            content: 'Love this look! Where can I get the dress?',
            timestamp: '2023-06-15T10:05:00Z',
            likes: 12,
            isUnread: true,
            replies: []
        },
        {
            id: 'c2',
            postId: 'p1',
            platform: 'instagram',
            author: {
                id: 'u2',
                name: 'Bob Smith',
                handle: '@bob_builder',
                avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
                sentimentScore: 60,
                totalCommentsOnPost: 2,
                totalCommentsBrand: 2,
                lastInteraction: '2023-06-15T12:30:00Z',
                platform: 'instagram'
            },
            content: 'Is this available in blue?',
            timestamp: '2023-06-15T11:20:00Z',
            likes: 3,
            isUnread: true,
            replies: []
        },
        {
            id: 'c3',
            postId: 'p1',
            platform: 'instagram',
            author: {
                id: 'u4',
                name: 'Sarah Parker',
                handle: '@sarah_p',
                avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
                sentimentScore: 92,
                totalCommentsOnPost: 1,
                totalCommentsBrand: 15,
                platform: 'instagram'
            },
            content: 'This is absolutely stunning! 😍',
            timestamp: '2023-06-15T11:25:00Z',
            likes: 8,
            isUnread: true,
            isMention: true,
            replies: []
        },
        {
            id: 'c4',
            postId: 'p1',
            platform: 'instagram',
            author: {
                id: 'u5',
                name: 'Mike Ross',
                handle: '@mike_suits',
                avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705g',
                sentimentScore: 40,
                totalCommentsOnPost: 1,
                totalCommentsBrand: 0,
                platform: 'instagram'
            },
            content: 'Thanks for the quick reply on my DM!',
            timestamp: '2023-06-15T09:00:00Z',
            likes: 1,
            isUnread: false,
            isReplied: true,
            replies: [
                {
                    id: 'r1',
                    postId: 'p1',
                    platform: 'instagram',
                    author: {
                        id: 'brand',
                        name: 'Housing Dept',
                        handle: '@housing',
                        avatar: '',
                        platform: 'instagram'
                    },
                    content: 'Happy to help Mike!',
                    timestamp: '2023-06-15T09:10:00Z',
                    likes: 0
                }
            ]
        },
        {
            id: 'c5',
            postId: 'p1',
            platform: 'instagram',
            author: {
                id: 'u6',
                name: 'Crypto King',
                handle: '@crypto_101',
                avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705h',
                sentimentScore: 10,
                totalCommentsOnPost: 20,
                totalCommentsBrand: 0,
                platform: 'instagram'
            },
            content: 'DM ME FOR GREAT RETURNS 🚀🚀🚀',
            timestamp: '2023-06-16T10:00:00Z',
            likes: 0,
            isSpam: true,
            isUnread: true,
            replies: []
        }
    ],
    'p1-facebook': [
        {
            id: 'c3-fb',
            postId: 'p1',
            platform: 'facebook',
            author: {
                id: 'u3',
                name: 'Carol White',
                handle: 'Carol White',
                avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
                sentimentScore: 90,
                totalCommentsOnPost: 1,
                totalCommentsBrand: 10,
                lastInteraction: '2023-06-15T12:25:00Z',
                platform: 'facebook'
            },
            content: 'Sharing this with my friends!',
            timestamp: '2023-06-15T12:00:00Z',
            likes: 5,
            isUnread: true,
            replies: []
        }
    ]
};
