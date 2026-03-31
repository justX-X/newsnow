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

const techCrunch = defineSource(async () => {
  const rssUrl = "https://techcrunch.com/feed/"
  const res: RSS2JSONResponse = await myFetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
  )

  return res.items
    .slice(0, 20)
    .map((item, index) => ({
      id: `techcrunch-${item.guid || index}`,
      title: item.title,
      url: item.link,
      extra: {
        date: new Date(item.pubDate).getTime(),
        info: "TechCrunch",
        hover: item.description?.replace(/<[^>]*>/g, "") || item.title,
      },
    }))
})

const theVerge = defineSource(async () => {
  const rssUrl = "https://www.theverge.com/rss/index.xml"
  const res: RSS2JSONResponse = await myFetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
  )

  return res.items
    .slice(0, 20)
    .map((item, index) => ({
      id: `theverge-${item.guid || index}`,
      title: item.title,
      url: item.link,
      extra: {
        date: new Date(item.pubDate).getTime(),
        info: "The Verge",
        hover: item.description?.replace(/<[^>]*>/g, "") || item.title,
      },
    }))
})

const arsTechnica = defineSource(async () => {
  const rssUrl = "https://feeds.arstechnica.com/arstechnica/index"
  const res: RSS2JSONResponse = await myFetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
  )

  return res.items
    .slice(0, 20)
    .map((item, index) => ({
      id: `arstechnica-${item.guid || index}`,
      title: item.title,
      url: item.link,
      extra: {
        date: new Date(item.pubDate).getTime(),
        info: "Ars Technica",
        hover: item.description?.replace(/<[^>]*>/g, "") || item.title,
      },
    }))
})

const wired = defineSource(async () => {
  const rssUrl = "https://www.wired.com/feed/rss"
  const res: RSS2JSONResponse = await myFetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
  )

  return res.items
    .slice(0, 20)
    .map((item, index) => ({
      id: `wired-${item.guid || index}`,
      title: item.title,
      url: item.link,
      extra: {
        date: new Date(item.pubDate).getTime(),
        info: "Wired",
        hover: item.description?.replace(/<[^>]*>/g, "") || item.title,
      },
    }))
})

const ventureBeat = defineSource(async () => {
  const rssUrl = "https://venturebeat.com/feed/"
  const res: RSS2JSONResponse = await myFetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
  )

  return res.items
    .slice(0, 20)
    .map((item, index) => ({
      id: `venturebeat-${item.guid || index}`,
      title: item.title,
      url: item.link,
      extra: {
        date: new Date(item.pubDate).getTime(),
        info: "VentureBeat",
        hover: item.description?.replace(/<[^>]*>/g, "") || item.title,
      },
    }))
})

export default defineSource({
  "techcrunch": techCrunch,
  "theverge": theVerge,
  "arstechnica": arsTechnica,
  "wired": wired,
  "venturebeat": ventureBeat,
})
