interface HNItem {
  id: number
  title: string
  url?: string
  score?: number
  by?: string
  time?: number
  descendants?: number
}

interface HNStory {
  id: number
  title: string
  url: string
  score: number
  author: string
  time: number
  comments: number
}

const hn = defineSource(async () => {
  // 获取热门故事ID列表
  const storyIds: number[] = await myFetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  )

  // 只获取前30个故事的详细信息
  const stories: HNStory[] = []
  const limit = Math.min(storyIds.length, 30)

  for (let i = 0; i < limit; i++) {
    try {
      const item: HNItem = await myFetch(
        `https://hacker-news.firebaseio.com/v0/item/${storyIds[i]}.json`
      )

      if (item && item.title) {
        stories.push({
          id: item.id,
          title: item.title,
          url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
          score: item.score || 0,
          author: item.by || "unknown",
          time: item.time || 0,
          comments: item.descendants || 0,
        })
      }
    } catch (error) {
      console.error(`Error fetching Hacker News item ${storyIds[i]}:`, error)
    }
  }

  return stories.map((story) => ({
    id: `hackernews-${story.id}`,
    title: story.title,
    url: story.url,
    extra: {
      date: story.time * 1000, // 转换为毫秒
      info: `▲ ${story.score} 💬 ${story.comments} 👤 ${story.author}`,
      hover: `Hacker News热门帖子 - ${story.author}`,
    },
  }))
})

const hnNew = defineSource(async () => {
  // 获取最新故事ID列表
  const storyIds: number[] = await myFetch(
    "https://hacker-news.firebaseio.com/v0/newstories.json"
  )

  const stories: HNStory[] = []
  const limit = Math.min(storyIds.length, 30)

  for (let i = 0; i < limit; i++) {
    try {
      const item: HNItem = await myFetch(
        `https://hacker-news.firebaseio.com/v0/item/${storyIds[i]}.json`
      )

      if (item && item.title) {
        stories.push({
          id: item.id,
          title: item.title,
          url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
          score: item.score || 0,
          author: item.by || "unknown",
          time: item.time || 0,
          comments: item.descendants || 0,
        })
      }
    } catch (error) {
      console.error(`Error fetching Hacker News item ${storyIds[i]}:`, error)
    }
  }

  return stories.map((story) => ({
    id: `hackernews-new-${story.id}`,
    title: story.title,
    url: story.url,
    extra: {
      date: story.time * 1000,
      info: `▲ ${story.score} 💬 ${story.comments} 👤 ${story.author}`,
      hover: `Hacker News最新帖子 - ${story.author}`,
    },
  }))
})

export default defineSource({
  "hackernews": hn,
  "hackernews-hot": hn,
  "hackernews-new": hnNew,
})
