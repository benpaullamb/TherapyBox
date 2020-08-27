import React, { Component } from 'react';
import DashCard from '../components/DashCard.jsx';
import Task from '../components/Task.jsx';

export default class TasksCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tasks: []
        };

        this.abortController = new AbortController();
    }

    async componentDidMount() {
        try {
            const res = await fetch('/api/tasks', {
                signal: this.abortController.signal
            });
            const tasks = await res.json();
            this.setState({
                tasks: tasks.slice(0, 3)
            });
        } catch(err) {
            
        }
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <DashCard title="Tasks" link="/tasks">
                <div className="tasks-card">
                    {
                        this.state.tasks.map((task, i) => {
                            return (
                                <Task key={`Task ${i + 1}`}
                                    description={this.state.tasks[i].description}
                                    isComplete={this.state.tasks[i].isComplete}
                                    small/>
                            );
                        })
                    }
                </div>
            </DashCard>
        );
    }
}