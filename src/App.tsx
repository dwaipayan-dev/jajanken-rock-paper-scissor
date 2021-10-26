import React from 'react';
import logo from './logo.svg';
import './App.css';
import Game from './component/Game'
import Welcome from './component/Welcome';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
              <Route exact path='/' component={Welcome}></Route>
              <Route exact path='/game/:name' component={Game}></Route>
            </Switch>
      </div>
    </Router>
    
  );
}

export default App;
