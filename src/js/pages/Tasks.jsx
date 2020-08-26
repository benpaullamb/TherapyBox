import React, { Component } from 'react';
import PlusImage from '../../images/Plus_button_small.png';
import Task from '../components/Task.jsx';

export default class Tasks extends Component {

    render() {
        return (
            <div className="tasks">
                <h1 className="title tasks__title">Tasks</h1>

                <div className="tasks__container">
                    <div className="tasks__list">
                        <Task/>
                        <Task/>

                        <img src={PlusImage} alt="" className="tasks__add"/>
                    </div>
                </div>
            </div>
        );
    }
}