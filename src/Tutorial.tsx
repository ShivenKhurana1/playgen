import { ReactElement } from 'react';

export interface TutorialInfo {
  title: string;
  content: ReactElement;
  closeText: string;
}

export function Tutorial(props: { closeTutorial: () => void; tutorialInfo: TutorialInfo }) {
  return (
    <>
      {props.tutorialInfo.content}
      <button onClick={props.closeTutorial}>{props.tutorialInfo.closeText}</button>
    </>
  );
}
