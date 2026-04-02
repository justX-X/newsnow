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

const cnbc = defineSource(async () => {
  const rssUrl = "https://www.cnbc.com/id/10000664/device/rss/rss.html"
  const res: RSS2JSONResponse = await myFetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
  )

  return res.items
    .slice(0, 20)
    .map((item, index) => ({
      id: `cnbc-${item.guid || index}`,
      title: item.title,
      url: item.link,
      extra: {
        date: new Date(item.pubDate).getTime(),
        info: "CNBC",
        hover: item.description?.replace(/<[^>]*>/g, "") || item.title,
      },
    }))
})

const yahooFinance = defineSource(async () => {
  const rssUrl = "https://finance.yahoo.com/news/rssindex"
  const res: RSS2JSONResponse = await myFetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
  )

  return res.items
    .slice(0, 20)
    .map((item, index) => ({
      id: `yahoo-finance-${item.guid || index}`,
      title: item.title,
      url: item.link,
      extra: {
        date: new Date(item.pubDate).getTime(),
        info: "Yahoo Finance",
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

const zeroHedge = defineSource(async () => {
  const rssUrl = "https://www.zerohedge.com/rss.xml"
  const res: RSS2JSONResponse = await myFetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
  )

  return res.items
    .slice(0, 20)
    .map((item, index) => ({
      id: `zerohedge-${item.guid || index}`,
      title: item.title,
      url: item.link,
      extra: {
        date: new Date(item.pubDate).getTime(),
        info: "ZeroHedge",
        hover: item.description?.replace(/<[^>]*>/g, "") || item.title,
      },
    }))
})

export default defineSource({
  "cnbc": cnbc,
  "cnbc-finance": cnbc,
  "yahoo-finance": yahooFinance,
  "marketwatch": marketWatch,
  "zerohedge": zeroHedge,
})
