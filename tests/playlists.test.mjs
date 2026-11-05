import test from 'node:test'
import assert from 'node:assert/strict'
import { resultPlaylists, getYouTubeVideoId, createPlaylistQr } from '../src/playlists.ts'

test('each genre keeps the two supplied YouTube recommendations in order', () => {
  const ids = {
    SWING: ['xdoxSzcP-r8', '5py3nRJzWqk'],
    'COOL JAZZ': ['yv_LymMSCuA', 'XV8yplc4ws8'],
    'BOSSA NOVA': ['1fj8Dj4FcF4', 'pJcqXEVjpH8'],
    'BLUE NOTE': ['qCQGgEkSccE', 'UmcEctraLZg'],
  }
  assert.deepEqual(Object.keys(resultPlaylists), Object.keys(ids))
  for (const [genre, expected] of Object.entries(ids)) {
    assert.deepEqual(resultPlaylists[genre].map(item => item.videoId), expected)
    for (const item of resultPlaylists[genre]) {
      assert.equal(item.thumbnailUrl, `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`)
      assert.equal(new URL(item.url).pathname, `/${item.videoId}`)
      assert(new URL(item.url).searchParams.has('si'))
    }
  }
})

test('video ID parsing supports short and watch URLs without accepting unrelated hosts', () => {
  assert.equal(getYouTubeVideoId('https://www.youtube.com/watch?v=xdoxSzcP-r8&feature=share'), 'xdoxSzcP-r8')
  assert.equal(getYouTubeVideoId('https://youtu.be/xdoxSzcP-r8?si=example'), 'xdoxSzcP-r8')
  for (const url of ['https://example.com/watch?v=xdoxSzcP-r8', 'javascript:alert(1)', 'https://youtu.be/short', 'http://youtu.be/xdoxSzcP-r8']) {
    assert.throws(() => getYouTubeVideoId(url))
  }
})

test('all recommendation QR codes reserve a four-module white quiet zone', () => {
  for (const items of Object.values(resultPlaylists)) for (const item of items) {
    const matrix = createPlaylistQr(item.url)
    const size = matrix.length
    assert(matrix.some(row => row.some(Boolean)))
    matrix.forEach((row, y) => {
      assert.equal(row.length, size)
      row.forEach((dark, x) => { if (x < 4 || y < 4 || x >= size - 4 || y >= size - 4) assert.equal(dark, false) })
    })
  }
})
