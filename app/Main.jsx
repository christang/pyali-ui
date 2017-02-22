import React from 'react';
import 'whatwg-fetch';
import { Grid, Row, Col,
  FormGroup, ControlLabel, FormControl,
  Nav, Navbar, NavItem } from 'react-bootstrap';

const apiURL = '/merge';

const Main = () => (
  <div>
    <AppNavbar />
    <MainContainer />
  </div>
);

class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { value: '' };
  }
  handleChange(e) {
    function parseIn(msg) {
      const msgParts = msg
        .replace(/^\s+/, '')
        .replace(/\s+$/, '')
        .replace(/ /g, '')
        .split(/\n\n+/);
      const ref = msgParts
        .shift()
        .split(/\n/);
      const seqs = msgParts
        .map((msgAli) => {
          const aliParts = msgAli.split(/\n/);
          return [parseInt(aliParts.shift(), 10), aliParts];
        });

      const json = { ref, seqs };
      return json;
    }
    fetch(apiURL, {
      method: 'POST',
      body: JSON.stringify(parseIn(e.target.value)),
    }).then((response) => {
      response.json().then((json) => {
        this.setState({ value: json.result });
      });
    }).catch((error) => {
      alert(error);
    });
  }
  render() {
    return (
      <div>
        <ReferenceAlignmentContainer onChange={this.handleChange} />
        <CombinedAlignmentContainer value={this.state.value} />
      </div>
    );
  }
}

function ReferenceAlignmentContainer(props) {
  return (
    <Grid><Row className="show-grid"><Col md={12}>
      <FormGroup controlId="formControlsTextarea">
        <ControlLabel>Reference Alignment</ControlLabel>
        <FormControl
          componentClass="textarea"
          placeholder="Paste aligned sequences here"
          onChange={props.onChange}
        />
      </FormGroup>
    </Col></Row></Grid>
  );
}

ReferenceAlignmentContainer.propTypes = {
  onChange: React.PropTypes.func,
};

function CombinedAlignmentContainer(props) {
  return (
    <Grid><Row className="show-grid"><Col md={12}>
      <FormGroup controlId="formControlsTextarea">
        <ControlLabel>Combined Alignment</ControlLabel>
        <FormControl
          componentClass="textarea"
          placeholder="Get a merged alignment here"
          value={props.value}
        />
      </FormGroup>
    </Col></Row></Grid>
  );
}

CombinedAlignmentContainer.propTypes = {
  value: React.PropTypes.string,
};

class AppNavbar extends React.Component {
  handleSelect(eventKey) {
    const testMsg = "Here's a test\n\nabcde- \n-bcdef \n\n0\nab-cde\n-bbcd-\n\n1\nbcdef\n-cde-\n";
    alert(`todo: ${[undefined, testMsg, 'About'][eventKey]}`);
  }
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a >Merge Alignment</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav activeKey="1" onSelect={this.handleSelect}>
          <NavItem eventKey={1} >Help</NavItem>
          <NavItem eventKey={2} >About</NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default Main;
