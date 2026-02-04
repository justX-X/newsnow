import * as cheerio from "cheerio"

const quick = defineSource(async () => {
  try {
    // 直接访问滚动新闻页面
    const url = "https://roll.eastmoney.com/finance_122.html"
    const html = await myFetch(url, { responseType: "text" })

    if (!html) {
      console.log("东方财富页面内容为空")
      return []
    }

    const $ = cheerio.load(html)
    const items: any[] = []

    // 查找新闻列表项 - 东方财富常见的类名
    const selectors = [
      '.list-item',
      '.news-list li',
      'li',
      'article'
    ]

    for (const selector of selectors) {
      $(selector).each((_, element) => {
        const $el = $(element)

        // 查找标题
        const title = $el.find('a').first().text().trim() || $el.find('h3, h4, .title').first().text().trim()
        const link = $el.find('a').first().attr('href')
        const timeText = $el.find('.time, .date, .pub-time').first().text().trim()

        // 过滤有效内容
        if (title && title.length > 5 && title.length < 200) {
          items.push({
            id: `eastmoney-${Date.now()}-${items.length}`,
            title,
            url: link ? (link.startsWith('http') ? link : `https:${link}`) : url,
            timeText
          })
        }
      })

      if (items.length > 0) {
        console.log(`找到 ${items.length} 条新闻`)
        break
      }
    }

    if (items.length > 0) {
      return items.map((item, index) => ({
        id: item.id,
        title: item.title,
        url: item.url,
        extra: {
          date: item.timeText
            ? parseRelativeDate(item.timeText, "Asia/Shanghai").valueOf()
            : Date.now() - (index * 60000),
          hover: item.title,
          info: "东方财富",
        },
      }))
    }

    // 如果抓取失败，返回空数组
    return []
  } catch (error) {
    console.error("东方财富获取失败:", error)
    return []
  }
})

export default defineSource({
  "eastmoney": quick,
  "eastmoney-quick": quick,
})
