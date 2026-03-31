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

const bloombergMarkets = defineSource(async () => {
  const rssUrl = "https://feeds.bloomberg.com/markets/news.rss"
  const res: RSS2JSONResponse = await myFetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
  )

  return res.items
    .slice(0, 20)
    .map((item, index) => ({
      id: `bloomberg-markets-${item.guid || index}`,
      title: item.title,
      url: item.link,
      extra: {
        date: new Date(item.pubDate).getTime(),
        info: "Bloomberg Markets",
        hover: item.description?.replace(/<[^>]*>/g, "") || item.title,
      },
    }))
})

const bloomberg = defineSource(async () => {
  const rssUrl = "https://feeds.bloomberg.com/markets/news.rss"
  const res: RSS2JSONResponse = await myFetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
  )

  return res.items
    .slice(0, 30)
    .map((item, index) => ({
      id: `bloomberg-${item.guid || index}`,
      title: item.title,
      url: item.link,
      extra: {
        date: new Date(item.pubDate).getTime(),
        info: "Bloomberg",
        hover: item.description?.replace(/<[^>]*>/g, "") || item.title,
      },
    }))
})

const reuters = defineSource(async () => {
  const rssUrl = "https://reutersbest.com/feed/"
  const res: RSS2JSONResponse = await myFetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
  )

  return res.items
    .slice(0, 30)
    .map((item, index) => ({
      id: `reuters-${item.guid || index}`,
      title: item.title,
      url: item.link,
      extra: {
        date: new Date(item.pubDate).getTime(),
        info: "Reuters Best",
        hover: item.description?.replace(/<[^>]*>/g, "") || item.title,
      },
    }))
})

const marketWatch = defineSource(async () => {
  const rssUrl = "https://feeds.content.dowjones.io/public/rss/mw_topstories"
  const res: RSS2JSONResponse = await myFetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
  )

  return res.items
    .slice(0, 20)
    .map((item, index) => ({
      id: `marketwatch-${item.guid || index}`,
      title: item.title,
      url: item.link,
      extra: {
        date: new Date(item.pubDate).getTime(),
        info: "MarketWatch",
        hover: item.description?.replace(/<[^>]*>/g, "") || item.title,
      },
    }))
})

const yahooPreMarket = defineSource(async () => {
  const rssUrl = "https://finance.yahoo.com/rss/pre-market"
  const res: RSS2JSONResponse = await myFetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
  )

  return res.items
    .slice(0, 20)
    .map((item, index) => ({
      id: `yahoo-premarket-${item.guid || index}`,
      title: item.title,
      url: item.link,
      extra: {
        date: new Date(item.pubDate).getTime(),
        info: "Yahoo Finance Pre-Market",
        hover: item.description?.replace(/<[^>]*>/g, "") || item.title,
      },
    }))
})

const yahooAfterHours = defineSource(async () => {
  const rssUrl = "https://finance.yahoo.com/rss/after-hours"
  const res: RSS2JSONResponse = await myFetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
  )

  return res.items
    .slice(0, 20)
    .map((item, index) => ({
      id: `yahoo-afterhours-${item.guid || index}`,
      title: item.title,
      url: item.link,
      extra: {
        date: new Date(item.pubDate).getTime(),
        info: "Yahoo Finance After Hours",
        hover: item.description?.replace(/<[^>]*>/g, "") || item.title,
      },
    }))
})

export default defineSource({
  "bloomberg": bloomberg,
  "bloomberg-markets": bloombergMarkets,
  "reuters": reuters,
  "marketwatch": marketWatch,
  "yahoo-finance-premarket": yahooPreMarket,
  "yahoo-finance-afterhours": yahooAfterHours,
})
