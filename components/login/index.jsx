import Login from './Login';
import LoginPage from './LoginPage';
import LoginMask from './LoginMask';

Login.install = (app) => {
  app.component(Login.name, Login);
  app.component(LoginPage.name, LoginPage);
  app.component(LoginMask.name, LoginMask);
};

export { LoginPage, LoginMask };

export default Login;