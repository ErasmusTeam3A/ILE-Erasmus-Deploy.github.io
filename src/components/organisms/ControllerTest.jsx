import React, { useRef } from "react";

class ControllerTest extends React.Component {
    /*
A minimal Web Bluetooth connection example

created 6 Aug 2018
by Tom Igoe
*/

constructor(props) {
    super(props);
    this.state = {
        connectedController: false
    }
}

static getDerivedStateFromProps(nextProps, prevState) {
    //console.log(nextProps.zoomInPelvicFloor);
  if(nextProps.connected!==prevState.connected){
      return { connectedController: nextProps.connected};
  }

 else return null;
}

componentDidUpdate(prevProps, prevState) {
    if(prevState.connectedController !== this.state.connectedController) {
        this.connectController();
    }
}

componentDidMount() {
    this.connectController();
}

connectController = () => {

    var myDevice;
    var myService = 0xffb0;        // fill in a service you're looking for here
    var myCharacteristic = 0xffb2;  // fill in a characteristic from the service here

      navigator.bluetooth.requestDevice({
        // filters: [myFilters]       // you can't use filters and acceptAllDevices together
        optionalServices: [myService],
        acceptAllDevices: true
      })
      .then((device) => {
        // save the device returned so you can disconnect later:
        myDevice = device;
        console.log(device);
        // connect to the device once you find it:
        return device.gatt.connect();
      })
      .then((server) => {
        // get the primary service:
        return server.getPrimaryService(myService);
      })
      .then((service) => {
        // get the  characteristic:
        return service.getCharacteristics();
      })
      .then((characteristics) => {
        // subscribe to the characteristic:
        for (let c in characteristics) {
          //characteristics[c].startNotifications()
          //.then(subscribeToChanges);
          console.log(characteristics);
        }

        console.log(characteristics)
      })
      .catch((error) => {
        // catch any errors:
        console.error('Connection failed!', error);
      });

    // subscribe to changes from the meter:
    function subscribeToChanges(characteristic) {
      characteristic.oncharacteristicvaluechanged = handleData;
    }

    // handle incoming data:
    function handleData(event) {
      // get the data buffer from the meter:
      var buf = new Uint8Array(event.target.value);
      console.log(buf);
    }

    // disconnect function:
    function disconnect() {
      if (myDevice) {
        // disconnect:
        myDevice.gatt.disconnect();
      }
    }

}

render() {
    return (
      <div> ja </div>
    );
  }



}

export default ControllerTest;
