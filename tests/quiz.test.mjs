import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateResult, questions, genres } from '../src/quiz.ts'

test('exactly eight questions with four choices each', () => {
  assert.equal(questions.length, 8)
  questions.forEach(question => assert.equal(question.options.length, 4))
})
test('each answer maps to its genre', () => {
  genres.forEach((genre, index) => assert.equal(calculateResult(Array(8).fill(index)), genre))
})
test('majority wins even when Q8 differs', () => {
  assert.equal(calculateResult([0, 0, 0, 0, 0, 1, 2, 3]), 'SWING')
})
test('Q8 breaks two-way and four-way ties', () => {
  assert.equal(calculateResult([0, 1, 0, 1, 0, 1, 0, 1]), 'COOL JAZZ')
  assert.equal(calculateResult([0, 1, 2, 3, 0, 1, 3, 2]), 'BOSSA NOVA')
})
test('when Q8 is not a tied leader, latest tied leader wins', () => {
  assert.equal(calculateResult([0, 0, 0, 1, 1, 1, 2, 3]), 'COOL JAZZ')
})
test('editing an answer changes the result without adding a vote', () => {
  const answers = [0, 0, 0, 0, 1, 1, 1, 1]
  assert.equal(calculateResult(answers), 'COOL JAZZ')
  answers[7] = 0
  assert.equal(calculateResult(answers), 'SWING')
})
test('incomplete or invalid answers cannot produce a result', () => {
  assert.throws(() => calculateResult([0, 1]))
  assert.throws(() => calculateResult([0, 0, 0, 0, 0, 0, 0, 4]))
})
