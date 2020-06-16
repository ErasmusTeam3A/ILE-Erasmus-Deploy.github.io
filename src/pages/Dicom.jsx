import React from 'react';
import File from "../components/organisms/Dicom-file.jsx";
import BackButton from '../components/atoms/Back'

const Dicom = () => {
    return (
        <div className="container">
            <div className="dicom">
                <div className="dicom__content-wrapper">
                    <div className="dicom__head-wrapper">

                        <div className="title">
                            <h1>Selecteer DICOM</h1>
                        </div>

                        <BackButton />
                        
                    </div>

                    <div className="files">

                        <File />

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dicom