import React, { Component } from 'react';

export default class Task extends Component {

    render() {
        return (
            <div className="task">
                <input type="text" className="input task__input" placeholder="Task"/>
                <input type="checkbox" className="task__check"/>
            </div>
        );
    }
}