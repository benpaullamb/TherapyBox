import React, { Component } from 'react';

import DashCard from '../components/DashCard.jsx';
import WeatherCard from '../components/WeatherCard.jsx';
import NewsCard from '../components/NewsCard.jsx';
import SportCard from '../components/SportCard.jsx';

export default class Home extends Component {

    async componentDidMount() {
        
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

                    <DashCard title="Photos" link="/photos">

                    </DashCard>

                    <DashCard title="Tasks" link="/tasks">

                    </DashCard>
                    
                    <DashCard title="Clothes" link="/">

                    </DashCard>
                </main>
            </div>
        );
    }
}