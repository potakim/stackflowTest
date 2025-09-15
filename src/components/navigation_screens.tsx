import React, { createContext, useContext, useState } from 'react';
import { useActivity, useStack } from '@stackflow/react';
import type { Activity } from '@stackflow/core';
import { useFlow } from '../stackflow/stack';

// --- 기존 컴포넌트 (변경 없음) ---

export const NavHomeScreen = () => (
  <div data-testid="nav-home-screen">
    <h2>Nav Home Screen</h2>
    <p>Select a test case from the left panel.</p>
  </div>
);

export const ListScreen = () => {
  const flow = useFlow();
  return (
    <div data-testid="list-screen">
      <h2>List Screen</h2>
      <button onClick={() => flow.push('DetailScreen', { id: '1' })}>Go to Detail 1</button>
    </div>
  );
};

export const DetailScreen = () => {
  const flow = useFlow();
  const { params } = useActivity();
  const id = (params as { id: string }).id;
  const nextId = parseInt(id, 10) + 1;

  return (
    <div data-testid={`detail-screen-${id}`}>
      <h2>Detail Screen {id}</h2>
      <p>Content for item {id}.</p>
      <button onClick={() => flow.push('DetailScreen', { id: nextId.toString() })}>Go to Detail {nextId}</button>
      <button onClick={() => flow.pop()}>Go Back</button>
    </div>
  );
};

export const Step1Screen = () => {
    const flow = useFlow();
    return (
        <div data-testid="step1-screen">
            <h2>Step 1</h2>
            <button onClick={() => flow.push('Step2Screen', {})}>Next Step</button>
        </div>
    );
};

export const Step2Screen = () => {
    const flow = useFlow();
    return (
        <div data-testid="step2-screen">
            <h2>Step 2</h2>
            <button onClick={() => flow.push('Step3Screen', {})}>Next Step</button>
            <button onClick={() => flow.pop()}>Prev Step</button>
        </div>
    );
};

export const Step3Screen = () => {
    const flow = useFlow();
    return (
        <div data-testid="step3-screen">
            <h2>Step 3</h2>
            <button onClick={() => flow.replace('SuccessScreen', {})}>Finish</button>
            <button onClick={() => flow.pop()}>Prev Step</button>
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
    const flow = useFlow();
    return (
        <div data-testid="tc1-home-screen">
            <h2>TC1: Reset to Home</h2>
            <button onClick={() => flow.push('TC1_Screen1', {})}>Go to Screen 1</button>
        </div>
    );
};

export const TC1_Screen1 = () => {
    const flow = useFlow();
    return (
        <div data-testid="tc1-screen1">
            <h2>TC1: Screen 1</h2>
            <button onClick={() => flow.push('TC1_Screen2', {})}>Go to Screen 2</button>
            <button onClick={() => flow.pop()}>Back</button>
        </div>
    );
};

export const TC1_Screen2 = () => {
    const flow = useFlow();
    const stack = useStack();
    return (
        <div data-testid="tc1-screen2">
            <h2>TC1: Screen 2</h2>
            <button onClick={() => {
                const stackSize = stack.activities.length;
                for (let i = 0; i < stackSize - 1; i++) {
                    flow.pop();
                }
            }}>Reset to Home</button>
            <button onClick={() => flow.pop()}>Back</button>
        </div>
    );
};

export const TC2_ListScreen = () => {
    const flow = useFlow();
    return (
        <div data-testid="tc2-list-screen">
            <h2>TC2: List Screen</h2>
            <button onClick={() => flow.push('TC2_DetailScreen', { id: '1' })}>Go to Detail 1</button>
        </div>
    );
};

export const TC2_DetailScreen = () => {
    const flow = useFlow();
    const stack = useStack();
    const activity = useActivity();
    const params = activity.params as { id: string };
    const id = params.id;
    const nextId = parseInt(id, 10) + 1;

    return (
        <div data-testid={`tc2-detail-screen-${id}`}>
            <h2>TC2: Detail Screen {id}</h2>
            <p>Content for item {id}.</p>
            <button onClick={() => flow.push('TC2_DetailScreen', { id: nextId.toString() })}>Go to Detail {nextId}</button>
            <button onClick={() => {
                const { activities } = stack;
                
                const targetIndex = activities.findLastIndex(
                    (act: Activity) => act.name === 'TC2_ListScreen',
                );

                if (targetIndex !== -1) {
                    const popsToPerform = (activities.length - 1) - targetIndex;
                    
                    if (popsToPerform > 0) {
                        for (let i = 0; i < popsToPerform; i++) {
                            flow.pop();
                        }
                    }
                }
            }}>Back to List</button>
            <button onClick={() => flow.pop()}>Back</button>
        </div>
    );
};

export const TC3_Step1Screen = () => {
    const flow = useFlow();
    return (
        <div data-testid="tc3-step1-screen">
            <h2>TC3: Step 1</h2>
            <button onClick={() => flow.push('TC3_Step2Screen', {})}>Next</button>
        </div>
    );
};

export const TC3_Step2Screen = () => {
    const flow = useFlow();
    return (
        <div data-testid="tc3-step2-screen">
            <h2>TC3: Step 2</h2>
            <button onClick={() => flow.push('TC3_Step3Screen', {})}>Next</button>
            <button onClick={() => flow.pop()}>Prev</button>
        </div>
    );
};

export const TC3_Step3Screen = () => {
    const flow = useFlow();
    return (
        <div data-testid="tc3-step3-screen">
            <h2>TC3: Step 3</h2>
            <button onClick={() => {
                // Pop Step3, Step2, and Step1
                flow.pop();
                flow.pop();
                flow.pop();
            }}>Finish</button>
            <button onClick={() => flow.pop()}>Prev</button>
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

export function Article({ id }: { id: string }) {
  const { pop } = useTabNavigation();
  return (
    <div>
      <h2>Article {id}</h2>
      <p>This is the article content.</p>
      <button onClick={pop}>Back</button>
    </div>
  );
};

// --- TC05: Push Notification Navigation ---

export const ArticleScreen = () => {
  const { params } = useActivity();
  const flow = useFlow();
  const id = (params as { id: string }).id ?? 'N/A';

  return (
    <div>
      <h2>Article {id}</h2>
      <p>This is the article content, accessed via push.</p>
      <button onClick={() => flow.pop()}>Back</button>
    </div>
  );
};

// --- TC06: Modal and Stack Relationship ---

export const TC06_HomeScreen = () => {
  const flow = useFlow();
  return (
    <div>
      <h2>TC06: Modal Home</h2>
      <button onClick={() => flow.push('TC06_ModalScreen', {})}>Open Modal</button>
    </div>
  );
};

export const TC06_ModalScreen = () => {
  const flow = useFlow();
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h2>Modal Screen</h2>
        <p>This is a modal.</p>
        <button onClick={() => flow.push('DetailScreen', { id: 'fromModal' })}>Push Detail from Modal</button>
        <button onClick={() => flow.pop()} style={{ marginLeft: '0.5rem' }}>Close</button>
      </div>
    </div>
  );
};
