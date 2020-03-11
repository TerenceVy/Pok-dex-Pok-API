import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Pokemon from "./components/pokemon/Pokemon";
import Dashboard from "./components/pokemon/PokemonList";
import NavBar from "./components/IndexNavbar"

import { HashRouter as Router, Route,Switch } from 'react-router-dom';

class App extends Component {
  render() {
      return(
          <Router>
              <div className="App">
			  <NavBar />
                <div className="container">
                    <Switch>
						<Route exact path="/" component={Dashboard}/>
						<Route exact path="/:pokemonIndex" component={Dashboard}/>
                    </Switch>
                </div>
              </div>
          </Router>
      );
  }
}

export default App;
