import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class DashCard extends Component {

    render() {
        return (
            <Link to={this.props.link} className="card">
                <span className="card__title">{this.props.title}</span>
                <div className="card__body">
                    {this.props.children}
                </div>
            </Link>
        );
    }
}