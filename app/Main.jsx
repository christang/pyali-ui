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

const cleanSeqs = seqs => seqs
  .map((s, i) => [i, s])
  .filter(tup => tup[1] && tup[1].length);

class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeRef = this.handleChangeRef.bind(this);
    this.handleChangeAli = this.handleChangeAli.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.state = { ref: [], seqs: [], value: '', err: '' };
  }
  handleChangeRef(e) {
    const ref = cleanMsg(e.target.value)
      .split(/\n/).filter(_ => _);
    this.setState({ ref, seqs: this.state.seqs.map(() => []), value: '', err: '' });
  }
  handleChangeAli(e, i) {
    const aliMsg = cleanMsg(e.target.value);
    const seqs = this.state.seqs.slice(0);
    seqs[i] = aliMsg.split(/\n/);
    this.setState({ seqs, value: '', err: '' });
    this.handleMessage(cleanSeqs(seqs));
  }
  handleMessage(seqs) {
    const ref = this.state.ref;
    const msg = { ref, seqs };
    fetch(apiURL, {
      method: 'POST',
      body: JSON.stringify(msg),
    }).then((response) => {
      response.json().then((json) => {
        this.setState({ value: json.result, err: '' });
      }).catch((err) => {
        this.setState({ err });
      });
    });
  }
  render() {
    const notEmpty = ali => !!ali && ali.length > 0;
    return (
      <Grid>
        <AlignmentContainer
          alignment={notEmpty(this.state.ref)}
          label="Reference Alignment"
          placeholder="Paste your reference alignment here"
          onChange={this.handleChangeRef}
        />
        { this.state.ref.map((s, i) => (
          <AlignmentContainer
            alignment={notEmpty(this.state.seqs[i])}
            key={i}
            label="Child alignment for ..."
            placeholder={this.state.ref[i].replace(/-/, '')}
            onChange={e => this.handleChangeAli(e, i)}
          />)) }
        <AlignmentContainer
          alignment={notEmpty(this.state.value)}
          label="Merged Alignment"
          value={this.state.value}
        />
        { this.state.err ? (
          <Alert bsStyle="warning">
            <strong>Oh no! </strong>
            {`The server said: ${JSON.stringify(this.state.err)}`}
          </Alert>) : '' }
      </Grid>
    );
  }
}

const AlignmentContainer = props => (
  <Row className="show-grid"><Col md={12}>
    <FormGroup controlId="formControlsTextarea">
      <ControlLabel
        style={{ fontWeight: props.label.startsWith('Child') ? 'unset' : '' }}
      >
        {props.label}
      </ControlLabel>
      <textarea
        className="form-control"
        placeholder={props.placeholder} onChange={props.onChange}
        style={{ fontFamily: props.alignment ? 'monospace' : '', whiteSpace: 'pre' }}
        value={props.value}
      />
    </FormGroup>
  </Col></Row>
);

AlignmentContainer.propTypes = {
  alignment: React.PropTypes.bool,
  label: React.PropTypes.string,
  onChange: React.PropTypes.func,
  placeholder: React.PropTypes.string,
  value: React.PropTypes.string,
};

function AppNavbar() {
  function handleSelect(eventKey) {
    const helpMsg = "Paste this into the 'Reference Alignment' area:\n\nabcde- \n-bcdef\n\nPaste this into 'Child alignment for ... [abcde]'\n\nab-cde\n-bbcd-\n\nPaste this into 'Child alignment for ... [bcdef]'\n\nbcdef\n-cde-\n";
    const aboutMsg = "An alignment informatics tool '\n\n © 2017 // chris@entangible";
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
