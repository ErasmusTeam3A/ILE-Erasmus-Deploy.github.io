import React from "react";
import PropTypes from "prop-types";

export default class Modal extends React.Component {
    onClose = e => {
        this.props.onClose && this.props.onClose(e);
    };

    render() {
        if (!this.props.show) {
            return null;
        }
        return (
            <div className="modal-bg">
                <div className="modal" id="modal">
                    <h2>{this.props.content[0]}</h2>
                    <button className="toggle-button" onClick={this.onClose}>

                    </button>
                    <div className="content">
                        <div className="content-left">
                            <h4>{this.props.content[1][0]}</h4>
                            <p>{this.props.content[2][0]}</p>
                            <h4>{this.props.content[1][1]}</h4>
                            <p>{this.props.content[2][1]}</p>
                        </div>
                        <div className="content-right">
                        <h4>{this.props.content[2][2]}</h4>
                        <ul className="content-ul">
                             {this.props.content[3].map(content => (
                                <li className="content-li">
                                    {content}
                                </li>
                            ))}
                            {/* <li>{this.props.content[3][1]}</li>
                            <li>{this.props.content[3][2]}</li>
                            <li>{this.props.content[3][3]}</li>
                            <li>{this.props.content[3][4]}</li>
                            <li>{this.props.content[3][5]}</li>
                            <li>{this.props.content[3][6]}</li>
                            <li>{this.props.content[3][7]}</li>
                            <li>{this.props.content[3][8]}</li>
                            <li>{this.props.content[3][9]}</li>
                            <li>{this.props.content[3][10]}</li>
                            <li>{this.props.content[3][11]}</li> */}
                        </ul>
                    </div>
                    </div>
                    
                </div>
            </div>
        );
    }
}
Modal.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
};
