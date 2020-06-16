import React, { useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';


// global variables
let freedomMesh;
let scene;
let model;
let cameraPositionX;
let cameraPositionY;
let cameraPositionZ;

// Controller variables
let myDevice;
const myService = 0xffb0;        // fill in a service you're looking for here
const myCharacteristic = 0x2AB3;

class Model extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zoomInPelvicFloor: false,
            zoomInCompartmentUterus: false,
            selectedFilter: 0,
            selectedSkin: false,
            selectedPelvic: false,
            connectedController: false,
            x: 0,
            y: 0,
            z: 0,
            cameraX: 0,
            cameraY: 0,
            cameraZ: 0
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.zoomInPelvicFloor!==prevState.zoomInPelvicFloor){
            return { zoomInPelvicFloor: nextProps.zoomInPelvicFloor};
        }

        if(nextProps.zoomInCompartmentUterus!==prevState.zoomInCompartmentUterus){
            return { zoomInCompartmentUterus: nextProps.zoomInCompartmentUterus};
        }

        if(nextProps.selectedFilter!==prevState.selectedFilter){
            return { selectedFilter: nextProps.selectedFilter};
        }

        if(nextProps.connected!==prevState.connected){
          return { connectedController: nextProps.connected};
        }

        else return null;
    }

    componentDidMount() {
        // GETS EXECUTED ONCE! If u click on button it will NOT re-render componentDidMount
        this.showGLTF();
    }

    componentDidUpdate(prevProps, prevState) {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        this.camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 1000);
        const controls = new OrbitControls(this.camera, this.renderer.domElement);


        if (prevState.zoomInPelvicFloor !== this.state.zoomInPelvicFloor) {
            console.log("Update pelvic floor success");

            this.camera.position.set(0,-3,5);
            this.cameraUpdate(0, -3, 5);

            //this.setState({ cameraX: cameraX, cameraY: cameraY, cameraZ: cameraZ})

        } else if(prevState.zoomInCompartmentUterus !== this.state.zoomInCompartmentUterus) {
            console.log("Update compartment success");
            this.camera.position.set(0, 0, 4);
            this.cameraUpdate(0, 0, 4);

          //  this.cameraUpdate(0, 0, 4)
        } else if(prevState.selectedFilter !== this.state.selectedFilter) {
            this.loadGltf();

            //this.camera.position.set(0,-2, 6);

            // Reset scene, but skip first three elements in scene.children array because those elements are lightning, shadow.
            scene.children.slice(3).map((newchildren) => {
            scene.remove(newchildren);

            console.log(this.state.selectedFilter)

            })

            console.log("Selectedfilter is not the same as previous state")

        } else if(prevState.connectedController !== this.state.connectedController) {
            this.connectController();

            // Check if values exists or not
            if(!cameraPositionX && !cameraPositionY && !cameraPositionZ) {
                this.camera.position.set(0,-2, 10);
            } else {
                this.camera.position.set(cameraPositionX, cameraPositionY, cameraPositionZ);
            }


        } else if(prevState.x !== this.state.x && prevState.y !== this.state.y && prevState.z !== this.state.z) {
            this.camera.position.set(0,0,10);

            model.rotation.x = this.state.x;
            model.rotation.y = this.state.y;
            model.rotation.z = this.state.z;

        } else {
            if(this.state.selectedFilter == 0) {
                if(!cameraPositionX && !cameraPositionY && !cameraPositionZ) {
                    this.camera.position.set(0,-2, 10);
                } else {
                    this.camera.position.set(cameraPositionX, cameraPositionY, cameraPositionZ);
                }

            } else if(this.state.selectedFilter == 1) {
                if(!cameraPositionX && !cameraPositionY && !cameraPositionZ) {
                    this.camera.position.set(0,-2, 6);
                } else {
                    this.camera.position.set(cameraPositionX, cameraPositionY, cameraPositionZ);
                }
            }
        }


    // x = left, right y = back, front z = zoom in or out

    }

    connectController = () => {
        if(this.state.connectedController == true) {
            console.log("Connected!");
            this.connect();

        } else {
            this.disconnect();
            console.log("Disconnected!")
        }
    }

    connect = () => {

      navigator.bluetooth.requestDevice({
          // filters: [myFilters]       // you can't use filters and acceptAllDevices together
          optionalServices: [myService],
          acceptAllDevices: true
      })
      .then((device) => {
          // save the device returned so you can disconnect later:
          myDevice = device;

          // connect to the device once you find it:

          if(!device.gatt.connect()) {
            console.log('no connection')
          } else {
            return device.gatt.connect();
          }
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
              characteristics[c].startNotifications()
              .then(this.subscribeToChanges)
          }

      })
      .catch((error) => {
        console.error('Connection failed!', error)
      })


    }

  subscribeToChanges = (characteristic) => {
    characteristic.oncharacteristicvaluechanged = this.handleData
  }

  handleData = (event) => {

    var zRotation = event.target.value.getFloat32(0,true)/-57.295779;
    var xRotation = event.target.value.getFloat32(4,true)/-57.295779;
    var yRotation = event.target.value.getFloat32(8,true)/57.295779;

    this.setState({ x: xRotation, y: yRotation, z: zRotation});

    //this.loadGltf();
    console.log(`x = ${this.state.x} y = ${this.state.y} z = ${this.state.z}`);

    //console.log(this.state.x, this.state.y, this.state.z);

  }

    disconnect = () => {
      let myDevice;
      const myService = 0xffb0;        // fill in a service you're looking for here
      const myCharacteristic = 0xffb2;  // fill in a characteristic from the service here


        // disconnect function:
      if (myDevice) {
        // disconnect:
        myDevice.gatt.disconnect();
      }


      console.log("disconnected");

    }


    showGLTF = () => {
        this.cameraPosition();
        this.loadTexture();
        this.loadGltf();
    }

    cameraPosition = (props) => {

        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 1000);
        this.camera.position.z = 8;
        this.camera.position.y = 5;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor("#ffffff");
        this.renderer.setSize(width, height);
        this.mount.appendChild(this.renderer.domElement);

        const controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    cameraUpdate = (x, y, z) => {
        cameraPositionX = x;
        cameraPositionY = y;
        cameraPositionZ = z;
    }

    loadTexture = () => {
        //Add SPHERE
        //LOAD TEXTURE and on completion apply it on box
        const loader = new THREE.TextureLoader();
        loader.load(
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAVFBMVEVh2vv///9V2PtU2PuX5fz7/v/y/P9s3Pvv+//W9P7l+P647f33/f+R5PzD8P2r6v3b9v7R8/687v2i6Pzo+f6H4vzJ8f2k6PyD4fx23vto3PtD1fvbbHziAAAN70lEQVR4nO1dibaiOBDFCoqKgBso+P//OYJUZSGb/cCgwz1zzkz3KKZIUutNJVqJuBZl9OVI4koSaRUJ/727Mwg9wBEA0W2rlfBYs9BjGwvACo2Et5+RrwUke0XCdf0L61MEO0sSHpJfE/ApYiFIuE5CD2cKsJRL+HNL9AVWoYTFbwr41Debl4T7n9KiEu4vCevQ45gO7NRKePrdKXz6cK2E99CjmBJst4q2vzyFUVSuovRXFekLsI6+PlyyA3ahRzA1IA09gskRhx7A5Phha9+jCT2ABQsWLFiwYMGCBQsWLFiwYMGCBVMAXvjj90cc0LgAlsRpXlVVkSX/ME6AJivOeZ7e6pkKyS5E8FitNqf4rWECK3NO8zlUM+T2CAQWxMmbYsWS9KB8eTc3dohIQuK4xj5TwZKT7suXWU0j047xiW3mGifo5Xsin5GIbGcY5Kqly9mWG8DZ/NX5iMgso3zibBaRZWvbN2dDgynFKauq3VUZ6PauHylE6gK97qrqKAg9k8JRx8vpcLgAe1pCBuV5I4081a03VkoTuDmX3beBZfTl6yzWKZAa3XETCJAdxeHvm8E0ymv7mIlfJppvPId1CmjKKvmFs1qUca2sVIhE+6myd1mOC3wGkwgxjnIwGGG5rRSKLtyFFboZmhSGbyebdPBeoLFoiq0AqSCioPzZRdykOv8uoZU/4dg9gePXDgVqgVS+x4/QImzXod5eMtyKwSWkRWoi4YIoTf9XgoOgfzFP1P0HgnMpUO2ZKZws4/IcuqUs2MvS/LWr4xV8CmyLm8n4EUiEuCiBhqufrSWAwC0c3iT2g7UyHIHbjXXJ46SjdXr6qV+PO9z3gdvFTlsRVQvfgvbZQW0a2nPr3/TBsZZYOhBQ68kJgN5iBqYWwsVzt7CbIqDzjA6qmktYVYP6wL6luk/GkoBuhxM3b2ACLAawJ/cwIHtLwAj60MoSXn4CaM89JIwe3NDvHh6P7i1tYIOIw/CQUFI2LjUT8TmsvmUOQXS2vfbhaR5z2EvoDAGkXdjCkNkQvjETCc+eurReqXCdl0NdGlrT+HqP5KtR5Lt1jJz1SYDQ1qJP0jh8GqBwYs8oe7Gzf4f1HnrolGJvx+3+MU+JtxEiRRqO2elnO3SAePfYVTwbd+j+TCu2tImInnfoc1m1xzjwLWCcQFpnbYtI7tJ3AqIfx80yHaRc+jkDSpJbDnei/QweH6I+MOt0SsZxR4a7N+atiHZoEzrGR6tlNIhCSlzIJpKLatyKzgd/CujUGF81bbqDOFRKlBsXIes/ETwTRWGfYSBAtuGVF+0/BiT4MFXew2ODfwao1PXJBl4AvUT1PcviOM7Ke90IWW+DRUdtFNpY8HSKOtC2TMYYd0cVKsKa5xTr5+cG7BTavp+TxATUCBRdtKJFdVbkp/3WWuHl0m73u7yI740gKObFN8EXKfnerSJpi6P15bzbmKWx4nDMb/e2TMpV0RwqMxj41VFZnNQC979geyrKBpf3HA5io6rxW5G+wKeFVzQRPMYVTRGUheW4PX+9zFW+1rg47IomWH8ugNjCFOI4nvK0uMUiLpdbkaZ5tTu6v/58wHsswNHEy0xsrRbrK+mc6jFkjQLiQayL69W2GE7Zh4WEqDBZhPUxv9wbeKC3drCPDB2G1fUBUR2np63huZsi+pyMLNEVy1o1n2bRy2pzioI1jhdjxc4pah2h+lbpxcyTz0RSkFTa31+tMq4S0IS4u98QJYH7Z8DU5Cqi+gDrFJqhfLjleABIUa9PhI7rlDOOMHzcDrdmNSRXjQsYVDq3af3ABCF9iubAp8ZEH+YZGfw20xijSb0cVir6ZXuunysTsPqJxUzi8hmDP+mpaHMwa0MxZ9Ou2LvCAlxtzASOvwLkBbrOiVQvD5EnLvw63TX48f4NYVzRvx+AUjFME5WjoJbe5VUww7TtXhKRBfBcUPRGDvIL4yHn0zpJq3UzRQ89JlWpj6XoStGy6kSiAQ9zN09b0P4zePZG+j6G/430zYtkQrw48u8JKJLx93fl+SBOAv5B5RUCi6v95rDZV7EqJCmb7qd6xaUkU59fF+exGFlEke56GL4/2qGxkJqR1Qw0opuQy0qflnmbWcPQcEDCkBqvrs6jiihWqM86DxE9k6dUpDckNTM4kCHPQcK/RG9IMw5oBF/fo1LuDeBkGANZkuxDQj6KpPBgGERIqV5aBCeGekpfOGcxD0dHTDTy0opJT9OLT2kKpaqLLrtxFZ/FZx71jIELBQ2nT4+WACBVZyEy4TLb4DISLQXTh4HiRiVnaderTHO9gnuyY9U0uKeWWc6GKAe71qB7gALxLYDy/yylX84DHMuD8xBQJZNIA0xWJgjKCBRVZBuQJh75C+inHRZISkiJcS+Yoi257AKS12J3zGjFjDKJuAsdrWplOURbxowCrlbiTpTYi47KL237MXZi7febEmNG+mGZlChDpCEwwe91df4lfvwINXDcYA5uiKxrxLAQ9CmPF3Kdd7vyIGDgJI7APsUBumNZnnqQ+EOqlpUgeXaMrKZ78eFTRyigIr3MvRwYOf+SsWa2Oo0sCmWl3N7KO7RP16N6E+7usEhmT6aAgS0PKhfPaBI9htU7USPUpuY6h/7kZOejvPchVxT++3Cv34fuQ3mY3BljH/5Zl5oNvmzYRV3qPJSHTt4YTH60c66s0qj20JWkI0drDE4Y/rDjR+Uj+TeLTy1C/Jjk2bre51rzKv8VpCLtRM9GGvnBz+Sb/VI7M5jCsZHIp/irtiKLGiGJPy0LL0IwQUpsYS1Z8azRn2VTBm8RkalWT5wdbdMM5TWoa9nit3EBx4oPuQowZynJZTtrfvytGN+57YF2/Hi8RZ6nMZ2oIxm2VKaR8rn+eZrGkmrrHpXwZ41H1BBCt6s+10Zh/A3wdfxbrq1i+Ci9EhHPwI1J6hPzpbq1z7cqqEUMzRNej9HnSxv6vu6AA9R70xP+LKKQ89ZUt2inthNHR+llB1wqjedyMZcKbK2R4CQrVT7J7oyb83bVLWijtjuDJvQf6hZd3ePApZXkk1Ty2HWLQe1J6gEFchsLMKY8XbWnF1sBuYBSmwmQW0mNX3sa1A/3Qv0QpOoYX6eeHgdN+kH+OgVhwGrZL5qkfhgNooRDV+JuQU53r1zIR/W7mEBQxK+v9+qk18YQxYomnu5I4qCOv+9IZ8PgHkNZZ8jVPRXHjwE/HbUALbVswjp+pEvQ74vkgTaYViXFirY0OT6SNjj/MP1FPKSWTc04tfFpBAuIk/gOn4b7acSnGRI7J+fTRDZO1P7BuQu4tCpnaoBmid5PWE5UNygDr219TMuIvTiv5Gd689pSeLHg4V4Y6Huf4rV147JyE4syiR4Ysa8dEuJC3D6guV/yoyn3+FFuYjcyB790Qwoe+aVaiqnIL7WxqT/OL32NMbr4UXx3VZ6mxe1ykXjCtyLNT14P2AXhCL9kZE2xm5jnnZdRaDI7m5Sr/wgq3QsYV0xz3mIGt9ySl1M3pUnNv4ereGZmBh3psDaF557uN7PGd2GzO19q+dzTDE4FYeQknV1r7nGR7944u3bKi6yONGfXgh+SjTRk0BfU84cbRVo+z9bzhw6H4RNARWM4Q0qZhwuLmvpedqdIs3sdUZXCsA7RmwuuaijRaPj/PBmMYXn3L34O2NQABHPgwTuYYorG3PoDV6f+LLexPDafs9zO8/gUPIjn8Wlmjamc2ZzH9+ipwBsoDHsqWKoTc+mpgIvQUm3m5e9BXwxLCsC1wT8Gn94mnNSn9Dbx6ogSureJV38amjOlP401nzqX/jRePYa4VZR6DDlyOPPoMYRjd+gD3stE6BN1tWtJNBeB+0RhZOFkS1Jah/bkwfFo5A+F7vXl269tyIR2aZC59GvzpQjCXRHQkWXk0UXonnu9hO5aidK/1M3WmktXwf9N70ufYbzbv3Qmc/hGD1pxmX5RD9rf7yPc+8e/2wua+nk7hvEP/bzRpwmdT/Tj1zJdydHRkx3rc6FjC/SPrW9a4HwdhOtz7JsXA5Jxh/s+cLdYNJ54N8ImgYTnEb/ibgQ0iOaBiCXra/sXjZASt9xvIVNOAsLIQushctEwLy5UN4z2HF314NlEymvqw1npnhlSLSAwDE1Hp/HFTDZwb9ClMRptKt8VJFz3J913ob0rCDWpV++QiZEZxyLd9yRfaSU5ALb7nsIvUuG4k2Lf5Du79gqTQrrSynxnl8uT+Ai4w1mZ710b0l3la8mUe9coCgndzPsFfiDrkL0uv1PvzltrjYLiyeHdeQwuZE5m0Pmyg3Diaa27//Bk4PrAXS2Kd/cfCn8OfMcMwXhiBCfW/E3H7ZczUKQvaC87wlFa2TBQWzhDzk5oH4RRxJOTTMgyE39jTgIq1/0J8nlxhGNtX9fxyfh/AyQqWfmQ+pIlganNvJ72c253Oketha+EuCgv3+o6ChCfxJYK87rQmQBQ39I8PxdZ8y9Xq0OSFVVV5WmcBOvJ6sYfL7jX8FAXLFiwYMGCBQsWLFiwYMGCBQsW/Ab8Gld8M4Kfm5ocoan+kwMuvz6LkEeX0GOYFuwazeGCwQnRrKIZUHImBBRPCedBd5gIbPOUMPwBv+nQMmGiuXBWJkF7GKk9bP6zjk3XKbCV0HUs61vxOvfYNQxwNnP6TjRrknDkNpJzwYsY0Dd9+D0RoemZD9jWIjydelxwdic1et6oHTu/GSI5mST0ZTB9AYDFApNMkHC12pXRjJksXgBgSSqRWyUJu7Z58f1rQ8amLi+5SgT8D5+egLbENAkyAAAAAElFTkSuQmCC",
          this.onLoad,
          this.onProgress,
          this.onError
        );

        //LIGHTS
        let lights = [];
        lights[0] = new THREE.PointLight(0x304ffe, 1, 0);
        lights[1] = new THREE.PointLight(0xffffff, 1, 0);
        lights[2] = new THREE.PointLight(0xffffff, 1, 0);
        lights[0].position.set(0, 200, 0);
        lights[1].position.set(100, 200, 100);
        lights[2].position.set(-100, -200, -100);
        scene.add(lights[0]);
        scene.add(lights[1]);
        scene.add(lights[2]);

    }

    loadGltf = (props, position) => {
        const gltfLoader = new GLTFLoader() // Removed THREE

        const dracoLoader = new DRACOLoader();

        const pelvicHalf = "/Pelvic-half.glb";
        const silhouette = "/Silhouette.glb";

        gltfLoader.setDRACOLoader( dracoLoader );

        if(this.props.selectedFilter == 0) {

            dracoLoader.setDecoderPath(silhouette);

            gltfLoader.load(
                  silhouette,
              function(gltf) {
                  model = gltf.scene;
                scene.add(gltf.scene);
              },
              function(xhr) {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
              },
              // called when loading has errors
              function(error) {
                console.log("An error happened" + error);
              }
            );

            this.setState({ selectedSkin: true })
        }

        if(this.props.selectedFilter == 1) {

        dracoLoader.setDecoderPath(pelvicHalf);

            gltfLoader.load(
                pelvicHalf,      //"/Pelvic-half.glb",
              function(gltf) {
                  model = gltf.scene;
                scene.add(gltf.scene);
              },
              function(xhr) {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
              },
              // called when loading has errors
              function(error) {
                console.log("An error happened" + error);
              }
            );

            this.setState({ selectedPelvic: true })

        }

    }

    resizeCanvasToDisplaySize = () => {
      const canvas = this.renderer.domElement;
      // look up the size the canvas is being displayed
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height, false);
    }

    start = () => {
      if (!this.frameId) {
        this.frameId = requestAnimationFrame(this.animate);
      }
    };

    animate = () => {
      this.resizeCanvasToDisplaySize();
      this.renderScene();
      this.frameId = window.requestAnimationFrame(this.animate);
    };
    renderScene = () => {
      if (this.renderer) this.renderer.render(scene, this.camera);
    };

    onLoad = texture => {
      this.renderScene();
      //start animation
      this.start();
    };

    // Function called when download errors
    onError = error => {

    };

    render() {
      return (
        <div
          className="modelContainer"
          ref={mount => {
            this.mount = mount;
          }}
        />
      );
    }
}
export default Model;
