import * as cheerio from "cheerio"

const quick = defineSource(async () => {
  try {
    const url = "https://roll.eastmoney.com/finance_122.html"
    const html = await myFetch(url, { responseType: "text" })

    if (!html) {
      console.log("东方财富页面内容为空")
      return []
    }

    const $ = cheerio.load(html)
    const items: any[] = []

    // 查找新闻列表项
    const $listItems = $('ul li')

    $listItems.each((_, element) => {
      const $el = $(element)

      // 提取时间
      const timeText = $el.find('.timestamp, .news-date, span').first().text().trim()

      // 提取分类标签和标题链接
      const $titleLink = $el.find('a').first()
      const title = $titleLink.text().trim().replace(/^\[.*?\]\s*/, '') // 移除分类标签
      const link = $titleLink.attr('href')

      // 过滤有效内容 - 排除导航链接、分页等
      if (title && title.length > 5 && title.length < 200 && link) {
        items.push({
          id: `eastmoney-${Date.now()}-${items.length}`,
          title,
          url: link.startsWith('http') ? link : `https:${link}`,
          timeText
        })
      }
    })

    if (items.length > 0) {
      console.log(`东方财富找到 ${items.length} 条新闻`)
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

    console.log("东方财富未找到有效新闻")
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
