import React, { Component } from 'react';
import PlusImage from '../../images/Plus_button.png';

export default class Photos extends Component {

    constructor(props) {
        super(props);

        this.state = {
            images: []
        };

        this.formRef = React.createRef();
        this.inputRef = React.createRef();
    }

    componentDidMount() {
        this.loadPhotos();
    }

    render() {
        return (
            <div className="photos">
                <h1 className="title photos__title">Photos</h1>

                <form action="/api/photo/upload" method="post" encType="multipart/form-data" 
                    ref={this.formRef} onSubmit={e => this.onSubmit(e)} className="photos__form">

                    <input type="file" accept="image/*" name="photo" className="photos__input"
                        ref={this.inputRef} onChange={() => this.savePhoto()} />
                </form>
                
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
                    <div className="photos__photo"></div>
                    <div className="photos__photo"></div>
                    <div className="photos__photo"></div>
                </div>
            </div>
        );
    }

    async loadPhotos() {
        const countRes = await fetch('/api/photo/count');
        const {count: photoCount} = await countRes.json();
        console.log(photoCount);

        const urls = [];

        for(let i = 0; i < photoCount; ++i) {
            const photoRes = await fetch(`/api/photo?i=${i}`);

            const arrayBuffer = await photoRes.arrayBuffer();
            const blob = new Blob([arrayBuffer]);
            const url = window.URL.createObjectURL(blob);
            urls.push(url);
        }
        
        this.setState({
            images: urls
        });
    }

    openFilePicker() {
        this.inputRef.current.click();
    }
    
    async savePhoto() {
        this.formRef.current.submit();
    }

    onSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
    }
}