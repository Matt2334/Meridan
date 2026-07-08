export const cacheKeys = {
  sessions: (userId: string, page: number) => `sessions:${userId}:page:${page}`,
  sessionsAll: (userId: string) => `sessions:${userId}:*`,
  profile:  (userId: string) => `profile:${userId}`,
  bookmarks: (userId: string, page: number) => `bookmarks:${userId}:page:${page}`,
  bookmarksAll: (userId: string) => `bookmarks:${userId}:*`,
}