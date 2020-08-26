import React, { Component } from 'react';

export default class News extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            content: ''
        };
    }

    async componentDidMount() {
        const res = await fetch('/api/news');
        const json = await res.json();
        
        this.setState({
            ...json
        });
    }

    render() {
        return (
            <div className="news">
                <h1 className="title news__title">News</h1>

                <div className="news__top">
                    <img src="" alt="" className="news__image"/>
                </div>

                <span className="news__headline">{this.state.title}</span>

                <p className="news__content">{this.state.content}</p>
            </div>
        );
    }
}