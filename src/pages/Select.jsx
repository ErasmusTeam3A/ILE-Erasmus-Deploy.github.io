import React from 'react';
import Button from '../components/atoms/Button';
import BackButton from '../components/atoms/Back'


class Select extends React.Component{
    constructor(){
        super()
        this.state = {
            active: false,
            image: "human",
            toggleImage:false
        }
    }

toggleBox = () => {
  this.setState(prevState => ({ toggleImage: !prevState.toggleImage }));
};

    render() {
        const { toggleImage } = this.state;
    return (
        <div className="container">
            <div className="select">
                <div className="select__content-wrapper">
                    <div className="select__head-wrapper">

                        <div className="title">
                            <h1>Selecteer lichaamsdeel</h1>
                        </div>

                        <BackButton />

                        <div className="text">
                            <p>Klik op het lichaam om <br /> een interactieve weergave te openen van dit onderdeel</p>
                        </div>
                    </div>

                    <div className="silhouette">
                        <div onClick={this.toggleBox} className={`silhouette-image ${toggleImage ? " hip" : " body"}`}>
                    </div>

                    </div>
                    <div className="start__button-container">
                        <div className="start__button-wrapper">
                            <Button link="/interactive" text="Start" disabled={toggleImage ? false : true} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )}
}

export default Select;