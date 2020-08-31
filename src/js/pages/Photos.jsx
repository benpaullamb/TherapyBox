import React, { Component } from 'react';
import PlusImage from '../../images/Plus_button.png';
import { loadPhotos, savePhoto } from '../utils';

export default class Photos extends Component {

    constructor(props) {
        super(props);

        this.state = {
            images: []
        };

        this.inputRef = React.createRef();
        this.abortController = new AbortController();
    }

    componentDidMount() {
        this.loadPhotos();
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <div className="photos">
                <h1 className="title photos__title">Photos</h1>

                <input type="file" accept="image/*" name="photo" className="photos__input"
                    ref={this.inputRef} onChange={() => this.savePhoto()} />
                
                <div className="photos__main">
                    <div className="photos__photo" onClick={() => this.openFilePicker()}>
                        <img src={PlusImage} alt="" className="photos__add"/>
                    </div>
                    <div className="photos__photo">
                        {
                            this.state.images.length > 0 &&
                            <img src={this.state.images[0]} alt=""/>
                        }
                    </div>
                    <div className="photos__photo">
                        {
                            this.state.images.length > 1 &&
                            <img src={this.state.images[1]} alt=""/>
                        }
                    </div>
                    <div className="photos__photo">
                        {
                            this.state.images.length > 2 &&
                            <img src={this.state.images[2]} alt=""/>
                        }
                    </div>
                    <div className="photos__photo">
                        {
                            this.state.images.length > 3 &&
                            <img src={this.state.images[3]} alt=""/>
                        }
                    </div>
                    <div className="photos__photo">
                        {
                            this.state.images.length > 4 &&
                            <img src={this.state.images[4]} alt=""/>
                        }
                    </div>
                </div>
            </div>
        );
    }

    async loadPhotos() {
        const urls = await loadPhotos(this.abortController.signal);
        
        this.setState({
            images: urls.slice(0, 5)
        });
    }

    openFilePicker() {
        this.inputRef.current.click();
    }
    
    async savePhoto() {
        await savePhoto(this.inputRef.current.files[0]);

        // const formData = new FormData();
        // formData.append('photo', this.inputRef.current.files[0]);

        // await fetch('/api/photo/upload', {
        //     method: 'POST',
        //     body: formData
        // });

        this.loadPhotos();
    }
}