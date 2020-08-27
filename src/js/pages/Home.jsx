import React, { Component } from 'react';
import { RadialChart } from 'react-vis';

import DashCard from '../components/DashCard.jsx';
import WeatherCard from '../components/WeatherCard.jsx';
import NewsCard from '../components/NewsCard.jsx';
import SportCard from '../components/SportCard.jsx';
import TasksCard from '../components/TasksCard.jsx';

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            clothes: [{angle: 1}]
        };

        this.abortController = new AbortController();
    }

    async componentDidMount() {
        try {
            const res = await fetch('/api/clothes', {
                signal: this.abortController.signal
            });
            const clothes = await res.json();
            
            const data = clothes.map(item => {
                return {
                    label: item.clothe,
                    angle: item.count
                };
            });
            
            this.setState({
                clothes: data
            });
        } catch(err) {

        }
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <div className="home">
                <header className="home__header">
                    <img src="" alt="" className="home__dash"/>
                    <h1 className="title home__title">Good day Swapnil</h1>
                </header>

                <main className="home__main">
                    <WeatherCard/>

                    <NewsCard/>

                    <SportCard/>

                    <DashCard title="Photos" link="/photos"></DashCard>

                    <TasksCard/>
                    
                    <DashCard title="Clothes" link="/">
                        <div className="clothes">
                            <RadialChart data={this.state.clothes} showLabels={true} width={230} height={230}/>
                        </div>
                    </DashCard>
                </main>
            </div>
        );
    }
}