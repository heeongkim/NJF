export type Performance = {
  time: string
  artist: string
  billing?: 'HEADLINER' | 'CLOSING HEADLINER'
}
export type FestivalDay = {
  date: string
  weekday: string
  program: string
  stages: { name: string; kind: string; location: string; performances: Performance[] }[]
}

export const schedule: FestivalDay[] = [
  {
    date: '10.08', weekday: 'FRI', program: 'OPENING DAY', stages: [
      { name: '노을 스테이지', kind: 'MAIN', location: '잔디광장', performances: [
        { time: '17:00 – 17:50', artist: 'YOURA 유라' },
        { time: '18:10 – 19:10', artist: 'SUNWOO JUNG A 선우정아' },
        { time: '19:30 – 20:30', artist: 'YERIN BAEK 백예린' },
        { time: '20:50 – 22:10', artist: 'LAUFEY 라우페이', billing: 'HEADLINER' },
      ] },
      { name: '나루 스테이지', kind: 'SUB', location: '실내', performances: [
        { time: '15:00 – 15:40', artist: 'MILENA 밀레나' },
        { time: '16:00 – 16:40', artist: 'JO YUN SEONG TRIO 조윤성 트리오' },
        { time: '17:00 – 17:40', artist: 'SONG YOUNG JOO TRIO 송영주 트리오' },
        { time: '18:00 – 18:50', artist: 'HWANG HO GYU QUINTET 황호규 퀸텟' },
        { time: '19:10 – 20:00', artist: 'KIM O KI SATURN BALLAD 김오키 새턴발라드' },
      ] },
    ],
  },
  {
    date: '10.09', weekday: 'SAT', program: 'MAIN STAGE', stages: [
      { name: '노을 스테이지', kind: 'MAIN', location: '잔디광장', performances: [
        { time: '17:00 – 17:50', artist: 'JOHN PARK 존박' },
        { time: '18:10 – 19:10', artist: 'STELLA JANG 스텔라장' },
        { time: '19:30 – 20:30', artist: 'DANNY KOO 대니 구' },
        { time: '20:50 – 22:10', artist: 'RAYE', billing: 'HEADLINER' },
      ] },
      { name: '나루 스테이지', kind: 'SUB', location: '실내', performances: [
        { time: '15:00 – 15:40', artist: 'DROP TRIO 드롭 트리오' },
        { time: '16:00 – 16:50', artist: 'DEL VON LAMARR ORGAN TRIO' },
        { time: '17:10 – 18:00', artist: 'PARK CHANYOUNG 박찬영' },
        { time: '18:20 – 19:10', artist: 'JIN AH LEE JAZZ QUARTET 이진아' },
        { time: '19:30 – 20:20', artist: 'YUNSEOKCHEOL TRIO 윤석철 트리오' },
      ] },
    ],
  },
  {
    date: '10.10', weekday: 'SUN', program: 'CLOSING DAY', stages: [
      { name: '노을 스테이지', kind: 'MAIN', location: '잔디광장', performances: [
        { time: '17:00 – 17:50', artist: 'JISOKURYCLUB 지소쿠리클럽' },
        { time: '18:10 – 19:00', artist: 'JEON JIN HEE 전진희' },
        { time: '19:20 – 20:10', artist: 'SUMIN & SLOM 수민&슬롬' },
        { time: '20:30 – 21:30', artist: 'WAVE TO EARTH 웨이브투어스' },
        { time: '21:50 – 23:10', artist: 'FKJ', billing: 'CLOSING HEADLINER' },
      ] },
      { name: '나루 스테이지', kind: 'SUB', location: '실내', performances: [
        { time: '15:00 – 15:40', artist: 'THE WEE TRIO 더 위 트리오' },
        { time: '16:00 – 16:40', artist: 'CHRISTOPHER KUNZ TRIO' },
        { time: '17:00 – 17:40', artist: 'YUJIN KIM 김유진' },
        { time: '18:00 – 18:40', artist: 'BAND NAH 나상현씨밴드' },
        { time: '19:00 – 19:50', artist: 'KIM O KI ENSEMBLE 김오키 앙상블' },
        { time: '20:10 – 20:50', artist: 'Golden Swing Band 골든스윙밴드' },
      ] },
    ],
  },
]
