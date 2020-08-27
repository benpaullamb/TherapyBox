import React, { Component } from 'react';
import PlusImage from '../../images/Plus_button_small.png';
import Task from '../components/Task.jsx';

export default class Tasks extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tasks: [
                {
                    description: '',
                    isComplete: false
                }
            ]
        };
    }

    async componentDidMount() {
        const res = await fetch('/api/tasks');
        const tasks = await res.json();
        this.setState({
            tasks
        });
    }

    render() {
        return (
            <div className="tasks">
                <h1 className="title tasks__title">Tasks</h1>

                <div className="tasks__container">
                    <div className="tasks__list">
                        {
                            this.state.tasks.map((task, i) => {
                                return (
                                    <Task key={`Task ${i + 1}`}
                                        description={this.state.tasks[i].description}
                                        onDescriptionChange={description => this.setDescription(i, description)}
                                        isComplete={this.state.tasks[i].isComplete}
                                        onCompleteChange={isComplete => this.setIsComplete(i, isComplete)}/>
                                );
                            })
                        }

                        <img src={PlusImage} alt="" className="tasks__add" onClick={() => this.addTask()}/>
                    </div>
                </div>
            </div>
        );
    }

    addTask() {
        this.setState(state => {
            return {
                tasks: [
                    ...state.tasks,
                    {
                        description: '',
                        isComplete: false
                    }
                ]
            };
        });
    }

    setDescription(taskIndex, description) {
        const tasks = [...this.state.tasks];
        tasks[taskIndex].description = description;
        this.setState({
            tasks
        });
    }

    setIsComplete(taskIndex, isComplete) {
        const tasks = [...this.state.tasks];
        tasks[taskIndex].isComplete = isComplete;
        this.setState({
            tasks
        });

        console.log(this.state.tasks);
        this.save();
    }

    async save() {
        const res = await fetch('/api/save-tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.tasks)
        });
        const json = await res.json();

        console.log(`Saved: ${json.success}`);
    }
}