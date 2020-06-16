import React from 'react';

import DicomHip from '../../images/dicom-pelvic.jpg'

import { Link } from 'react-router-dom';

const DicomFile = (props) => {
    return (
        <Link to='/interactive'>
            <div className="dicom-file">
                <div className='image'>
                    <img src= {DicomHip}></img>
                </div>
                <div className="file-name">
                    <strong>Bestand:</strong>
                    <h2>Pelvic.dicom</h2>
                </div>
            </div>
        </Link>
    )
};

export default DicomFile;