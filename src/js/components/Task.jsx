import React, { Component } from 'react';

export default class Task extends Component {

    render() {
        const inputClass = this.props.small ? 'input--small' : 'input';
        const checkboxClass = this.props.small ? 'task__check--small' : 'task__check';

        return (
            <div className="task">
                <input type="text" className={`${inputClass} task__input`} placeholder="Task"
                    value={this.props.description} onChange={e => this.onDescriptionChange(e.target.value)}
                    readOnly={this.props.small}/>
                <input type="checkbox" className={checkboxClass} 
                    checked={this.props.isComplete} onChange={e => this.onCompleteChange(e.target.checked)}
                    readOnly={this.props.small}/>
            </div>
        );
    }

    onDescriptionChange(description) {
        if(this.props.onDescriptionChange) this.props.onDescriptionChange(description);
    }

    onCompleteChange(isComplete) {
        if(this.props.onCompleteChange) this.props.onCompleteChange(isComplete);
    }
}