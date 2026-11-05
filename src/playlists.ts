import qrcode from 'qrcode-generator'
import type { calculateResult } from './quiz'

export type JazzGenre = ReturnType<typeof calculateResult>
export type Playlist = { url: string; videoId: string; thumbnailUrl: string }

export function getYouTubeVideoId(url: string) {
  const parsed = new URL(url)
  const id = parsed.hostname === 'youtu.be'
    ? parsed.pathname.slice(1)
    : ['www.youtube.com', 'youtube.com'].includes(parsed.hostname)
      ? parsed.searchParams.get('v')
      : null
  if (parsed.protocol !== 'https:' || !id || !/^[\w-]{11}$/.test(id)) {
    throw new Error('A valid HTTPS YouTube video URL is required.')
  }
  return id
}

function playlist(url: string): Playlist {
  const videoId = getYouTubeVideoId(url)
  return { url, videoId, thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` }
}

export const resultPlaylists = {
  SWING: [
    playlist('https://youtu.be/xdoxSzcP-r8?si=RZ1fvRCFOul-1wLZ'),
    playlist('https://youtu.be/5py3nRJzWqk?si=g2Q7q5HbJHeIGRCE'),
  ],
  'COOL JAZZ': [
    playlist('https://youtu.be/yv_LymMSCuA?si=dMVypUZ8RLUTHV9E'),
    playlist('https://youtu.be/XV8yplc4ws8?si=Cl1b9sVriiNoXzm2'),
  ],
  'BOSSA NOVA': [
    playlist('https://youtu.be/1fj8Dj4FcF4?si=WQo6A4KCbW1NT-v1'),
    playlist('https://youtu.be/pJcqXEVjpH8?si=O8eX7aueoRIAYPRS'),
  ],
  'BLUE NOTE': [
    playlist('https://youtu.be/qCQGgEkSccE?si=Qf4IAfB_AolWDDzE'),
    playlist('https://youtu.be/UmcEctraLZg?si=kqO-T3_h4NQyOKIq'),
  ],
} satisfies Record<JazzGenre, readonly [Playlist, Playlist]>

// Encode the same complete URL used by the link, entirely in the browser.
// Keep four blank modules around the QR so scanners can reliably locate it.
export function createPlaylistQr(url: string) {
  const qr = qrcode(0, 'M')
  qr.addData(url, 'Byte')
  qr.make()
  const quietZone = 4
  const size = qr.getModuleCount() + quietZone * 2
  return Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, col) => {
    const r = row - quietZone
    const c = col - quietZone
    return r >= 0 && c >= 0 && r < qr.getModuleCount() && c < qr.getModuleCount() && qr.isDark(r, c)
  }))
}
