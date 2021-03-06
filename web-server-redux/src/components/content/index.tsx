import * as React from 'react';

interface IContentProps extends React.Props<any> {
  isVisible: boolean;
  style?: Object;
};

export default function Content({ children = null, isVisible }: IContentProps) {
  return (
    <main className="mt4 mb4 ml4 mr4">
      { isVisible ? children : null }
    </main>
  );
}
