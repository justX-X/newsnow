interface RSS2JSONResponse {
  status: string
  feed: {
    title: string
    description: string
    url: string
  }
  items: Array<{
    title: string
    pubDate: string
    link: string
    guid: string
    author?: string
    thumbnail?: string
    description?: string
    content?: string
    categories?: string[]
  }>
}

const blockbeats = defineSource(async () => {
  const rssUrl = "https://api.theblockbeats.news/v2/rss/newsflash"
  const res: RSS2JSONResponse = await myFetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
  )

  return res.items
    .slice(0, 30)
    .map((item, index) => ({
      id: `blockbeats-${item.guid || index}`,
      title: item.title,
      url: item.link,
      extra: {
        date: new Date(item.pubDate).getTime(),
        info: "律动BlockBeats",
        hover: item.description?.replace(/<[^>]*>/g, "") || item.title,
      },
    }))
})

export default defineSource({
  "blockbeats": blockbeats,
  "blockbeats-flash": blockbeats,
})
