import React from 'react';
import { ThemeProvider } from 'styled-components';

import { Theme, GlobalStyle } from '../styles';
import Main from './Main';


const App: React.FC<{}> = ({ }) => {
  return (
    <ThemeProvider theme={Theme}>
      <GlobalStyle />
      <Main></Main>
    </ThemeProvider>
  );
}

export default App;
