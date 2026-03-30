const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
}

interface RssItem {
  title: string
  url: string
  publishedAt: string
}

// ── RSS / Atom parser ────────────────────────────────────────────────────────

function parseRss(xml: string): RssItem[] {
  const isAtom = /<feed[\s>]/i.test(xml)
  const items: RssItem[] = []

  if (isAtom) {
    for (const m of xml.matchAll(/<entry[\s>]([\s\S]*?)<\/entry>/gi)) {
      const c = m[1]
      const title = extractTag(c, 'title')
      const url = extractAtomLink(c)
      const publishedAt = extractTag(c, 'published') || extractTag(c, 'updated')
      if (title && url) {
        items.push({
          title: decodeEntities(stripCdata(title)),
          url,
          publishedAt: toIso(publishedAt),
        })
      }
    }
  } else {
    for (const m of xml.matchAll(/<item[\s>]([\s\S]*?)<\/item>/gi)) {
      const c = m[1]
      const title = extractTag(c, 'title')
      const url = extractTag(c, 'link') || extractTag(c, 'guid')
      const pubDate = extractTag(c, 'pubDate') || extractTag(c, 'dc:date')
      if (title && url) {
        items.push({
          title: decodeEntities(stripCdata(title)),
          url: stripCdata(url).trim(),
          publishedAt: toIso(pubDate),
        })
      }
    }
  }

  return items.slice(0, 20)
}

function extractTag(s: string, tag: string): string {
  const m = s.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  return m ? m[1].trim() : ''
}

function extractAtomLink(s: string): string {
  const m =
    s.match(/<link[^>]+rel=["']alternate["'][^>]+href=["']([^"']+)["']/i) ||
    s.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i)
  return m ? m[1] : ''
}

function stripCdata(s: string): string {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim()
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
}

function toIso(date: string): string {
  if (!date) return new Date().toISOString()
  try { return new Date(date).toISOString() } catch { return new Date().toISOString() }
}

// ── Title extractor ──────────────────────────────────────────────────────────

function extractTitle(html: string): string {
  const og =
    html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i)
  if (og) return decodeEntities(og[1])
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return title ? decodeEntities(title[1].trim()) : ''
}

// ── Handlers ─────────────────────────────────────────────────────────────────

async function handleRss(feedUrl: string | null): Promise<Response> {
  if (!feedUrl) return jsonError('Missing url param', 400)
  const res = await fetch(feedUrl, { headers: { 'User-Agent': 'Signal/1.0' } })
  if (!res.ok) return jsonError(`Upstream ${res.status}`, 502)
  const xml = await res.text()
  return json(parseRss(xml))
}

async function handleTitle(pageUrl: string | null): Promise<Response> {
  if (!pageUrl) return jsonError('Missing url param', 400)
  const res = await fetch(pageUrl, { headers: { 'User-Agent': 'Signal/1.0' } })
  if (!res.ok) return jsonError(`Upstream ${res.status}`, 502)

  // 只讀前 12KB，足夠找到 <title>
  const reader = res.body?.getReader()
  const decoder = new TextDecoder()
  let html = ''
  if (reader) {
    while (html.length < 12288) {
      const { done, value } = await reader.read()
      if (done) break
      html += decoder.decode(value, { stream: true })
    }
    reader.cancel()
  }

  return json({ title: extractTitle(html) })
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    const { pathname, searchParams } = new URL(request.url)

    try {
      if (pathname === '/rss') return await handleRss(searchParams.get('url'))
      if (pathname === '/title') return await handleTitle(searchParams.get('url'))
      return jsonError('Not found', 404)
    } catch (e) {
      return jsonError(String(e), 500)
    }
  },
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

function jsonError(message: string, status: number): Response {
  return json({ error: message }, status)
}
