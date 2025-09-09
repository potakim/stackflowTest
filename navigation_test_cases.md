| Case ID | Title | Description | Navigation Flow | Expected Behavior | Notes |
|---|---|---|---|---|---|
| TC01 | 홈 화면으로 이동 시 스택 초기화 | 앱 사용 중 홈 버튼 클릭 시 기존 스택을 초기화하고 홈 화면으로 이동 | A > B > C > 홈 버튼 클릭 → Home | 스택 초기화 후 홈 화면이 루트로 설정됨 | popToTop 또는 reset 사용 |
| TC02 | 리스트 > 상세1 > 상세2 > 상세3 → 뒤로 → 리스트 | 상세 페이지를 여러 단계 탐색 후 리스트로 복귀 | List > Detail1 > Detail2 > Detail3 → 뒤로 → List | 뒤로가기로 리스트 화면으로 복귀 | popTo 또는 reset 사용 |
| TC03 | 스택 내 단계별 Step 관리 | 회원가입 등 단계별 화면을 스택 내에서 관리 | Step1 > Step2 > Step3 > 완료 | 단계별 진행 후 완료 화면으로 이동 | Context 또는 Redux로 Step 상태 관리 |
| TC04 | 탭 네비게이션과 스택 병행 관리 | 각 탭마다 독립적인 스택을 유지 | Tab1 > A > B → Tab2 > C → Tab1 복귀 → A > B 유지 | 탭 전환 시 이전 스택 상태 유지 | 탭별 네비게이션 컨테이너 사용 |
| TC05 | 푸시 알림으로 특정 화면 이동 | 푸시 알림 클릭 시 특정 상세 화면으로 이동 | 푸시 알림 클릭 → Detail → 뒤로 → 홈 | 푸시 알림 클릭 시 해당 화면으로 이동 | navigate 또는 reset 후 이동 |
| TC06 | 모달과 스택 관계 | 모달은 스택에 포함되지 않으며 닫기 시 스택 유지 | A > B → 모달 열림 → 모달 닫기 → B 유지 | 모달 닫기 후 이전 화면 유지 | 모달은 별도 레이어로 관리 |
| TC07 | 조건부 네비게이션 (인증 여부) | 인증되지 않은 사용자는 로그인 화면으로 리디렉션 | Detail → 인증 필요 → Login → 인증 성공 → Detail | 인증 후 원래 목적지로 이동 | replace 또는 navigate 사용 |
| TC08 | 스택 일부만 제거 | 특정 화면까지 유지하고 이후 화면 제거 | A > B > C > D → 조건 만족 시 B까지 유지 | 스택에서 C, D 제거 후 B 유지 | popUntil 또는 커스텀 스택 필터링 |
| TC09 | 중복 화면 방지 | 같은 화면이 여러 번 스택에 쌓이지 않도록 제어 | A > B > B → A > B 유지 | 중복된 화면 제거 | preventDuplicate 또는 replace 사용 |
| TC10 | 백스택 없이 특정 화면 이동 | 로그인 후 이전 화면으로 돌아가지 않도록 | Login → Home | 뒤로가기 시 앱 종료 | replace 또는 resetStack 사용 |
| TC11 | 다중 모달 중첩 관리 | 모달이 여러 개 중첩된 경우 하나씩 닫기 | Main > Modal1 > Modal2 → Modal2 닫기 → Modal1 유지 | 모달 닫기 시 이전 모달 유지 | modalStack 별도 관리 |
| TC12 | 이전 화면 기반 조건 처리 | 이전 화면이 특정 화면일 경우만 동작 수행 | A > B > C → C에서 이전이 B일 경우 동작 | 조건 만족 시 특정 동작 수행 | navigation.getPrevious 사용 |
| TC13 | 화면 간 데이터 전달 | 이전 화면에서 입력한 데이터를 다음 화면에서 사용 | Form1 > Form2 > Summary | Summary에서 모든 데이터 표시 | params 또는 글로벌 상태 사용 |
| TC14 | 네비게이션 상태 기반 UI 변경 | 현재 스택 위치에 따라 UI 변경 | Detail 화면에서는 하단 탭 숨김 | 특정 화면에서 UI 변경 | navigation.isFocused 또는 route.name 사용 |
| TC15 | 앱 재시작 시 스택 복원 | 앱 종료 후 재실행 시 이전 스택 상태 복원 | 앱 종료 → 재실행 → Detail 화면 복귀 | 이전 화면으로 자동 복귀 | 로컬 저장소에 스택 상태 저장 |
| TC16 | 애니메이션 커스터마이징 | 화면 전환 시 애니메이션 다르게 설정 | A > B (슬라이드), B > C (페이드) | 화면마다 다른 애니메이션 적용 | transitionSpec 또는 cardStyleInterpolator 사용 |
| TC17 | Deep Linking 진입 시 스택 재구성 | 외부 링크로 앱 진입 시 스택 구성 | 푸시 알림 → Detail → 뒤로 → Home | 뒤로 시 홈 화면으로 이동 | synthetic back stack 구성 |
| TC18 | Activity Embedding | 대형 화면에서 두 개의 액티비티 나란히 표시 | List 좌측 + Detail 우측 → Detail에서 뒤로 → List 유지 | 좌측 List 유지, 우측 Detail 닫힘 | split window 구성 |
| TC19 | 로그인/로그아웃 시 스택 초기화 | 인증 상태 변경 시 이전 화면 제거 | Login → MainApp, Logout → Login | 이전 화면으로 돌아가지 않음 | reset 또는 replace 사용 |
| TC20 | 멀티스텝 완료 후 스택 제거 | 단계별 진행 후 완료 시 이전 단계 제거 | Step1 > Step2 > Step3 > Submit → Success | 뒤로가기로 이전 단계 접근 불가 | reset 사용 |
| TC21 | Drawer/Tab/Stack 혼합 구조 | 탭마다 독립적인 스택 유지 | Tab1 > A > B → Tab2 > C → Tab1 → A > B 유지 | 탭 전환 시 스택 유지 | 섹션별 네비게이션 컨테이너 사용 |
| TC22 | 스택 중간 단계로 점프 | 여러 단계 중 특정 단계로 바로 복귀 | A > B > C > D → pop(2) → B | 중간 단계로 점프 | pop 또는 popTo 사용 |
| TC23 | 중복 방지 및 replace 활용 | 동일 화면 중복 제거 | A > B → replace(C) → C | B 제거 후 C로 이동 | replace 사용 |
| TC24 | 사용자 행동 기반 스택 조정 | 특정 조건 만족 시 스택 조정 | Cart > Checkout > OrderSuccess → reset → OrderSuccess | 이전 화면 제거 후 완료 화면 유지 | reset 사용 |
| TC25 | UX 중심 네비게이션 설계 | 사용자 환경에 따라 직관적인 흐름 제공 | 탭/리스트/상세 화면에서 빠른 전환 | 명확한 UI와 빠른 반응성 | UX 설계 고려 |
