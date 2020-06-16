import React from 'react';
import BackButton from '../components/atoms/Back'
import File from "../components/organisms/Card-resent.jsx";


const Start = () => {
    return (
        <div className="container">
            <div className="recent">
                <div className="recent__content-wrapper">
                    <div className="recent__head-wrapper">

                        <div className="title">
                            <h1>Recent geopende weergave</h1>
                        </div>
                    </div>

                    <BackButton />

                    <div className="files">

                        <input type='search' placeholder="zoeken"></input>
                        
                        <File />

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Start