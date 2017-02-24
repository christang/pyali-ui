import React from 'react';
import 'whatwg-fetch';
import { Grid, Row, Col,
  FormGroup, ControlLabel, FormControl,
  Nav, Navbar, NavItem } from 'react-bootstrap';

const apiURL = '/merge/';

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
    this.state = { value: '', param: '' };
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
        <CombinedAlignmentContainer title={'Combined Alignment'} value={this.state.value} />
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
        <ControlLabel>{props.title}</ControlLabel>
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
  title: React.PropTypes.string,
  value: React.PropTypes.string,
};

function AppNavbar() {
  function handleSelect(eventKey) {
    const helpMsg = "Paste this into the 'Reference Alignment' area:\n\nabcde- \n-bcdef \n\n0\nab-cde\n-bbcd-\n\n1\nbcdef\n-cde-\n";
    const aboutMsg = "Just a li'l informatics tool © 2017 // chris@entangible";
    alert(`${[undefined, helpMsg, aboutMsg][eventKey]}`);
  }
  return (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <a >Merge Alignment</a>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav activeKey="1" onSelect={handleSelect}>
        <NavItem eventKey={1} >Help</NavItem>
        <NavItem eventKey={2} >About</NavItem>
      </Nav>
    </Navbar>
  );
}

export default Main;
