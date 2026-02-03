const quick = defineSource(async () => {
  try {
    // 使用新的 API 接口
    const url = "https://np-anotice-stock.eastmoney.com/api/security/ann"
    const params = {
      sr: "-1",
      page_size: "30",
      page_index: "1",
      ann_type: "A",
      client_source: "web",
      f_node: "0",
      s_node: "0"
    }

    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")

    const apiUrl = `${url}?${queryString}`
    const res = await myFetch(apiUrl)

    if (!res?.data?.list || res.data.list.length === 0) {
      return []
    }

    return res.data.list.map((item: any) => {
      return {
        id: item.art_code || item.id,
        title: item.title,
        url: item.art_url || `https://www.eastmoney.com/a/${item.art_code}.html`,
        extra: {
          date: item.publish_time ? parseRelativeDate(item.publish_time, "Asia/Shanghai").valueOf() : Date.now(),
          hover: item.digest || item.summary || "",
          info: item.market_short_name || item.source || "东方财富",
        },
      }
    })
  } catch (error) {
    console.error("东方财富获取失败:", error)
    return []
  }
})

export default defineSource({
  "eastmoney": quick,
  "eastmoney-quick": quick,
})
