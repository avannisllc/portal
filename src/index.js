import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Router} from 'react-router-dom';
import {AuthProvider} from './Context/AuthContext';
import {FileShareProvider} from './Context/FileShareContext';
import {CustmrsProvider} from './Context/CustmrsContext';
import {UnsubProvider} from './Context/UnsubContext';
import { HRProvider } from './Context/HRContext';
import { IntializeAxios } from './Utils/Utils';
import history from './history';

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
    <AuthProvider>
        <IntializeAxios/>
        <FileShareProvider>
          <CustmrsProvider>
            <UnsubProvider>
              <HRProvider>
                <App/>
              </HRProvider>
            </UnsubProvider>
          </CustmrsProvider>
        </FileShareProvider>
    </AuthProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
