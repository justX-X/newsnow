import process from "node:process"
import { Interval } from "./consts"
import { typeSafeObjectFromEntries } from "./type.util"
import type { OriginSource, Source, SourceID } from "./types"

const Time = {
  Test: 1,
  Realtime: 2 * 60 * 1000,
  Fast: 5 * 60 * 1000,
  Default: Interval, // 10min
  Common: 30 * 60 * 1000,
  Slow: 60 * 60 * 1000,
}

export const originSources = {
  "mktnews": {
    name: "MKTNews",
    column: "finance",
    home: "https://mktnews.net",
    color: "indigo",
    interval: Time.Realtime,
    sub: {
      flash: {
        title: "快讯",
      },
    },
  },
  "wallstreetcn": {
    name: "华尔街见闻",
    color: "blue",
    column: "finance",
    home: "https://wallstreetcn.com/",
    sub: {
      quick: {
        type: "realtime",
        interval: Time.Fast,
        title: "快讯",
      },
      news: {
        title: "最新",
        interval: Time.Common,
      },
      hot: {
        title: "最热",
        type: "hottest",
        interval: Time.Common,
      },
    },
  },
  "cls": {
    name: "财联社",
    color: "red",
    column: "finance",
    home: "https://www.cls.cn",
    sub: {
      telegraph: {
        title: "电报",
        interval: Time.Fast,
        type: "realtime",
      },
      depth: {
        title: "深度",
      },
      hot: {
        title: "热门",
        type: "hottest",
      },
    },
  },
  "xueqiu": {
    name: "雪球",
    color: "blue",
    home: "https://xueqiu.com",
    column: "finance",
    sub: {
      hotstock: {
        title: "热门股票",
        interval: Time.Realtime,
        type: "hottest",
      },
    },
  },
  "gelonghui": {
    name: "格隆汇",
    color: "blue",
    title: "事件",
    column: "finance",
    type: "realtime",
    interval: Time.Realtime,
    home: "https://www.gelonghui.com",
  },
  "fastbull": {
    name: "法布财经",
    color: "emerald",
    home: "https://www.fastbull.cn",
    column: "finance",
    sub: {
      express: {
        title: "快讯",
        type: "realtime",
        interval: Time.Realtime,
      },
      news: {
        title: "头条",
        interval: Time.Common,
      },
    },
  },
  "jin10": {
    name: "金十数据",
    column: "finance",
    color: "blue",
    type: "realtime",
    home: "https://www.jin10.com",
  },
  "tonghuashun": {
    name: "同花顺财经",
    color: "red",
    column: "finance",
    home: "https://news.10jqka.com.cn",
    sub: {
      quick: {
        type: "realtime",
        interval: Time.Fast,
        title: "快讯",
      },
    },
  },
  "eastmoney": {
    name: "东方财富",
    color: "green",
    column: "finance",
    home: "https://kuaixun.eastmoney.com/",
    sub: {
      quick: {
        type: "realtime",
        interval: Time.Fast,
        title: "快讯",
      },
      focus: {
        title: "焦点",
        interval: Time.Common,
      },
    },
  },
  "hackernews": {
    name: "Hacker News",
    color: "orange",
    column: "tech",
    type: "realtime",
    home: "https://news.ycombinator.com",
    interval: Time.Fast,
    sub: {
      hot: {
        title: "热门",
      },
    },
  },
  "spaceflight": {
    name: "Spaceflight News",
    color: "slate",
    column: "tech",
    home: "https://www.spaceflightnewsapi.net",
    interval: Time.Common,
    sub: {
      spacex: {
        title: "SpaceX",
        interval: Time.Fast,
      },
    },
  },


  "arstechnica": {
    name: "Ars Technica",
    color: "orange",
    column: "tech",
    home: "https://arstechnica.com",
    interval: Time.Fast,
    title: "半导体",
  },
  "venturebeat": {
    name: "VentureBeat",
    color: "indigo",
    column: "tech",
    home: "https://venturebeat.com",
    interval: Time.Fast,
    title: "创投科技",
  },
  "blockbeats": {
    name: "律动BlockBeats",
    color: "purple",
    column: "crypto",
    type: "realtime",
    home: "https://www.theblockbeats.info",
    interval: Time.Fast,
    title: "快讯",
  },
  "seeking-alpha": {
    name: "Seeking Alpha",
    color: "orange",
    column: "finance",
    home: "https://seekingalpha.com",
    interval: Time.Fast,
    title: "美股分析",
  },
  "benzinga": {
    name: "Benzinga",
    color: "sky",
    column: "finance",
    home: "https://www.benzinga.com",
    interval: Time.Realtime,
    title: "美股快讯",
  },
  "bloomberg": {
    name: "Bloomberg",
    color: "orange",
    column: "finance",
    home: "https://www.bloomberg.com",
    interval: Time.Fast,
    title: "财经综合",
  },
  "techmeme": {
    name: "Techmeme",
    color: "blue",
    column: "tech",
    home: "https://techmeme.com",
    interval: Time.Fast,
    title: "科技聚合",
  },
} as const satisfies Record<string, OriginSource>

export function genSources() {
  const _: [SourceID, Source][] = []

  Object.entries(originSources).forEach(([id, source]: [any, OriginSource]) => {
    const parent = {
      name: source.name,
      type: source.type,
      disable: source.disable,
      desc: source.desc,
      column: source.column,
      home: source.home,
      color: source.color ?? "primary",
      interval: source.interval ?? Time.Default,
    }
    if (source.sub && Object.keys(source.sub).length) {
      Object.entries(source.sub).forEach(([subId, subSource], i) => {
        if (i === 0) {
          _.push([
            id,
            {
              redirect: `${id}-${subId}`,
              ...parent,
              ...subSource,
            },
          ] as [any, Source])
        }
        _.push([`${id}-${subId}`, { ...parent, ...subSource }] as [
          any,
          Source,
        ])
      })
    } else {
      _.push([
        id,
        {
          title: source.title,
          ...parent,
        },
      ])
    }
  })

  return typeSafeObjectFromEntries(
    _.filter(([_, v]) => {
      if (v.disable === "cf" && process.env.CF_PAGES) {
        return false
      } else {
        return v.disable !== true
      }
    }),
  )
}
