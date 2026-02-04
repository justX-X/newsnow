const quick = defineSource(async () => {
  try {
    // 尝试使用东方财富新闻中心的 API
    const url = "https://news.eastmoney.com/api/info/GetNewsInfoList"
    const params = {
      newsid: "0,90,93",
      code: "",
      t: String(Date.now())
    }

    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")

    const apiUrl = `${url}?${queryString}`
    const res = await myFetch(apiUrl)

    let list = null
    if (res?.newslist) {
      list = res.newslist
    } else if (res?.list) {
      list = res.list
    } else if (res?.data) {
      list = res.data
    } else if (Array.isArray(res)) {
      list = res
    }

    if (list && list.length > 0) {
      return list.map((item: any, index: number) => {
        return {
          id: item.newsid || item.id || `eastmoney-${Date.now()}-${index}`,
          title: item.title || item.news_title || "财经快讯",
          url: item.url || item.link || item.news_url || `https://news.eastmoney.com/a/${item.newsid || item.id || ''}.html`,
          extra: {
            date: item.date_time || item.time || item.createtime
              ? parseRelativeDate(item.date_time || item.time || item.createtime, "Asia/Shanghai").valueOf()
              : Date.now(),
            hover: item.digest || item.summary || item.content || item.description || "",
            info: item.source || item.market_short_name || "东方财富",
          },
        }
      })
    }

    console.log("东方财富 API 返回空数据")
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
