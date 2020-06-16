import React from 'react';
import Model from '../components/organisms/Model';
import ControllerTest from '../components/organisms/ControllerTest';

import Back from '../components/atoms/Back';
import Button from '../components/atoms/Button';
import Collapsible from 'react-collapsible';
import { Link } from 'react-router-dom';
// import Modal from 'react-bootstrap/Modal'
import Modal from '../components/organisms/Modal'
import data1 from '../data/data.json'
import data2 from '../data/data2.json'
import data from '../data/data.json'
import BackButton from '../components/atoms/Back'

class Interactive extends React.Component {
    constructor() {
        super();
        this.state = {
            zoomInPelvicFloor: false,
            zoomInCompartmentUterus: false,
            filterNames: ["skin", "bones"],
            selectedFilter: 0,
            isHidden: true,
            connected: false,
            show: false,
            data: data1,
            currentData: 0
        }
        this.toggleHidden = this.toggleHidden.bind(this)
    }

    showModal = e => {
        this.setState({
            show: !this.state.show
        });
    };

    toggleHidden(param) {
        switch(param) {
            case "x":
                if(this.state.currentData == 1){
                    this.setState(prevState => ({ isHidden: !prevState.isHidden }));
                }
                else{
                    this.setState({isHidden: false, data: data2, currentData: 1});
                }
                // code block
                break;
            case "y":
                if(this.state.currentData == 2){
                    this.setState(prevState => ({ isHidden: !prevState.isHidden }));
                }
                else{
                    this.setState({isHidden: false, data: data1, currentData: 2});
                }
                break;
        }
    };

    zoomInPelvicFloor = () => {
        this.toggleHidden("x");
        this.setState({ zoomInPelvicFloor: !this.state.zoomInPelvicFloor });
    }

    zoomInCompartmentUterus = () => {
        this.toggleHidden("y");
        this.setState({ zoomInCompartmentUterus:  !this.state.zoomInCompartmentUterus });
    }

    connectController = () => {
      this.setState({
         connected: !this.state.connected
       });
    }

    switchFilter = () => {

     this.setState({
        selectedFilter: (this.state.selectedFilter + 1) % this.state.filterNames.length
      });

    }

    render() {
        const { isHidden } = this.state;
      return (
          <div className="container" >
                <div className="interactive">
                    <div className="interactive__heading">
                        <h2><span>Weergave van:</span><br />
                            Compartimenten Baarmoeder
                        </h2>
                    </div>
                    <BackButton />
                    <div className="interactive__menu">
                        <div className="interactive__menu-heading">
                            <h3>Menu</h3>
                        </div>
                        <Collapsible transitionTime={300} classParentString="collaps" trigger="Onder Lichaam">
                            <Collapsible transitionTime={300} classParentString="collaps" trigger="Bekken">
                                <ul>
                                    <li onClick={this.zoomInPelvicFloor}>Bekkenbodem</li>
                                    <li onClick={this.zoomInCompartmentUterus}>Compartiment baarmoeder</li>
                                </ul>
                            </Collapsible>
                            <Collapsible transitionTime={300} classParentString="collaps" trigger="Bovenbenen">
                                <ul>
                                    <li>Ligamenten baarmoeder</li>
                                </ul>
                            </Collapsible>
                            <Collapsible transitionTime={300} classParentString="collaps" trigger="Voeten">
                                <ul>
                                    <li>Uturus</li>
                                </ul>
                            </Collapsible>

                        </Collapsible>
                        <div className="interactive__menu-filter">
                            {/* <Button link="#" className="button button-side-left" text="filter"></Button> */}
                            <button className="button button-side-left" onClick={this.switchFilter}> Change filter </button>

                            <button className="button button-side-left" onClick={this.connectController}> Connect </button>

                        </div>
                    </div>
                    <div className="interactive__side-menu">
                        <button className={`button button-side-right ${isHidden ? " hidden" : ""}`} id="centered-toggle-button" onClick={e => {this.showModal(e);}}>
                            {/* {" "} */}
                        Toon theorie{" "}
                        </button>
                    </div>
                    <Modal onClose={this.showModal} show={this.state.show} content={this.state.data}/>
                    {/* <button className="interactive__filter-button" onClick={this.switchFilter}> Change filter </button> */}
                    {/* <Back /> */}
                    {/* hier moet het model komen in plaats van <Model/>*/}
                    <Model zoomInPelvicFloor={this.state.zoomInPelvicFloor} zoomInCompartmentUterus={this.state.zoomInCompartmentUterus} selectedFilter={this.state.selectedFilter} gltfName={this.state.gltfName} connected={this.state.connected} />
                    {/* <ControllerTest connected={this.state.connected} /> */}
                </div>
            </div>
      )
    }

}

export default Interactive;
