import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../styles/style.scss';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import moment from 'moment';
import anime from 'animejs/lib/anime.es.js';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import News from './pages/News.jsx';
import Sport from './pages/Sport.jsx';
import Tasks from './pages/Tasks.jsx';
import Photos from './pages/Photos.jsx';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: true
        };
    }

    async componentDidMount() {
        const res = await fetch('/auth');
        const json = await res.json();

        this.setState({
            isLoggedIn: json.success
        });
    }

    render() {
        const loginRedirect = !this.state.isLoggedIn ? <Redirect to="/login"/> : null;

        return (
            <Router>
                <div className="main">
                    <Switch>
                        <Route exact path="/">
                            { loginRedirect }
                            <Home/>
                        </Route>
                        <Route path="/login">
                            { this.state.isLoggedIn && <Redirect to="/"/> }
                            <Login onLogIn={() => this.setState({ isLoggedIn: true })}/>
                        </Route>
                        <Route path="/register">
                            <Register/>
                        </Route>
                        <Route path="/news">
                            { loginRedirect }
                            <News/>
                        </Route>
                        <Route path="/sport">
                            { loginRedirect }
                            <Sport/>
                        </Route>
                        <Route path="/tasks">
                            { loginRedirect }
                            <Tasks/>
                        </Route>
                        <Route path="/photos">
                            { loginRedirect }
                            <Photos/>
                        </Route>
                        <Route path="/logout">
                            <Redirect to="/login"/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}

ReactDOM.render(<App/>, document.querySelector('#root'));