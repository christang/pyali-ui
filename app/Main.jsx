import React from 'react';
import { Grid, Row, Col,
  FormGroup, ControlLabel, FormControl,
  Nav, Navbar, NavItem } from 'react-bootstrap';

const Main = () => (
  <div>
    <AppNavbar />
    <MainContainer />
  </div>
);

class MainContainer extends React.Component {
  render() {
    return (
      <div>
        <ReferenceAlignmentContainer />
        <CombinedAlignmentContainer />
      </div>
    );
  }
}

class ReferenceAlignmentContainer extends React.Component {
  render() {
    return (
      <Grid><Row className="show-grid"><Col md={12}>
        <FormGroup controlId="formControlsTextarea">
          <ControlLabel>Reference Alignment</ControlLabel>
          <FormControl componentClass="textarea" placeholder="Paste aligned sequences here" />
        </FormGroup>
      </Col></Row></Grid>
    );
  }
}

class CombinedAlignmentContainer extends React.Component {
  render() {
    return (
      <Grid><Row className="show-grid"><Col md={12}>
        <FormGroup controlId="formControlsTextarea">
          <ControlLabel>Combined Alignment</ControlLabel>
          <FormControl componentClass="textarea" placeholder="Get a merged alignment here" />
        </FormGroup>
      </Col></Row></Grid>
    );
  }
}

class AppNavbar extends React.Component {
  handleSelect(eventKey) {
    this.state.eventKey = eventKey;
    alert(`todo: ${[undefined, 'Help', 'About'][eventKey]}`);
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