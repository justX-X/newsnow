interface SpaceflightArticle {
  id: number
  title: string
  url: string
  news_site: string
  summary: string
  published_at: string
  updated_at: string
  featured: boolean
  launches?: Array<{
    id: string
    provider: string
  }>
  events?: Array<{
    id: string
    provider: string
  }>
}

interface SpaceflightResponse {
  count: number
  next: string | null
  previous: string | null
  results: SpaceflightArticle[]
}

const general = defineSource(async () => {
  const res: SpaceflightResponse = await myFetch(
    "https://api.spaceflightnewsapi.net/v4/articles/?limit=20&ordering=-published_at"
  )

  return res.results.map((item) => ({
    id: `spaceflight-${item.id}`,
    title: item.title,
    url: item.url,
    extra: {
      date: new Date(item.published_at).getTime(),
      info: item.news_site,
      hover: item.summary || item.title,
    },
  }))
})

const spacex = defineSource(async () => {
  const res: SpaceflightResponse = await myFetch(
    "https://api.spaceflightnewsapi.net/v4/articles/?summary_contains=SpaceX&limit=15&ordering=-published_at"
  )

  return res.results.map((item) => ({
    id: `spaceflight-spacex-${item.id}`,
    title: item.title,
    url: item.url,
    extra: {
      date: new Date(item.published_at).getTime(),
      info: `${item.news_site} | SpaceX`,
      hover: item.summary || item.title,
    },
  }))
})

const nasa = defineSource(async () => {
  const res: SpaceflightResponse = await myFetch(
    "https://api.spaceflightnewsapi.net/v4/articles/?news_site=NASA&limit=15&ordering=-published_at"
  )

  return res.results.map((item) => ({
    id: `spaceflight-nasa-${item.id}`,
    title: item.title,
    url: item.url,
    extra: {
      date: new Date(item.published_at).getTime(),
      info: "NASA",
      hover: item.summary || item.title,
    },
  }))
})

const artemis = defineSource(async () => {
  const res: SpaceflightResponse = await myFetch(
    "https://api.spaceflightnewsapi.net/v4/articles/?summary_contains=Artemis&limit=10&ordering=-published_at"
  )

  return res.results.map((item) => ({
    id: `spaceflight-artemis-${item.id}`,
    title: item.title,
    url: item.url,
    extra: {
      date: new Date(item.published_at).getTime(),
      info: `${item.news_site} | Artemis`,
      hover: item.summary || item.title,
    },
  }))
})

export default defineSource({
  "spaceflight": general,
  "spaceflight-general": general,
  "spaceflight-spacex": spacex,
  "spaceflight-nasa": nasa,
  "spaceflight-artemis": artemis,
})
