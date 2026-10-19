import { useEffect, useRef, useState, type ReactNode } from 'react'
import JazzTest from './JazzTest'
import { schedule } from './schedule'
import './Site.css'

const pages = [
  { href: '/', label: 'HOME' },
  { href: '/festival', label: 'FESTIVAL' },
  { href: '/schedule', label: 'SCHEDULE' },
  { href: '/jazz-test', label: 'JAZZ TEST' },
]

function Link({ href, children, className, current }: { href: string; children: ReactNode; className?: string; current?: boolean }) {
  return <a href={href} className={className} aria-current={current ? 'page' : undefined} onClick={event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (window.location.pathname === href) {
      window.history.replaceState(null, '', href)
      window.scrollTo(0, 0)
      document.getElementById('main-content')?.focus({ preventScroll: true })
      return
    }
    window.history.pushState(null, '', href)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }}>{children}</a>
}

function Vinyl({ className = '' }: { className?: string }) {
  return <div className={`vinyl ${className}`} aria-hidden="true"><div className="vinyl-label"><span>NJF</span><small>33⅓ · SIDE A</small><i /></div></div>
}

function PosterHero() {
  const poster = useRef<HTMLElement>(null)
  useEffect(() => {
    const element = poster.current!
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(pointer: fine)')
    let frame = 0
    let x = 0
    let y = 0
    function update() {
      frame = 0
      element.style.setProperty('--pointer-x', `${x}px`)
      element.style.setProperty('--pointer-y', `${y}px`)
    }
    function move(event: PointerEvent) {
      if (motion.matches || !finePointer.matches) return
      const bounds = element.getBoundingClientRect()
      x = (event.clientX - bounds.left - bounds.width / 2) / bounds.width * 16
      y = (event.clientY - bounds.top - bounds.height / 2) / bounds.height * 12
      if (!frame) frame = requestAnimationFrame(update)
    }
    function reset() { cancelAnimationFrame(frame); x = 0; y = 0; update() }
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerleave', reset)
    motion.addEventListener('change', reset)
    return () => {
      cancelAnimationFrame(frame)
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', reset)
      motion.removeEventListener('change', reset)
    }
  }, [])

  return <section className="poster-hero" ref={poster} aria-labelledby="festival-title">
    <div className="poster-orbits" aria-hidden="true"><span /><span /><span /></div>
    <div className="poster-kicker"><span>SEOUL, SOUTH KOREA</span><span>08—10 OCTOBER 2027</span></div>
    <div className="poster-heading">
      <p className="poster-year">2027 <span>노들 재즈 페스티벌</span></p>
      <h1 id="festival-title"><span className="screen-reader-only">2027 NODEUL JAZZ FESTIVAL · 노들 재즈 페스티벌</span><img src="/festival/korean-title.png" alt="" width="1223" height="1286" fetchPriority="high" /></h1>
    </div>
    <p className="poster-signature" aria-hidden="true">Nodeul<br />Jazz<br />Festival</p>
    <div className="sax-position" aria-hidden="true"><img src="/festival/chrome-saxophone.png" alt="" width="1024" height="1536" fetchPriority="high" /></div>
    <Vinyl className="hero-vinyl" />
    <span className="chrome-sphere sphere-one" aria-hidden="true" />
    <span className="chrome-sphere sphere-two" aria-hidden="true" />
    <span className="chrome-sphere sphere-three" aria-hidden="true" />
    <span className="chrome-sphere sphere-four" aria-hidden="true" />
    <span className="poster-spark" aria-hidden="true">✧</span>
    <div className="poster-date"><span>OCTOBER</span><strong>08—10</strong><span>FRI — SUN / 2027</span></div>
    <div className="poster-location"><span className="location-cross" aria-hidden="true">+</span><p>NODEUL ISLAND<br /><span>SEOUL, KOREA</span></p></div>
    <a className="poster-scroll" href="#about">EXPLORE THE FESTIVAL <span aria-hidden="true">↓</span></a>
  </section>
}

