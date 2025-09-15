import React, { createContext, useContext, useState } from 'react';
import { useActivity, useStack } from '@stackflow/react';
import type { Activity } from '@stackflow/core';
import stack from '../stackflow/stack';

// --- 기존 컴포넌트 (변경 없음) ---

export const NavHomeScreen = () => (
  <div data-testid="nav-home-screen">
    <h2>Nav Home Screen</h2>
    <p>Select a test case from the left panel.</p>
  </div>
);

export const ListScreen = () => {
  return (
    <div data-testid="list-screen">
      <h2>List Screen</h2>
      <button onClick={() => stack.actions.push('DetailScreen', { id: '1' })}>Go to Detail 1</button>
    </div>
  );
};

export const DetailScreen = () => {
  const { params } = useActivity();
  const id = (params as { id: string }).id;
  const nextId = parseInt(id, 10) + 1;

  return (
    <div data-testid={`detail-screen-${id}`}>
      <h2>Detail Screen {id}</h2>
      <p>Content for item {id}.</p>
      <button onClick={() => stack.actions.push('DetailScreen', { id: nextId.toString() })}>Go to Detail {nextId}</button>
      <button onClick={() => stack.actions.pop()}>Go Back</button>
    </div>
  );
};

export const Step1Screen = () => {
    return (
        <div data-testid="step1-screen">
            <h2>Step 1</h2>
            <button onClick={() => stack.actions.push('Step2Screen', {})}>Next Step</button>
        </div>
    );
};

export const Step2Screen = () => {
    return (
        <div data-testid="step2-screen">
            <h2>Step 2</h2>
            <button onClick={() => stack.actions.push('Step3Screen', {})}>Next Step</button>
            <button onClick={() => stack.actions.pop()}>Prev Step</button>
        </div>
    );
};

export const Step3Screen = () => {
    return (
        <div data-testid="step3-screen">
            <h2>Step 3</h2>
            <button onClick={() => stack.actions.replace('SuccessScreen', {})}>Finish</button>
            <button onClick={() => stack.actions.pop()}>Prev Step</button>
        </div>
    );
};

export const SuccessScreen = () => (
    <div data-testid="success-screen">
        <h2>Success!</h2>
        <p>You have completed the steps.</p>
    </div>
);

export const TC1_HomeScreen = () => {
    return (
        <div data-testid="tc1-home-screen">
            <h2>TC1: Reset to Home</h2>
            <button onClick={() => stack.actions.push('TC1_Screen1', {})}>Go to Screen 1</button>
        </div>
    );
};

export const TC1_Screen1 = () => {
    return (
        <div data-testid="tc1-screen1">
            <h2>TC1: Screen 1</h2>
            <button onClick={() => stack.actions.push('TC1_Screen2', {})}>Go to Screen 2</button>
            <button onClick={() => stack.actions.pop()}>Back</button>
        </div>
    );
};

export const TC1_Screen2 = () => {
    const { activities } = useStack();
    return (
        <div data-testid="tc1-screen2">
            <h2>TC1: Screen 2</h2>
            <button onClick={() => {
                const stackSize = activities.length;
                for (let i = 0; i < stackSize - 1; i++) {
                    stack.actions.pop();
                }
            }}>Reset to Home</button>
            <button onClick={() => stack.actions.pop()}>Back</button>
        </div>
    );
};

export const TC2_ListScreen = () => {
    return (
        <div data-testid="tc2-list-screen">
            <h2>TC2: List Screen</h2>
            <button onClick={() => stack.actions.push('TC2_DetailScreen', { id: '1' })}>Go to Detail 1</button>
        </div>
    );
};

export const TC2_DetailScreen = () => {
    const { activities } = useStack();
    const activity = useActivity();
    const params = activity.params as { id: string };
    const id = params.id;
    const nextId = parseInt(id, 10) + 1;

    return (
        <div data-testid={`tc2-detail-screen-${id}`}>
            <h2>TC2: Detail Screen {id}</h2>
            <p>Content for item {id}.</p>
            <button onClick={() => stack.actions.push('TC2_DetailScreen', { id: nextId.toString() })}>Go to Detail {nextId}</button>
            <button onClick={() => {
                const targetIndex = activities.findLastIndex(
                    (act: Activity) => act.name === 'TC2_ListScreen',
                );

                if (targetIndex !== -1) {
                    const popsToPerform = (activities.length - 1) - targetIndex;
                    
                    if (popsToPerform > 0) {
                        for (let i = 0; i < popsToPerform; i++) {
                            stack.actions.pop();
                        }
                    }
                }
            }}>Back to List</button>
            <button onClick={() => stack.actions.pop()}>Back</button>
        </div>
    );
};

