import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        };
    }

    render() {
        return (
            <div className="login">
                <div className="login__main">
                    <h1 className="title login__title">Hackathon</h1>

                    <div className="login__details">
                        <input type="text" className="input login__input" placeholder="Username"
                            value={this.state.username} onChange={e => this.setState({username: e.target.value})}/>
                        <input type="password" className="input login__input" placeholder="Password"
                            value={this.state.password} onChange={e => this.setState({password: e.target.value})}
                            onKeyDown={({key}) => this.onEnter(key)}/>
                    </div>

                    <div className="login__buttons">
                        <button onClick={() => this.login()} className="button login__button">Login</button>
                    </div>
                </div>

                <footer className="login__footer">
                    <span className="login__text">
                        New to the hackathon?
                        <Link to="/register" className="login__sign-up"> Sign up</Link>
                    </span>
                </footer>
            </div>
        );
    }

    async login() {
        if(this.state.username.trim() === '' || this.state.password.trim() === '') return;

        try {
            const res = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            });
            const json = await res.json();
    
            if(json.success && this.props.onLogIn) this.props.onLogIn();
        } catch(err) {
            console.log('Incorrect username/password');
        }
    }

    onEnter(key) {
        if(key === 'Enter') this.login();
    }
}