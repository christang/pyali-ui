import React from 'react';
import 'whatwg-fetch';
import { Grid, Row, Col,
  FormGroup, ControlLabel, Alert,
  Nav, Navbar, NavItem } from 'react-bootstrap';

const apiURL = '/merge/';

const Main = () => (
  <div>
    <AppNavbar />
    <MainContainer />
  </div>
);

const cleanMsg = msg => msg
  .replace(/^\s+/, '')
  .replace(/\s+$/, '')
  .replace(/ /g, '');

// like Array.indexOf, except it finds indices of all occurrences
const indicesOf = (lambda, arr) => arr
  .map((c, i) => (lambda(c, i) ? i : -1))
  .filter(n => n >= 0);

// char indices of \n in a string, as well as those before and after its first and last chars
const indicesOfSplits = msg => [-1, ...indicesOf(c => c === '\n', msg.split('')), msg.length + 1];

// given selected char index of a string, find which \n-sep substring it's found in
const locIndexArray = (si, arr) => indicesOf((c, i) => arr[i - 1] < si && si <= arr[i], arr)[0] - 1;

class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeRef = this.handleChangeRef.bind(this);
    this.handleChangeAli = this.handleChangeAli.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.state = { query: { ref: [], seqs: {} }, refMsg: '', splits: [], loc: -1 };
  }
  handleSelect(e) {
    const s1 = locIndexArray(e.target.selectionStart, this.state.splits);
    const s2 = locIndexArray(e.target.selectionEnd, this.state.splits);
    if (s1 === s2) {
      this.setState({ loc: s1 });
    } else {
      this.setState({ loc: -1 });
    }
    // console.log(`${s1} ${s2}`);
  }
  handleChangeRef(e) {
    const refMsg = cleanMsg(e.target.value);
    const splits = refMsg ? indicesOfSplits(refMsg) : [];
    const query = { ref: refMsg.split(/\n/), seqs: {} };
    this.setState({ query, refMsg, splits });
    // console.log(splits);
  }
  handleChangeAli(e) {
    const aliMsg = cleanMsg(e.target.value);
    const query = Object.assign({}, this.state.query);
    this.state.query.seqs[this.state.loc] = aliMsg;
    this.setState({ query, loc: -1 });
  }
  __handleChange(e) {
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
        this.setState({ value: json.result, err: '' });
      });
    }).catch((error) => {
      this.setState({ err: error });
    });
  }
  render() {
    return (
      <Grid>
        <AlignmentContainer onSelect={this.handleSelect} onChange={this.handleChangeRef} value={this.state.refMsg} label="XX" placeholder="YY" />
        { this.state.loc >= 0 ? <AlignmentContainer label={`bind ${this.state.loc}`} placeholder="AA" onChange={this.handleChangeAli} /> : '' }
        <AlignmentContainer label="Combined Alignment" placeholder="ZZ" value={this.state.value} />
        { this.state.err ? <Alert bstyle="warning"><strong>Oh no!</strong>The server said: {}</Alert> : '' }
      </Grid>
    );
  }
}

const AlignmentContainer = props => (
  <Row className="show-grid"><Col md={12}>
    <FormGroup controlId="formControlsTextarea">
      <ControlLabel>{props.label}</ControlLabel>
      <textarea
        className="form-control" style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}
        placeholder={props.placeholder} value={props.value}
        onChange={props.onChange} onSelect={props.onSelect}
      />
    </FormGroup>
  </Col></Row>
);

AlignmentContainer.propTypes = {
  label: React.PropTypes.string,
  onChange: React.PropTypes.func,
  onSelect: React.PropTypes.func,
  placeholder: React.PropTypes.string,
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
