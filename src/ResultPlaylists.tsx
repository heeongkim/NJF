import { useMemo, useState } from 'react'
import { createPlaylistQr, resultPlaylists, type JazzGenre, type Playlist } from './playlists'
import './ResultPlaylists.css'

export function ResultGraphic({ genre }: { genre: JazzGenre }) {
  return <div className={`result-graphic graphic-${genre.toLowerCase().replaceAll(' ', '-')}`} aria-hidden="true">
    <svg viewBox="0 0 400 280" fill="none" focusable="false">
      <ellipse className="graphic-orbit" cx="200" cy="145" rx="180" ry="70" transform="rotate(-22 200 145)" />
      {genre === 'SWING' && <g className="swing-rhythm">
        {[0, 24, 48].map(offset => <path key={offset} className="graphic-line" d={`M30 ${150 + offset} Q70 ${25 + offset} 110 ${150 + offset} T190 ${150 + offset} T270 ${150 + offset} T350 ${150 + offset}`} />)}
        <circle cx="70" cy="86" r="14" className="graphic-dot" /><circle cx="230" cy="86" r="9" className="graphic-dot" /><circle cx="310" cy="214" r="12" className="graphic-dot" />
      </g>}
      {genre === 'COOL JAZZ' && <g className="cool-record">
        <circle cx="205" cy="140" r="91" fill="#191d2e" />
        {[82, 73, 64, 55].map(radius => <circle key={radius} cx="205" cy="140" r={radius} stroke="#9c9bc9" strokeOpacity=".5" strokeWidth=".7" />)}
        <circle cx="205" cy="140" r="31" fill="#c5eaff" /><circle cx="205" cy="140" r="5" fill="#fbfcff" />
        <path d="M28 140H105M306 140H375" className="graphic-line" />
      </g>}
      {genre === 'BOSSA NOVA' && <g>
        <circle cx="285" cy="82" r="38" fill="#9c9bc9" fillOpacity=".65" />
        {[0, 25, 50, 75].map(offset => <path key={offset} className="graphic-line wave-line" d={`M20 ${120 + offset} C100 ${45 + offset} 170 ${210 + offset} 365 ${115 + offset}`} />)}
        <path d="M285 26V10M340 82H358M245 42L233 30" className="graphic-line" />
      </g>}
      {genre === 'BLUE NOTE' && <g>
        <path d="M254 35A78 78 0 1 0 320 166A80 80 0 0 1 254 35Z" fill="#191d2e" />
        <path d="M30 210C130 110 260 275 370 190M32 230C140 135 250 295 373 212" className="graphic-line" />
        <path d="M112 48V76M98 62H126M338 43V61M329 52H347" className="graphic-line" />
      </g>}
    </svg>
    <span className="chrome-sphere result-sphere" />
  </div>
}

function PlaylistQR({ url, label }: { url: string; label: string }) {
  const matrix = useMemo(() => createPlaylistQr(url), [url])
  const size = matrix.length
  const path = matrix.flatMap((row, y) => row.flatMap((dark, x) => dark ? `M${x} ${y}h1v1h-1z` : [])).join('')
  return <a className="playlist-qr" href={url} target="_blank" rel="noopener noreferrer" aria-label={`${label} QR 코드 — YouTube에서 새 탭으로 열기`}>
    <svg className="playlist-qr-code" viewBox={`0 0 ${size} ${size}`} width={size * 3} height={size * 3} role="img" aria-label={`${label} YouTube 링크 QR 코드`} shapeRendering="crispEdges">
      <rect width={size} height={size} fill="#fff" /><path d={path} fill="#191d2e" />
    </svg>
    <span>SCAN TO LISTEN <span aria-hidden="true">↗</span></span>
  </a>
}

function PlaylistFeature({ playlist, genre, index }: { playlist: Playlist; genre: JazzGenre; index: number }) {
  const [thumbnailFailed, setThumbnailFailed] = useState(false)
  const number = String(index + 1).padStart(2, '0')
  const label = `${genre} Playlist ${number}`
  return <article className={`playlist-feature playlist-feature-${index + 1}`} aria-labelledby={`playlist-name-${index}`}>
    <div className="playlist-folio"><span>{number} / {index === 0 ? 'MAIN SELECTION' : 'ANOTHER SIDE'}</span><span>YOUTUBE PLAYLIST</span></div>
    <a className={`playlist-artwork ${thumbnailFailed ? 'thumbnail-unavailable' : ''}`} href={playlist.url} target="_blank" rel="noopener noreferrer" aria-label={`${label} — YouTube에서 새 탭으로 열기`}>
      {thumbnailFailed ? <div className="playlist-placeholder"><span>{genre}</span><small>YouTube에서 바로 듣기</small></div> : <img src={playlist.thumbnailUrl} alt={`${label} 썸네일`} width="480" height="360" referrerPolicy="no-referrer" onError={() => setThumbnailFailed(true)} />}
      <span className="playlist-play" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M8 5L19 12L8 19Z" fill="currentColor" /></svg></span>
    </a>
    <div className="playlist-caption"><div><h4 id={`playlist-name-${index}`}>Playlist <span>{number}</span></h4><a href={playlist.url} target="_blank" rel="noopener noreferrer" className="playlist-open" aria-label={`${label} 재생 — 새 탭`}>PLAY ON YOUTUBE <span aria-hidden="true">↗</span></a></div><PlaylistQR url={playlist.url} label={label} /></div>
  </article>
}

export default function ResultPlaylists({ genre }: { genre: JazzGenre }) {
  return <section className="result-playlists" aria-labelledby="playlist-section-title">
    <div className="playlist-section-heading"><div><span className="playlist-section-kicker">YOUR NEXT LISTEN</span><h3 id="playlist-section-title">FOR YOUR<br /><em>PLAYLIST</em></h3></div><p>당신의 리듬을 조금 더 오래.<br />마음에 드는 플레이리스트를 틀어보세요.</p></div>
    <div className="playlist-composition">
      <div className="playlist-orbit" aria-hidden="true" />
      {resultPlaylists[genre].map((playlist, index) => <PlaylistFeature key={playlist.url} playlist={playlist} genre={genre} index={index} />)}
      <p className="playlist-side-note" aria-hidden="true">DIFFERENT SOUNDS.<br />YOUR OWN RHYTHM.</p>
    </div>
  </section>
}
