# Navigation Test Case Implementation Procedure

## 1. 문서 목적

본 문서는 `navigation_test_cases.md`에 정의된 고급 내비게이션 테스트 시나리오의 구현 절차와 가이드라인을 정의하고, 각 테스트 케이스의 진행 상황을 추적하는 것을 목적으로 합니다.

## 2. 구현 가이드라인

- **테스트 페이지**: 모든 테스트 케이스는 `http://localhost:PORT/navigation.html` 경로를 통해 접근할 수 있는 별도의 테스트 페이지에서 구현됩니다.
- **진입점**:
    - HTML: `navigation.html`
    - TypeScript: `src/navigation_main.tsx`
- **메인 UI 컴포넌트**: `src/pages/NavigationTestPage.tsx` 파일이 테스트 시나리오 목록과 스택 뷰를 포함하는 메인 UI를 구성합니다.
- **화면 컴포넌트 (Activities)**: 테스트에 필요한 신규 화면 컴포넌트들은 `src/components/navigation_screens.tsx`에 정의합니다. 기존 `screens.tsx`와 분리하여 관리합니다.
- **Stackflow 설정**: 모든 신규 Activity는 `src/stackflow/stack.tsx`의 `activities` 객체와 `historySyncPlugin`의 `routes`에 등록되어야 합니다.
- **실행 스크립트**: `npm run dev:nav` 명령어로 새 테스트 페이지를 실행할 수 있습니다.

## 3. 테스트 케이스 구현 진행 상황

| Case ID | Title | Status | Notes |
|---|---|---|---|
| TC01 | 홈 화면으로 이동 시 스택 초기화 | ✅ Completed | `reset` 액션 대신 `pop`을 반복하여 스택 초기화 |
| TC02 | 리스트 > 상세 > ... > 리스트 | ⬜️ Not Started | `popTo` 액션 필요 |
| TC03 | 스택 내 단계별 Step 관리 | ⬜️ Not Started | |
| TC04 | 탭 네비게이션과 스택 병행 관리 | ⬜️ Not Started | Stackflow 단독으로 구현 어려울 수 있음 |
| TC05 | 푸시 알림으로 특정 화면 이동 | ⬜️ Not Started | |
| TC06 | 모달과 스택 관계 | ⬜️ Not Started | |
| TC07 | 조건부 네비게이션 (인증 여부) | ⬜️ Not Started | |
| TC08 | 스택 일부만 제거 | ⬜️ Not Started | |
| TC09 | 중복 화면 방지 | ⬜️ Not Started | |
| TC10 | 백스택 없이 특정 화면 이동 | ⬜️ Not Started | `replace` 액션 |
| TC11 | 다중 모달 중첩 관리 | ⬜️ Not Started | |
| TC12 | 이전 화면 기반 조건 처리 | ⬜️ Not Started | |
| TC13 | 화면 간 데이터 전달 | ⬜️ Not Started | |
| TC14 | 네비게이션 상태 기반 UI 변경 | ⬜️ Not Started | |
| TC15 | 앱 재시작 시 스택 복원 | ⬜️ Not Started | |
| TC16 | 애니메이션 커스터마이징 | ⬜️ Not Started | |
| TC17 | Deep Linking 진입 시 스택 재구성 | ⬜️ Not Started | |
| TC18 | Activity Embedding | ⬜️ Not Started | Stackflow 지원 범위 확인 필요 |
| TC19 | 로그인/로그아웃 시 스택 초기화 | ⬜️ Not Started | |
| TC20 | 멀티스텝 완료 후 스택 제거 | ⬜️ Not Started | |
| TC21 | Drawer/Tab/Stack 혼합 구조 | ⬜️ Not Started | |
| TC22 | 스택 중간 단계로 점프 | ⬜️ Not Started | `pop` 여러 번 호출 |
| TC23 | 중복 방지 및 replace 활용 | ⬜️ Not Started | |
| TC24 | 사용자 행동 기반 스택 조정 | ⬜️ Not Started | |
| TC25 | UX 중심 네비게이션 설계 | ⬜️ Not Started | |
