import React, { Component } from 'react';
import DashCard from '../components/DashCard.jsx';

export default class SportCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            snippet: ''
        };

        this.abortController = new AbortController();
    }

    async componentDidMount() {
        let match;
        try {
            const res = await fetch('/api/sport/random', {
                signal: this.abortController.signal
            });
            match = await res.json();
        } catch(err) {
            return;
        }

        let title = '', snippet = '';
        if(match.result === 'H') {
            title = `${match.homeTeam} beat ${match.awayTeam}`;
            snippet = `${match.homeTeam} did very well. They scored ${match.homeGoals} goal${match.homeGoals === 1 ? '' : 's'}.`;
        } else if(match.result === 'A') {
            title = `${match.awayTeam} beat ${match.homeTeam}`;
            snippet = `${match.awayTeam} did very well. They scored ${match.awayGoals} goal${match.awayGoals === 1 ? '' : 's'}.`;
        } else {
            title = `${match.homeTeam} drew against ${match.awayTeam}`;
            snippet = `Both teams did OK. They each scored ${match.homeGoals} goal${match.homeGoals === 1 ? '' : 's'}.`;
        }

        this.setState({
            title,
            snippet
        });
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <DashCard title="Sport" link="/sport">
                <span className="sport-card__title">{this.state.title}</span>
                <p className="sport-card__snippet">{this.state.snippet}</p>
            </DashCard>
        );
    }
}