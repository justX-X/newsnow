interface EastmoneyItem {
  id: string
  title: string
  content: string
  url: string
  source: string
  pubDate: string
  time: number
}

interface EastmoneyRes {
  result: {
    data: EastmoneyItem[]
  }
}

const quick = defineSource(async () => {
  const url = "https://kuaixun.eastmoney.com/api/kuaixun"
  const params = {
    type: "1",
    pageindex: "1",
    pagesize: "30"
  }
  
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&")
  
  const apiUrl = `${url}?${queryString}`
  const res: EastmoneyRes = await myFetch(apiUrl)
  
  return res.result.data.map((item) => {
    return {
      id: item.id,
      title: item.title,
      url: item.url,
      extra: {
        date: item.time,
        hover: item.content,
        info: item.source,
      },
    }
  })
})

export default defineSource({
  "eastmoney": quick,
  "eastmoney-quick": quick,
})
