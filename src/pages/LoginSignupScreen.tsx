import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import LoginScreen from './loginsignupscreen/LoginScreen';
import SignupScreen from './loginsignupscreen/SignupScreen';

export default function LoginSignupScreen() {
  return (
    <div className='bg-theme min-vh-100 min-vw-100 d-flex align-items-center'>
      <div id='login-signup-wrapper' className='bg-theme-darker w-25 h-50 m-auto rounded-lg p-5 text-white '>
        <BrowserRouter>
          <Switch>
            <Route path='/login'>
              <LoginScreen></LoginScreen>
            </Route>
            <Route path='/register'>
              <SignupScreen></SignupScreen>
            </Route>
            <Route path='/'>
              <Redirect to='/login'></Redirect>
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
}
