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

    const data = response?.data?.fastNewsList || []

    if (!data.length) {
      console.log("东方财富未找到新闻")
      return []
    }

    console.log(`东方财富快讯找到 ${data.length} 条新闻`)

    return data.map((item: any, index: number) => ({
      id: `eastmoney-${item.code || Date.now()}-${index}`,
      title: item.title || item.summary || "",
      url: `https://kuaixun.eastmoney.com/`,
      extra: {
        date: item.showTime
          ? new Date(item.showTime).valueOf()
          : Date.now() - (index * 60000),
        hover: item.summary || item.title || "",
        info: "东方财富",
      },
    }))
  } catch (error) {
    console.error("东方财富获取失败:", error)
    return []
  }
})

const focus = defineSource(async () => {
  try {
    // 东方财富焦点新闻API
    const url = "https://np-listapi.eastmoney.com/comm/web/getNewsByColumns"
    const response = await myFetch(
      `${url}?client=web&biz=web_news_col&column=370&order=1&needInteractData=0&page_index=1&page_size=20&req_trace=${Date.now()}&fields=code,showTime,title,mediaName,summary,image,url,uniqueUrl,Np_dst&types=1,20&_=${Date.now()}`
    )

    if (!response) {
      console.log("东方财富焦点API返回空")
      return []
    }

    const data = response?.data?.list || response?.list || []

    if (!data.length) {
      console.log("东方财富焦点未找到新闻")
      return []
    }

    console.log(`东方财富焦点找到 ${data.length} 条新闻`)

    return data.map((item: any, index: number) => ({
      id: `eastmoney-focus-${item.code || Date.now()}-${index}`,
      title: item.title || item.summary || "",
      url: item.url || item.uniqueUrl || `https://finance.eastmoney.com/`,
      extra: {
        date: item.showTime
          ? new Date(item.showTime).valueOf()
          : Date.now() - (index * 60000),
        hover: item.summary || item.title || "",
        info: `东方财富 · ${item.mediaName || ""}`,
      },
    }))
  } catch (error) {
    console.error("东方财富焦点获取失败:", error)
    return []
  }
})

export default defineSource({
  "eastmoney": quick,
  "eastmoney-quick": quick,
  "eastmoney-focus": focus,
})
