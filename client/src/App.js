import {useEffect} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { loadUser } from './Actions/authActions';
import './App.css';
import store from './store';
import {Provider} from 'react-redux';
import Register from './Components/Register';
import Profile from './Components/Profile';
import MainPage from './Components/MainPage';
import LandingPage from './Components/LandingPage';

function App(){
  useEffect(
    ()=>{
      if(localStorage.length)
        store.dispatch(loadUser());
    },
    []
  )
  return (
    <Router>
    <Provider store= {store}>
    <div>
      <Switch>
      <Route exact path = "/" component={ store.getState().auth.token ? MainPage : LandingPage}/>
      <Route exact path="/home"  component={MainPage} />
      <Route exact path="/search"  component={MainPage} />
      <Route exact path="/profile" component={MainPage} />
      <Route exact path="/notifications" component={MainPage} />
      <Route exact path="/profile/:username" component={MainPage}/>
      <Route exact path="/tweet/:id" component={MainPage}/>
      <Route exact path = "/signup" component={Register}/>
      <Route exact path="/set_up_profile" component={Profile}/>
      <Route exact path = "/trends/:hashtag" component={MainPage} />
    </Switch>
    </div>
    </Provider>
    </Router>
  )
}
export default App;
