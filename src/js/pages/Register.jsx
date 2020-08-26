import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            confirmPass: '',
            email: '',
            registered: false
        };
    }

    render() {
        return (
            <div className="register">
                { this.state.registered && <Redirect to="/login"/> }
                <h1 className="title register__title">Hackathon</h1>

                <div className="register__details">
                    <div className="register__grid">
                        <input type="text" className="input register__input" placeholder="Username"
                            value={this.state.username} onChange={e => this.setState({ username: e.target.value })}/>
                        <input type="email" className="input register__input" placeholder="Email"
                            value={this.state.email} onChange={e => this.setState({ email: e.target.value })}/>
                        <input type="password" className="input register__input" placeholder="Password"
                            value={this.state.password} onChange={e => this.setState({ password: e.target.value })}/>
                        <input type="password" className="input register__input" placeholder="Confirm Password"
                            value={this.state.confirmPass} onChange={e => this.setState({ confirmPass: e.target.value })}/>
                    </div>
                </div>

                <div className="register__images">
                    <div className="register__pic">
                        <span className="register__text">Add picture</span>
                    </div>
                </div>

                <div className="register__buttons">
                    <button onClick={() => this.register()} className="button register__button">Register</button>
                </div>
            </div>
        );
    }

    async register() {
        if(this.state.username.trim() === '' || this.state.password.trim() === '' || 
            this.state.email.trim() === '' || this.state.confirmPass.trim() === '') return;

        if(this.state.password !== this.state.confirmPass) return;

        const res = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                email: this.state.email
            })
        });
        const json = await res.json();

        if(json.success) {
            this.setState({
                registered: true
            });
        } 
    }
}