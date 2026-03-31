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

const seekingAlpha = defineSource(async () => {
  const rssUrl = "https://seekingalpha.com/feed"
  const res: RSS2JSONResponse = await myFetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
  )

  return res.items
    .slice(0, 30)
    .map((item, index) => ({
      id: `seeking-alpha-${item.guid || index}`,
      title: item.title,
      url: item.link,
      extra: {
        date: new Date(item.pubDate).getTime(),
        info: "Seeking Alpha",
        hover: item.description?.replace(/<[^>]*>/g, "") || item.title,
      },
    }))
})

const benzinga = defineSource(async () => {
  const rssUrl = "https://www.benzinga.com/feed"
  const res: RSS2JSONResponse = await myFetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
  )

  return res.items
    .slice(0, 30)
    .map((item, index) => ({
      id: `benzinga-${item.guid || index}`,
      title: item.title,
      url: item.link,
      extra: {
        date: new Date(item.pubDate).getTime(),
        info: "Benzinga",
        hover: item.description?.replace(/<[^>]*>/g, "") || item.title,
      },
    }))
})

const techmeme = defineSource(async () => {
  const rssUrl = "https://techmeme.com/feed.xml"
  const res: RSS2JSONResponse = await myFetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
  )

  return res.items
    .slice(0, 30)
    .map((item, index) => ({
      id: `techmeme-${item.guid || index}`,
      title: item.title,
      url: item.link,
      extra: {
        date: new Date(item.pubDate).getTime(),
        info: "Techmeme",
        hover: item.description?.replace(/<[^>]*>/g, "") || item.title,
      },
    }))
})

export default defineSource({
  "seeking-alpha": seekingAlpha,
  "benzinga": benzinga,
  "techmeme": techmeme,
})