export const TC3_Step1Screen = () => {
    return (
        <div data-testid="tc3-step1-screen">
            <h2>TC3: Step 1</h2>
            <button onClick={() => stack.actions.push('TC3_Step2Screen', {})}>Next</button>
        </div>
    );
};

export const TC3_Step2Screen = () => {
    return (
        <div data-testid="tc3-step2-screen">
            <h2>TC3: Step 2</h2>
            <button onClick={() => stack.actions.push('TC3_Step3Screen', {})}>Next</button>
            <button onClick={() => stack.actions.pop()}>Prev</button>
        </div>
    );
};

export const TC3_Step3Screen = () => {
    return (
        <div data-testid="tc3-step3-screen">
            <h2>TC3: Step 3</h2>
            <button onClick={() => {
                // Pop Step3, Step2, and Step1
                stack.actions.pop();
                stack.actions.pop();
                stack.actions.pop();
            }}>Finish</button>
            <button onClick={() => stack.actions.pop()}>Prev</button>
        </div>
    );
};

// --- TC04: 탭 네비게이션 재구현 ---

type Screen = {
  name: string;
  params?: Record<string, string>;
};

type Stacks = {
  [key: string]: Screen[];
};

type TabNavigationContextType = {
  push: (name: string, params?: Record<string, string>) => void;
  pop: () => void;
};

const TabNavigationContext = createContext<TabNavigationContextType | null>(null);

const useTabNavigation = () => {
  const context = useContext(TabNavigationContext);
  if (!context) {
    throw new Error('useTabNavigation must be used within a TabNavigationProvider');
  }
  return context;
};

const componentMap: { [key: string]: React.FC<any> } = {
  HomeTab,
  SearchTab,
  ProfileTab,
  Article,
};

export const MainTabs = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [stacks, setStacks] = useState<Stacks>({
    Home: [{ name: 'HomeTab' }],
    Search: [{ name: 'SearchTab' }],
    Profile: [{ name: 'ProfileTab' }],
  });

  const currentStack = stacks[activeTab];
  const currentScreen = currentStack[currentStack.length - 1];
  const ScreenComponent = componentMap[currentScreen.name];

  const push = (name: string, params?: Record<string, string>) => {
    setStacks(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], { name, params }],
    }));
  };

  const pop = () => {
    if (currentStack.length > 1) {
      setStacks(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].slice(0, -1),
      }));
    }
  };

  return (
    <TabNavigationContext.Provider value={{ push, pop }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
          <ScreenComponent {...currentScreen.params} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #ccc', padding: '10px 0' }}>
          <button onClick={() => setActiveTab('Home')} style={{ fontWeight: activeTab === 'Home' ? 'bold' : 'normal' }}>Home</button>
          <button onClick={() => setActiveTab('Search')} style={{ fontWeight: activeTab === 'Search' ? 'bold' : 'normal' }}>Search</button>
          <button onClick={() => setActiveTab('Profile')} style={{ fontWeight: activeTab === 'Profile' ? 'bold' : 'normal' }}>Profile</button>
        </div>
      </div>
    </TabNavigationContext.Provider>
  );
};

export function HomeTab() {
  const { push } = useTabNavigation();
  return (
    <div>
      <h2>Home Tab</h2>
      <button onClick={() => push('Article', { id: '1' })}>View Article 1</button>
    </div>
  );
};

export function SearchTab() {
  const { push } = useTabNavigation();
  return (
    <div>
      <h2>Search Tab</h2>
      <button onClick={() => push('Article', { id: '2' })}>View Article 2</button>
    </div>
  );
};

export function ProfileTab() {
  const { push } = useTabNavigation();
  return (
    <div>
      <h2>Profile Tab</h2>
      <button onClick={() => push('Article', { id: '3' })}>View Article 3</button>
    </div>
  );
};

