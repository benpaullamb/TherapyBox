import React, { Component } from 'react';
import DashCard from '../components/DashCard.jsx';

export default class NewsCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            snippet: ''
        };

        this.abortController = new AbortController();
    }

    async componentDidMount() {
        try {
            const res = await fetch('/api/news', {
                signal: this.abortController.signal
            });
            const json = await res.json();
            this.setState({
                ...json
            });
        } catch(err) {
        }
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <DashCard title="News" link="/news">
                <span className="news-card__title">{this.state.title}</span>
                <p className="news-card__snippet">{this.state.snippet}</p>
            </DashCard>
        );
    }
}