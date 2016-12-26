<!--<img width="150" src="https://i.cloudup.com/zfY6lL7eFa-3000x3000.png" />
<img width="50" src="https://angular.io/resources/images/logos/angular2/angular.svg" />-->

# Square PANG !!

## 개발환경

- Angular 2 ( 2.x )
- ExpressJS ( 4.x - with compression )
- Webpack ( angular-cli )
- PIXI.js

---

## 게임 요소

### 플레이어
- 게임을 플레이하는 참여자

### 목표
- 제한 시간내에 많은 점수를 획득

### 절차
- 시작하기를 누르면 타이머가 줄면서 게임 시작
- 위치를 바꾸기 원하는 보석을 차례대로 선택하면 위치 변경
- 제한 시간이 끝나면 게임 종료 및 보석 이동 불가

### 규칙
- 같은 색의 보석이 3개 이상이 한줄에 위치하면 보석이 제거되고 점수 획득
- 4개 이상의 보석이 한번에 제거되면 추가 점수 획득

### 자원
- 제한 시간

### 충돌
- 보석은 서로 이웃한 보석과만 위치가 변경가능

### 경계
- 제한된 게임화면 안에서만 컨트롤이 가능

### 결과
- 제한 시간이 끝나면 플레이 시간동안 획득한 점수 확인 가능

---

## LIVE DEMO

Heroku Project: https://goo.gl/YyqaIX

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)


---

# Install & Development

```bash
git clone https://github.com/empering/square_pang.git
cd square_pang

# Install dependencies
npm install

# start server
npm run start

# Client url: http://localhost:4200
```

# Build & Production

```bash
npm run build

## Deploy dist folder to app server
Structure of dist folder:

/dist/server <-- expressjs
/dist/client <-- angular2
```