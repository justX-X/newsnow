const quick = defineSource(async () => {
  try {
    // 东方财富快讯API
    const url = "https://np-weblist.eastmoney.com/comm/web/getFastNewsList"
    const response = await myFetch(
      `${url}?client=web&biz=web_724&fastColumn=102&sortEnd=&pageSize=50&req_trace=${Date.now()}&_=${Date.now()}`
    )

    if (!response) {
      console.log("东方财富API返回空")
      return []
    }

    const data = response?.data?.list || response?.list || []

    if (!data.length) {
      console.log("东方财富未找到新闻")
      return []
    }

    console.log(`东方财富找到 ${data.length} 条新闻`)

    return data.map((item: any, index: number) => ({
      id: `eastmoney-${item.id || Date.now()}-${index}`,
      title: item.title || item.content || "",
      url: item.link || item.url || `https://kuaixun.eastmoney.com/`,
      extra: {
        date: item.showTime || item.time || item.ctime
          ? new Date(item.showTime || item.time || item.ctime).valueOf()
          : Date.now() - (index * 60000),
        hover: item.title || item.content || "",
        info: "东方财富",
      },
    }))
  } catch (error) {
    console.error("东方财富获取失败:", error)
    return []
  }
})

export default defineSource({
  "eastmoney": quick,
  "eastmoney-quick": quick,
})