function Introduction() {
  return <div className="introduction-copy">
    <p>노들섬 재즈 페스티벌은 한강 위에 위치한 문화공간인 노들섬에서 진행되는 야외 재즈 페스티벌이다.</p>
    <p>관객들은 잔디마당에 자유롭게 앉아 공연을 즐길 수 있으며, 곳곳에 배치된 푸드트럭과 부스를 통해 다양한 음식과 문화 콘텐츠를 함께 경험할 수 있다.</p>
    <p>도심 속 자연 환경과 재즈 음악이 어우러진 편안하면서도 감각적인 음악 페스티벌 경험을 제공하는 것을 목표로 한다.</p>
  </div>
}

function FestivalFacts() {
  return <dl className="festival-facts"><div><dt>DATE</dt><dd>2027.10.08 — 10.10</dd></div><div><dt>PLACE</dt><dd>서울 노들섬 잔디마당 일대</dd></div></dl>
}

function Program() {
  return <div className="program-list">{schedule.map((day, index) => <Link href="/schedule" key={day.date} className="program-row"><span className="program-number">DAY {index + 1}</span><strong>{day.program}</strong><span className="program-date">{day.date} <small>{day.weekday}</small></span><span aria-hidden="true">↗</span></Link>)}</div>
}

function Home() {
  return <main className="site-main" id="main-content" tabIndex={-1}>
    <PosterHero />
    <section className="festival-intro section-space" id="about" aria-labelledby="intro-heading">
      <div className="section-index"><span>01 / THE FESTIVAL</span><span>WHERE THE CITY MEETS THE SOUND</span></div>
      <div className="intro-grid"><div><p className="korean-label">노들 재즈 페스티벌</p><h2 id="intro-heading">AN ISLAND.<br />A RHYTHM.<br /><em>OUR MOMENT.</em></h2><span className="intro-star" aria-hidden="true">✦</span></div><div><p className="intro-english">Nodeul Jazz Festival | NJF</p><Introduction /><FestivalFacts /><Link href="/festival" className="text-link">페스티벌 알아보기 <span aria-hidden="true">↗</span></Link></div></div>
    </section>
    <section className="program-section section-space" aria-labelledby="program-heading">
      <div className="section-index"><span>02 / THREE DAYS OF JAZZ</span><span>2027.10.08 — 10.10</span></div>
      <div className="section-heading"><h2 id="program-heading">ONE ISLAND.<br /><em>THREE CHAPTERS.</em></h2><Link href="/schedule" className="text-link">전체 일정 보기 <span aria-hidden="true">↗</span></Link></div>
      <Program />
    </section>
    <section className="test-promotion section-space" aria-labelledby="test-promotion-title">
      <div className="section-index"><span>03 / FIND YOUR OWN RHYTHM</span><span>NJF JAZZ TEST</span></div>
      <div className="promotion-content"><p>나와 어울리는 재즈는 어떤 소리일까?</p><h2 id="test-promotion-title">WHAT’S YOUR<br /><em>JAZZ</em> LIKE?</h2><Link href="/jazz-test" className="promotion-link">나의 재즈 찾기 <span aria-hidden="true">↗</span></Link></div>
      <Vinyl className="promotion-vinyl" /><div className="promotion-orbit" aria-hidden="true" /><span className="chrome-sphere promotion-sphere" aria-hidden="true" />
    </section>
  </main>
}

function FestivalPage() {
  return <main id="main-content" tabIndex={-1} className="site-main basic-page">
    <p className="page-kicker">2027 NODEUL JAZZ FESTIVAL</p><h1>FESTIVAL<span>노들 재즈 페스티벌</span></h1>
    <div className="basic-intro"><h2>Nodeul Jazz Festival | NJF</h2><Introduction /></div>
    <FestivalFacts /><h2 className="basic-section-title">PROGRAM</h2><Program />
  </main>
}

