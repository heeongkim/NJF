import test from 'node:test'
import assert from 'node:assert/strict'
import { schedule } from '../src/schedule.ts'

test('all three dates contain the supplied main/sub performances', () => {
  assert.deepEqual(schedule.map(day => [day.date, day.weekday]), [['10.08', 'FRI'], ['10.09', 'SAT'], ['10.10', 'SUN']])
  assert.deepEqual(schedule.map(day => day.stages.map(stage => stage.performances.length)), [[4, 5], [4, 5], [5, 6]])
  assert.deepEqual(schedule.flatMap(day => day.stages.flatMap(stage => stage.performances.filter(p => p.billing).map(p => p.artist))), ['LAUFEY 라우페이', 'RAYE', 'FKJ'])
})

test('each stage has valid chronological times and no overlapping slots', () => {
  const minutes = time => { const [hours, minutes] = time.split(':').map(Number); return hours * 60 + minutes }
  for (const day of schedule) for (const stage of day.stages) {
    let previousEnd = 0
    for (const performance of stage.performances) {
      assert(performance.artist.trim())
      assert.match(performance.time, /^\d{2}:\d{2} – \d{2}:\d{2}$/)
      const [start, end] = performance.time.split(' – ').map(minutes)
      assert(start >= previousEnd && end > start && end < 24 * 60)
      previousEnd = end
    }
  }
})
