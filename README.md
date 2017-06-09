# Armory
shake를 위한 대회 플랫폼입니다.

## 사용법
1. package를 clone합니다.
```bash
git clone git@github.com:AJOU-ANSI/Armory.git
```

2. package dependency를 설치합니다.
```bash
npm i // yarn install
```

3. client를 빌드합니다.
```bash
npm run build:client // yarn build:client
```

4. config_sample.js를 config.js로 복사하고 mysql 등의 설정을 로컬에 맞게 수정합니다.

5. server를 실행합니다.

- production
  ```bash
  node run start // yarn start
   ```

- development
  ```bash
  node run dev // yarn dev
  ```
