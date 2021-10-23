import './App.css';
import { ClientProvider } from './client/client';
import LoginStateComponent from './components/LoginStateComponent';

function App() {
  return (
    <div className='App'>
      {/* <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className='App-link' href='https://reactjs.org' target='_blank' rel='noopener noreferrer'>
          Learn React
        </a>
      </header> */}
      <ClientProvider>
        <LoginStateComponent />
        {/* <ChangeLoginStateComponent /> */}
      </ClientProvider>
    </div>
  );
}

export default App;
