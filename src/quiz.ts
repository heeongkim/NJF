export const genres = ['SWING', 'COOL JAZZ', 'BOSSA NOVA', 'BLUE NOTE'] as const
export type Answer = 0 | 1 | 2 | 3

export const questions = [
  { title: '아무 일정도 없는 저녁, 가장 끌리는 건?', options: [
    '친구들에게 연락해서 일단 밖으로 나간다.',
    '좋아하는 음악 틀어놓고 혼자 시간을 보낸다.',
    '가까운 곳이라도 천천히 산책하러 나간다.',
    '조명을 낮추고 오래 미뤄둔 생각에 잠긴다.',
  ] },
  { title: '여행을 떠난다면 나는?', options: [
    '사람이 많고 활기찬 도시를 돌아다니는 여행',
    '유명하지 않은 곳을 내 페이스대로 돌아보는 여행',
    '아무것도 안 해도 좋은 휴양지 여행',
    '오래된 거리와 이야기가 있는 도시 여행',
  ] },
  { title: '다음 중 가장 마음에 드는 시간은?', options: [
    '사람들로 거리가 활기를 띠는 오후 7시',
    '도시가 조금 조용해지는 밤 11시',
    '햇빛이 부드러워지는 오후 5시',
    '세상에 나만 깨어 있는 것 같은 새벽 2시',
  ] },
  { title: '네 개의 공간 중 하나에 들어가야 한다면?', options: [
    '사람들이 웃고 이야기하는 오래된 라이브 바',
    '조용하고 정돈된 작은 레코드숍',
    '창문이 활짝 열린 햇살 좋은 카페',
    '조명 하나만 켜진 늦은 밤의 빈 공연장',
  ] },
  { title: '예상하지 못한 일이 생겼다. 내 반응은?', options: [
    '“오히려 재밌는데?”',
    '일단 상황을 천천히 파악한다.',
    '뭐 어떻게든 되겠지 싶다.',
    '생각보다 오래 마음에 남는다.',
  ] },
  { title: '네가 더 좋아하는 대화는?', options: [
    '정신없이 웃다가 시간이 순식간에 가는 대화',
    '말수가 많진 않아도 센스가 잘 맞는 대화',
    '별 내용 없어도 편안하게 이어지는 대화',
    '서로의 진짜 속마음까지 이야기하는 대화',
  ] },
  { title: '하루를 하나의 리듬으로 표현한다면?', options: [
    '● ● ● ● — 통통 튀고 일정한 리듬',
    '● — ● — — 여백이 많은 리듬',
    '● · ● · ● · — 부드럽게 반복되는 리듬',
    '● —— ● · —— — 느리고 긴 리듬',
  ] },
  { title: '마지막 질문! 지금 당장 듣고 싶은 음악은?', options: [
    '듣자마자 몸이 먼저 움직이는 음악',
    '조용한데 자꾸 귀가 가는 음악',
    '햇빛 아래 오래 틀어두고 싶은 음악',
    '혼자 있는 밤에 끝까지 듣고 싶은 음악',
  ] },
] as const

export function calculateResult(answers: readonly Answer[]) {
  if (answers.length !== questions.length || answers.some(answer => !Number.isInteger(answer) || answer < 0 || answer > 3)) {
    throw new Error('Eight valid answers are required.')
  }
  const counts = genres.map((_, index) => answers.filter(answer => answer === index).length)
  const highest = Math.max(...counts)
  // Q8 wins a top-score tie. If Q8 isn't tied for first, use the latest
  // answer among the tied leaders, preserving the most-selected-type rule.
  const winner = answers.findLast(answer => counts[answer] === highest)!
  return genres[winner]
}
