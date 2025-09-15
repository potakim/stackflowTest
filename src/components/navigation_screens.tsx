import React from 'react';
import { useActivity, useStack } from '@stackflow/react';
import type { Activity } from '@stackflow/core';
import { useFlow } from '../stackflow/stack';

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

export const MainTabs = () => {
  const flow = useFlow();
  const { name } = useActivity();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {name === 'HomeTab' && <HomeTab />}
        {name === 'SearchTab' && <SearchTab />}
        {name === 'ProfileTab' && <ProfileTab />}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #ccc', padding: '10px 0' }}>
        <button onClick={() => flow.replace('HomeTab', {})}>Home</button>
        <button onClick={() => flow.replace('SearchTab', {})}>Search</button>
        <button onClick={() => flow.replace('ProfileTab', {})}>Profile</button>
      </div>
    </div>
  );
};

export const HomeTab = () => {
  const flow = useFlow();
  return (
    <div>
      <h2>Home Tab</h2>
      <button onClick={() => flow.push('Article', { id: '1' })}>View Article 1</button>
    </div>
  );
};

export const SearchTab = () => {
  const flow = useFlow();
  return (
    <div>
      <h2>Search Tab</h2>
      <button onClick={() => flow.push('Article', { id: '2' })}>View Article 2</button>
    </div>
  );
};

export const ProfileTab = () => {
  const flow = useFlow();
  return (
    <div>
      <h2>Profile Tab</h2>
      <button onClick={() => flow.push('Article', { id: '3' })}>View Article 3</button>
    </div>
  );
};

export const Article = () => {
  const { params } = useActivity();
  const flow = useFlow();
  return (
    <div>
      <h2>Article {(params as { id: string }).id}</h2>
      <p>This is the article content.</p>
      <button onClick={() => flow.pop()}>Back</button>
    </div>
  );
};
