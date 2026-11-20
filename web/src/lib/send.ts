import { toast } from "sonner"

/** What a send answered: the display has it, or it's waiting until it can be reached */
export interface SendResult {
  delivered: boolean
  message?: string
}

/**
 * Reads a send's response. 200 means the display has the image; 202 means it's
 * waiting and goes out as soon as the display can be reached. Anything else
 * throws with the server's reason.
 */
export async function readSend(res: Response): Promise<SendResult> {
  const data = await readReply<{ message?: string }>(res)
  if (res.status === 202) return { delivered: false, message: data.message }
  if (!res.ok) throw new Error(data.error)
  return { delivered: true }
}

/**
 * A response's JSON. When it failed, `error` always says why: the app's own
 * reason, or, when something else answered (Home Assistant's proxy when the
 * app can't be reached, say), its status and what it said. Empty when it
 * succeeded.
 */
export async function readReply<T extends object>(res: Response): Promise<T & { error: string }> {
  const text = await res.text().catch(() => "")
  let data: Partial<T> & { error?: unknown } = {}
  try { data = JSON.parse(text) ?? {} } catch { /* not JSON */ }
  const reason = typeof data.error === "string" ? data.error : ""
  return { ...data, error: res.ok ? reason : reason || failureText(res, text) } as T & { error: string }
}

function failureText(res: Response, text: string) {
  const status = `HTTP ${res.status}${res.statusText ? ` ${res.statusText}` : ""}`
  if ([502, 503, 504].includes(res.status)) return `The app didn't answer (${status}). In Home Assistant, check the add-on is running and look at its log.`
  if (res.status === 401) return `Not signed in (${status}). Reload the page and try again.`
  // A plain-text or HTML page: its words, when they say more than the status
  const words = text.replace(/<(style|script)[^>]*>[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ").trim().replace(/^Error\s+/, "")
  return words && !words.startsWith(String(res.status)) ? `${status}: ${words.slice(0, 160)}` : status
}

export function toastSend(name: string, result: SendResult) {
  if (result.delivered) toast.success(`Sent to ${name}`)
  else toast.info(`Waiting to send to ${name}`, { description: result.message, duration: 10_000 })
}

/** "in 3 min", "in 40 s" */
export function fromNow(ts: number) {
  const s = Math.max(0, Math.round((ts - Date.now()) / 1000))
  return s < 60 ? `in ${s} s` : `in ${Math.round(s / 60)} min`
}

/** "on time", "2 min behind", "1 h ahead" */
export function driftText(drift: number | null | undefined) {
  if (drift == null) return "unreadable"
  const abs = Math.abs(drift)
  if (abs < 60) return "on time"
  const amount = abs >= 5400 ? `${Math.round(abs / 3600)} h` : `${Math.round(abs / 60)} min`
  return `${amount} ${drift > 0 ? "ahead" : "behind"}`
}
