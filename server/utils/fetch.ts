import { $fetch } from "ofetch"
import type { FetchOptions } from "ofetch"

export const myFetch = $fetch.create({
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  },
  timeout: 10000,
  retry: 3,
  onRequestError({ request, error }) {
    console.error(`请求失败: ${request}`, error)
  },
  onResponseError({ request, response }) {
    console.error(`响应错误: ${request}`, response.status, response.statusText)
  },
})