function SchedulePage() {
  const [selected, setSelected] = useState(0)
  const day = schedule[selected]
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  return <main id="main-content" tabIndex={-1} className="site-main basic-page schedule-page">
    <p className="page-kicker">2027.10.08 — 10.10 / NODEUL ISLAND</p><h1>SCHEDULE<span>3일간의 재즈, 두 개의 무대</span></h1>
    <div className="day-tabs" role="tablist" aria-label="공연 날짜">{schedule.map((item, index) => <button type="button" key={item.date} ref={el => { tabs.current[index] = el }} role="tab" id={`day-${index}`} aria-selected={selected === index} aria-controls={`timetable-${index}`} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => {
      let next = index
      if (event.key === 'ArrowRight') next = (index + 1) % schedule.length
      else if (event.key === 'ArrowLeft') next = (index + schedule.length - 1) % schedule.length
      else if (event.key === 'Home') next = 0
      else if (event.key === 'End') next = schedule.length - 1
      else return
      event.preventDefault(); setSelected(next); tabs.current[next]?.focus()
    }}>{item.date} <span>{item.weekday}</span></button>)}</div>
    <div className="timetable" role="tabpanel" id={`timetable-${selected}`} aria-labelledby={`day-${selected}`} tabIndex={0}>
      {day.stages.map(stage => <section key={stage.kind} className="stage-schedule" aria-labelledby={`stage-${stage.kind}`}><div className="stage-heading"><h2 id={`stage-${stage.kind}`}>{stage.name}</h2><span>{stage.kind} / {stage.location}</span></div><ul>{stage.performances.map(performance => <li key={performance.time}><span className="performance-time">{performance.time}</span><div><strong>{performance.artist}</strong>{performance.billing && <small>{performance.billing}</small>}</div></li>)}</ul></section>)}
    </div>
  </main>
}

function App() {
  const [path, setPath] = useState(() => window.location.pathname.replace(/\/+$/, '') || '/')
  const initial = useRef(true)
  useEffect(() => {
    const onNavigate = () => setPath(window.location.pathname.replace(/\/+$/, '') || '/')
    window.addEventListener('popstate', onNavigate)
    return () => window.removeEventListener('popstate', onNavigate)
  }, [])
  useEffect(() => {
    const label = pages.find(page => page.href === path)?.label ?? 'NOT FOUND'
    document.title = `${label === 'HOME' ? '' : `${label} — `}2027 NODEUL JAZZ FESTIVAL`
    if (initial.current) { initial.current = false; return }
    window.scrollTo(0, 0)
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [path])
  return <div className={`site-shell ${path === '/jazz-test' ? 'test-route' : ''}`}>
    <a className="skip-link" href="#main-content">본문으로 바로가기</a>
    <header className="site-header"><Link href="/" className="site-logo"><strong>NJF<span>✦</span></strong><span>NODEUL<br />JAZZ FESTIVAL</span></Link><nav aria-label="주 메뉴">{pages.map(page => <Link key={page.href} href={page.href} current={path === page.href}>{page.label}</Link>)}</nav><span className="header-edition">SEOUL<br />08—10 OCT. 2027</span></header>
    {path === '/' ? <Home /> : path === '/festival' ? <FestivalPage /> : path === '/schedule' ? <SchedulePage /> : path === '/jazz-test' ? <div id="main-content" tabIndex={-1} className="jazz-test"><JazzTest /></div> : <main className="site-main basic-page not-found" id="main-content" tabIndex={-1}><p className="page-kicker">404 / NOT FOUND</p><h1>길을 벗어나도,<br />리듬은 계속.</h1><Link href="/" className="text-link">HOME으로 돌아가기 ↗</Link></main>}
    <footer className="site-footer"><Link href="/" className="footer-logo">NJF<span>2027</span></Link><p>NODEUL JAZZ FESTIVAL<br /><span>2027.10.08 — 10.10 · NODEUL ISLAND, SEOUL</span></p><span className="footer-signoff">DIFFERENT SOUNDS.<br />SAME ISLAND.</span></footer>
  </div>
}

export default App