export function Article() {
  const { pop } = useTabNavigation();
  const { params } = useActivity() as unknown as { params: { id: string } };
  return (
    <div>
      <h2>Article {params.id}</h2>
      <p>This is the article content.</p>
      <button onClick={pop}>Back</button>
    </div>
  );
};

// --- TC05: Push Notification Navigation ---

export const ArticleScreen = () => {
  const { params } = useActivity();
  const id = (params as { id: string }).id ?? 'N/A';

  return (
    <div>
      <h2>Article {id}</h2>
      <p>This is the article content, accessed via push.</p>
      <button onClick={() => stack.actions.pop()}>Back</button>
    </div>
  );
};

// --- TC06: Modal and Stack Relationship ---

export const TC06_HomeScreen = () => {
  return (
    <div>
      <h2>TC06: Modal Home</h2>
      <button onClick={() => stack.actions.push('TC06_ModalScreen', {})}>Open Modal</button>
    </div>
  );
};

export const TC06_ModalScreen = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h2>Modal Screen</h2>
        <p>This is a modal.</p>
        <button onClick={() => stack.actions.push('DetailScreen', { id: 'fromModal' })}>Push Detail from Modal</button>
        <button onClick={() => stack.actions.pop()} style={{ marginLeft: '0.5rem' }}>Close</button>
      </div>
    </div>
  );
};

// --- TC07: Conditional Navigation ---

const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const loggedIn = (window as any).__isLoggedIn ?? false;
    return loggedIn;
  });

  const login = () => {
    setIsLoggedIn(true);
    (window as any).__isLoggedIn = true;
  };
  const logout = () => {
    setIsLoggedIn(false);
    (window as any).__isLoggedIn = false;
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const TC07_HomeScreen = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <div>
      <h2>TC07: Home</h2>
      {isLoggedIn ? (
        <>
          <p>Welcome! You are logged in.</p>
          <button onClick={() => stack.actions.push('TC07_ProfileScreen', {})}>Go to Profile</button>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <p>You are not logged in.</p>
          <button onClick={() => stack.actions.push('TC07_ProfileScreen', {})}>Go to Profile (should redirect)</button>
        </>
      )}
    </div>
  );
};

export const TC07_LoginScreen = () => {
  const { login } = useAuth();
  const { params } = useActivity();
  
  const onLogin = () => {
    login();
    const redirectTo = (params as { redirectTo?: string }).redirectTo;
    if (redirectTo) {
      stack.actions.replace(redirectTo as any, {});
    } else {
      stack.actions.pop();
    }
  };

  return (
    <div>
      <h2>TC07: Login</h2>
      <p>Please log in to continue.</p>
      <button onClick={onLogin}>Log In</button>
    </div>
  );
};

export const TC07_ProfileScreen = () => {
  return (
    <div>
      <h2>TC07: Profile</h2>
      <p>This is a protected page.</p>
    </div>
  );
};

// --- TC08: Remove Part of the Stack ---

export const TC08_A_Screen = () => {
  return (
    <div>
      <h2>TC08: Screen A</h2>
      <button onClick={() => stack.actions.push('TC08_B_Screen', {})}>Go to Screen B</button>
    </div>
  );
};

export const TC08_B_Screen = () => {
  return (
    <div>
      <h2>TC08: Screen B</h2>
      <button onClick={() => stack.actions.push('TC08_C_Screen', {})}>Go to Screen C</button>
      <button onClick={() => stack.actions.pop()}>Back to A</button>
    </div>
  );
};

export const TC08_C_Screen = () => {
  const { activities } = useStack();

  const goBackToA = () => {
    const targetIndex = activities.findLastIndex(
      (act: Activity) => act.name === 'TC08_A_Screen',
    );

    if (targetIndex !== -1) {
      const popsToPerform = (activities.length - 1) - targetIndex;
      if (popsToPerform > 0) {
        for (let i = 0; i < popsToPerform; i++) {
          stack.actions.pop();
        }
      }
    } else {
      // Fallback in case Screen A is not found
      stack.actions.pop(); // Pop C
      stack.actions.pop(); // Pop B
    }
  };

  return (
    <div>
      <h2>TC08: Screen C</h2>
      <p>From here, we will go back to Screen A, removing Screen B from the stack.</p>
      <button onClick={goBackToA}>Go Back to Screen A (skipping B)</button>
      <button onClick={() => stack.actions.pop()}>Back to B</button>
    </div>
  );
};
