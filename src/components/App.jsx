import React from 'react';
import './../sass/Main.scss';
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { createBrowserHistory } from "history";

// Components
import Start from '../pages/Start';
import Interactive from '../pages/Interactive';
import Select from '../pages/Select';
import Recent from '../pages/recent';
import Dicom from '../pages/Dicom';
import Model from './organisms/Model';


const history = createBrowserHistory();
class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Start} />
          <Route exact path="/interactive" component={Interactive} />
          <Route exact path="/select" component={Select} />
          <Route exact path="/recent" component={Recent} />
          <Route exact path="/dicom" component={Dicom} />
        </Switch>
      </Router>
    );
  }
}

export default App;
