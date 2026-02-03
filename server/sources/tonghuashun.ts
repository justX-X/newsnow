import { Buffer } from "node:buffer"
import iconv from "iconv-lite"

interface TonghuashunItem {
  category: string
  clink: string
  seq: number
  implevel: string
  isvalid: string
  istop: string
  nature: string
  like: number
  title: string
  content: string
  url: string
  source: string
  author: string
  curl: string
  pubDate: string
  artpic: string
  stocks: string
  stockCode: string
  qrcodeUrl: string
}

interface TonghuashunRes {
  pubDate: string
  latestNewsSeq: string
  counter: string
  item: TonghuashunItem[]
}

const quick = defineSource(async () => {
  const url = "http://stock.10jqka.com.cn/thsgd/realtimenews.js"

  const response: ArrayBuffer = await myFetch(url, {
    responseType: "arrayBuffer",
  })

  const rawData = iconv.decode(Buffer.from(response), "gbk")

  const jsonMatch = rawData.match(/var\s+thsRss\s*=\s*(\{[\s\S]*?\});/)
  if (!jsonMatch) {
    return []
  }

  const jsonStr = jsonMatch[1]
  const data: TonghuashunRes = new Function(`return ${jsonStr}`)()

  return data.item.map((item) => {
    return {
      id: String(item.seq),
      title: item.title,
      url: item.url,
      extra: {
        date: parseRelativeDate(item.pubDate, "Asia/Shanghai").valueOf(),
        hover: item.content,
        info: item.source,
      },
    }
  })
})

export default defineSource({
  "tonghuashun": quick,
  "tonghuashun-quick": quick,
})
