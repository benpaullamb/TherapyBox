import React, { Component } from 'react';
import PlusImage from '../../images/Plus_button.png';

export default class Photos extends Component {

    render() {
        return (
            <div className="photos">
                <h1 className="title photos__title">Photos</h1>
                
                <div className="photos__main">
                    <div className="photos__photo">
                        <img src={PlusImage} alt="" className="photos__add"/>
                    </div>
                    <div className="photos__photo"></div>
                    <div className="photos__photo"></div>
                    <div className="photos__photo"></div>
                    <div className="photos__photo"></div>
                    <div className="photos__photo"></div>
                </div>
            </div>
        );
    }
}