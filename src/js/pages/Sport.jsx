import React, { Component } from 'react';

export default class Sport extends Component {

    constructor(props) {
        super(props);

        this.state = {
            team: '',
            beatenTeams: []
        };
    }

    render() {
        let searchResult;
        if(this.state.beatenTeams.length > 0) {
            searchResult = this.state.beatenTeams.map(team => {
                return (
                    <span key={team} className="sport__team">{team}</span>
                );
            });
        } else {
            searchResult = <span className="sport__team">No teams found</span>;
        }

        return (
            <div className="sport">
                <h1 className="title sport__title">Sport</h1>
                
                <div className="sport__inputs">
                    <input type="text" className="sport__input" placeholder="Input team name" 
                        value={this.state.team}
                        onChange={e => this.setState({ team: e.target.value })}
                        onKeyDown={({key}) => this.onEnterTeam(key)}/>
                </div>

                <div className="sport__teams">
                    { searchResult }
                </div>
            </div>
        );
    }

    async onEnterTeam(key) {
        if(key !== 'Enter') return;

        const res = await fetch(`/api/sport/beaten-teams?team=${this.state.team}`);
        const beatenTeams = await res.json();

        this.setState({
            beatenTeams
        });
    }
}