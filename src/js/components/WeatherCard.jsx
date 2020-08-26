import React, { Component } from 'react';
import DashCard from './DashCard.jsx';

import SunImage from '../../images/Sun_icon.png';
import CloudImage from '../../images/Clouds_icon.png';
import RainImage from '../../images/Rain_icon.png';

export default class WeatherCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            city: '',
            temp: 0,
            condition: ''
        };

        this.abortController = new AbortController();
    }

    async componentDidMount() {
        const location = await this.getLocation();
        await this.loadWeather(location);
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <DashCard title="Weather" link="/">
                <div className="weather">
                    <div className="weather__top">
                        <img src={this.getWeatherIcon()} alt="" className="weather__icon"/>
                        <span className="weather__temp">{this.state.temp} degrees</span>
                    </div>
                    <span className="weather__location">{this.state.city}</span>
                </div>
            </DashCard>
        );
    }

    getLocation() {
        return new Promise((res, rej) => {
            navigator.geolocation.getCurrentPosition(pos => {
                const { latitude, longitude } = pos.coords;
                const location = {
                    lat: latitude,
                    lon: longitude
                };
                res(location);
            }, err => rej(err));
        });
    }

    async loadWeather(location) {
        try {
            const res = await fetch(`/api/weather?lat=${location.lat}&lon=${location.lon}`, {
                signal: this.abortController.signal
            });
            const weather = await res.json();
            this.setState({
                ...weather
            });
        } catch(err) {
        }
    }

    getWeatherIcon() {
        let weatherIcon = SunImage;
        switch(this.state.condition) {
            case 'Clear':
                weatherIcon = SunImage;
                break;
            case 'Clouds':
                weatherIcon = CloudImage;
                break;
            case 'Rain':
                weatherIcon = RainImage;
                break;
        }
        return weatherIcon;
    }
}