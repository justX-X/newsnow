interface BlockBeatsResponse {
  status: number
  message: string
  data: {
    page: number
    data: Array<{
      id: number
      title: string
      content: string
      pic: string
      link: string
      url: string
      create_time: string
    }>
  }
}

const blockbeats = defineSource(async () => {
  const res: BlockBeatsResponse = await myFetch(
    "https://api.theblockbeats.news/v1/open-api/open-flash?page=1&size=30&lang=cn"
  )

  return res.data.data.map((item) => ({
    id: `blockbeats-${item.id}`,
    title: item.title,
    url: item.link || `https://www.theblockbeats.info/flash/${item.id}`,
    extra: {
      date: Number(item.create_time) * 1000,
      info: "律动BlockBeats",
      hover: item.content || item.title,
    },
  }))
})

export default defineSource({
  "blockbeats": blockbeats,
  "blockbeats-flash": blockbeats,
})
