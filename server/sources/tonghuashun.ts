import { Buffer } from "node:buffer"
import iconv from "iconv-lite"
import { parseRelativeDate } from "../utils/date"

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

  // 使用原生 fetch 获取 ArrayBuffer
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    },
  })

  const arrayBuffer = await response.arrayBuffer()
  const rawData = iconv.decode(Buffer.from(arrayBuffer), "gbk")

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
