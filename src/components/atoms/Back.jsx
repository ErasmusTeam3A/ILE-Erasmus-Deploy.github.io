import React from 'react';
import undo from '../../images/undo.png'

import { useHistory } from "react-router-dom";

const Back = () => {
    let history = useHistory();
    return (
        <button className="back" onClick={() => history.goBack()}>
            <img src={undo} alt='undo'></img>
        </button>
    )
};

export default Back;
