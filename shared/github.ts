// Power by https://github.com/ourongxing/
import * as cheerio from "cheerio"
import axios from "axios";
import {GITHUB_API, GITHUB_TRENDING_API} from "../constant";

export const githubTrending = async () => {
    if (!GITHUB_API || !GITHUB_TRENDING_API) {
        throw new Error("Github API is not set")
    }
    const baseURL = GITHUB_API
    const html: any = (await axios.get(GITHUB_TRENDING_API)).data
    const $ = cheerio.load(html)
    const $main = $("main .Box div[data-hpc] > article")
    const news: tools.NewsItem[] = []
    $main.each((_, el) => {
        const a = $(el).find(">h2 a")
        const title = a.text().replace(/\n+/g, "").trim()
        const url = a.attr("href")
        const star = $(el).find("[href$=stargazers]").text().replace(/\s+/g, "").trim()
        const desc = $(el).find(">p").text().replace(/\n+/g, "").trim()
        if (url && title) {
            news.push({
                url: `${baseURL}${url}`,
                title,
                id: url,
                extra: {
                    info: `✰ ${star}`,
                    hover: desc,
                },
            })
        }
    })
    return news
}
