import { useEffect, useRef, useState, type CSSProperties } from 'react'
import './App.css'
import { calculateResult, questions, type Answer } from './quiz'

// View boxes isolate the eight stickers from the processed, transparent pack.
const stickers = [
  { kind: 'logo', box: '24 276 390 170', x: '15%', y: '20%', rotate: '-13deg', delay: 80 },
  { kind: 'dotted', box: '397 248 394 242', x: '82%', y: '17%', rotate: '12deg', delay: 190 },
  { kind: 'script', box: '790 242 444 298', x: '15%', y: '48%', rotate: '-12deg', delay: 300 },
  { kind: 'clef', box: '1240 130 264 405', x: '86%', y: '47%', rotate: '14deg', delay: 410 },
  { kind: 'club', box: '35 576 356 315', x: '14%', y: '79%', rotate: '8deg', delay: 530 },
  { kind: 'heart', box: '394 685 388 164', x: '77%', y: '78%', rotate: '-10deg', delay: 640 },
  { kind: 'life', box: '797 649 358 213', x: '36%', y: '91%', rotate: '-7deg', delay: 740 },
  { kind: 'lover', box: '1157 611 354 282', x: '61%', y: '10%', rotate: '8deg', delay: 840 },
]

function JazzTest() {
  const [screen, setScreen] = useState<'intro' | 'home' | 'question' | 'result'>('intro')
  const [replay, setReplay] = useState(0)
  const [artReady, setArtReady] = useState(false)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const image = new Image()
    image.onload = () => setArtReady(true)
    image.onerror = () => setScreen('home')
    image.src = '/stickers/jazz-stickers.png'
    return () => { image.onload = null; image.onerror = null }
  }, [])

  useEffect(() => {
    if (screen !== 'intro' || !artReady) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const timer = window.setTimeout(() => setScreen('home'), motion.matches ? 0 : 1950)
    return () => window.clearTimeout(timer)
  }, [screen, replay, artReady])

  useEffect(() => {
    if (screen === 'question' || screen === 'result') heading.current?.focus({ preventScroll: true })
  }, [screen, questionIndex])

  useEffect(() => () => {
    if (advanceTimer.current !== null) clearTimeout(advanceTimer.current)
  }, [])

  function cancelAdvance() {
    if (advanceTimer.current !== null) clearTimeout(advanceTimer.current)
    advanceTimer.current = null
    setTransitioning(false)
  }

  function startTest() {
    cancelAdvance()
    setAnswers([])
    setQuestionIndex(0)
    setScreen('question')
  }

  function selectAnswer(answer: Answer) {
    if (advanceTimer.current !== null) return
    setAnswers(previous => {
      const updated = [...previous]
      updated[questionIndex] = answer
      return updated
    })
    setTransitioning(true)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    advanceTimer.current = setTimeout(() => {
      advanceTimer.current = null
      setTransitioning(false)
      if (questionIndex === questions.length - 1) setScreen('result')
      else setQuestionIndex(index => index + 1)
    }, reducedMotion ? 0 : 280)
  }

  function goBack() {
    cancelAdvance()
    if (questionIndex === 0) setScreen('home')
    else setQuestionIndex(index => index - 1)
  }

  function restart() {
    cancelAdvance()
    setAnswers([])
    setQuestionIndex(0)
    setReplay((value) => value + 1)
    setScreen('intro')
  }

  return (
    <div className={`festival ${screen}`}>

      <main>
        {artReady && <div className="sticker-board" key={replay} aria-hidden="true">
          {stickers.map((sticker) => (
            <div key={sticker.kind} className={`sticker ${sticker.kind}`} style={{ '--x': sticker.x, '--y': sticker.y, '--angle': sticker.rotate, '--delay': `${sticker.delay}ms` } as CSSProperties}>
              <svg viewBox={sticker.box} focusable="false"><image href="/stickers/jazz-stickers.png" width="1536" height="1024" /></svg>
            </div>
          ))}
        </div>}

        {screen === 'intro' && <div className="intro-caption"><span>FIND YOUR RHYTHM</span><button onClick={() => setScreen('home')}>인트로 건너뛰기 ↗︎</button></div>}

        {screen === 'home' && <section className="hero enter" aria-labelledby="main-title">
          <p className="eyebrow"><span /> YOUR PERSONAL JAZZ DISCOVERY</p>
          <h1 id="main-title">What's your<br /><em>jazz</em> like<span className="question-mark">?</span></h1>
          <div className="hero-copy"><p>나와 어울리는 재즈는 어떤 소리일까?</p><p>취향을 따라가다 보면, 나만의 리듬을 만나게 될 거예요.</p></div>
          <button className="start-button" onClick={startTest}>나의 재즈 찾기 <span aria-hidden="true">↗︎</span></button>
          <p className="small-note">재즈를 몰라도 괜찮아요. 그냥 당신답게!</p>
          <button className="replay-button" onClick={restart}>↻ 인트로 다시 보기</button>
        </section>}

        {screen === 'question' && <section className="question-panel" aria-labelledby="question-title">
          <div className="question-navigation">
            <button className="back-button" onClick={goBack}>← {questionIndex === 0 ? '처음으로' : '이전 질문'}</button>
            <span className="question-count" aria-label={`전체 8개 중 ${questionIndex + 1}번째 질문`}><span>{String(questionIndex + 1).padStart(2, '0')}</span> / 08</span>
          </div>
          <div className="question-progress" aria-hidden="true"><span style={{ width: `${(questionIndex + 1) / questions.length * 100}%` }} /></div>
          <div key={questionIndex} className={`question-content ${transitioning ? 'leaving' : ''}`}>
            <h2 id="question-title" tabIndex={-1} ref={heading}>{questions[questionIndex].title}</h2>
            <div className="answers" role="group" aria-labelledby="question-title">
              {questions[questionIndex].options.map((option, index) => <button
                key={index}
                className={`answer ${answers[questionIndex] === index ? 'selected' : ''}`}
                aria-pressed={answers[questionIndex] === index}
                aria-disabled={transitioning}
                onClick={() => selectAnswer(index as Answer)}
              >
                <span className="answer-number">{'ABCD'[index]}</span>
                <span className="answer-text">{option}</span>
                <span className="answer-check" aria-hidden="true">{answers[questionIndex] === index ? '✓' : '↗︎'}</span>
              </button>)}
            </div>
          </div>
        </section>}

        {screen === 'result' && <section className="result-panel enter" aria-labelledby="result-title">
          <p className="eyebrow">YOUR JAZZ IS</p>
          <h2 id="result-title" tabIndex={-1} ref={heading}>{calculateResult(answers)}</h2>
          <p>당신의 취향이 모여, 하나의 재즈가 되었어요.</p>
          <div className="result-actions">
            <button className="back-button" onClick={() => { setQuestionIndex(7); setScreen('question') }}>← 마지막 질문으로</button>
            <button className="back-button" onClick={startTest}>다시 테스트하기 ↗︎</button>
          </div>
        </section>}

      </main>


    </div>
  )
}

export default JazzTest
