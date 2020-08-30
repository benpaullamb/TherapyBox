import React, { Component } from 'react';
import DashCard from '../components/DashCard.jsx';
import { loadPhotos } from '../utils';

export default class PhotosCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            images: []
        };

        this.abortController = new AbortController();
    }

    async componentDidMount() {
        try {
            const urls = await loadPhotos(this.abortController.signal);

            this.setState({
                images: urls
            });
        } catch(err) {
            
        }
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <DashCard title="Photos" link="/photos">
                <div className="photos-card">
                    <div className="photos-card__box">
                        {
                            this.state.images.length > 0 &&
                            <img src={this.state.images[0]} alt="" className="photos-card__image"/>
                        }
                    </div>
                    <div className="photos-card__box">
                        {
                            this.state.images.length > 1 &&
                            <img src={this.state.images[1]} alt="" className="photos-card__image"/>
                        }
                    </div>
                    <div className="photos-card__box">
                        {
                            this.state.images.length > 2 &&
                            <img src={this.state.images[2]} alt="" className="photos-card__image"/>
                        }
                    </div>
                    <div className="photos-card__box">
                        {
                            this.state.images.length > 3 &&
                            <img src={this.state.images[3]} alt="" className="photos-card__image"/>
                        }
                    </div>
                </div>
            </DashCard>
        );
    }
}