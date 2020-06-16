import React from 'react';
import { Link } from 'react-router-dom';

const Button = (props) => {
    return (
        <Link to={props.link}>
            <button disabled={props.disabled} onClick={props.onClick} className="button">
                {props.text}
            </button>
        </Link>
    )
};

export default Button;
