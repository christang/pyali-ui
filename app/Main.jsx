import React from 'react';
import 'whatwg-fetch';
import { Grid, Row, Col,
  FormGroup, ControlLabel, Alert,
  Nav, Navbar, NavItem } from 'react-bootstrap';
import fasta2json from 'fasta2json';

// service endpoint that merges
const apiURL = '/merge/';

// mininum size in rows of textareas, e.g., when empty
const minRows = 2;

const Main = () => (
  <div>
    <AppNavbar />
    <MainContainer />
  </div>
);

const parseMsg = msg => fasta2json.ParseFasta(msg);

const getSeqs = seqs => seqs.map(s => s.seq);

const cleanSeqs = seqs => seqs.map((s, i) => [i, s]);

const validAli = (seq, ali) => {
  const refSeqMatches = seq.replace(/-/g, '') === ali[0].replace(/-/g, '');
  const aliIsProper = ali.every(s => s.length === ali[0].length);
  return refSeqMatches && aliIsProper;
};

const validAlis = body => body.seqs.map(s => validAli(body.ref[s[0]], s[1])).every(_ => _);

const listEq = (l1, l2) => l1 && l2 && l1.length === l2.length && l1.every((el, i) => el === l2[i]);

const seqsEq = (s1, s2) => s1 && s2 && listEq(getSeqs(s1), getSeqs(s2));

class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeRef = this.handleChangeRef.bind(this);
    this.handleChangeAli = this.handleChangeAli.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.state = { ref: [], seqs: [], value: '', err: '', c: 0 };
  }
  handleChangeRef(e) {
    const ref = parseMsg(e.target.value);
    if (!seqsEq(ref, this.state.ref)) {
      this.setState({ ref, seqs: [], value: '', err: '', c: this.state.c + 1 });
    }
  }
  handleChangeAli(e, i) {
    const seqs = this.state.seqs.slice(0);
    seqs[i] = parseMsg(e.target.value);

    if (!seqsEq(seqs[i], this.state.seqs[i])) {
      this.setState({ seqs, value: '', err: '' });
      const body = { ref: getSeqs(this.state.ref), seqs: cleanSeqs(seqs.map(getSeqs)) };
      if (validAlis(body)) this.handleMessage(body);
    }
  }
  handleMessage(body) {
    fetch(apiURL, {
      method: 'POST',
      body: JSON.stringify(body),
    }).then((response) => {
      response.json().then((json) => {
        this.setState({ value: json.result, err: '' });
      }).catch((err) => {
        this.setState({ err });
      });
    });
  }
  render() {
    const safeLen = ali => (ali ? ali.length : 0);
    return (
      <Grid>
        <AlignmentContainer
          alignment={safeLen(this.state.ref)}
          label="Reference Alignment"
          placeholder="Paste your reference alignment here"
          onChange={this.handleChangeRef}
        />
        { this.state.ref.map((s, i) => (
          <AlignmentContainer
            alignment={safeLen(this.state.seqs[i])}
                                          // updating c invalidates the key -- so we good
            key={`${this.state.c}-${i}`}  // eslint-disable-line react/no-array-index-key
            label={`Child alignment for ${this.state.ref[i].head || '...'}`}
            placeholder={this.state.ref[i].seq.replace(/-/g, '')}
            onChange={e => this.handleChangeAli(e, i)}
          />)) }
        <AlignmentContainer
          alignment={safeLen(this.state.value.split(/\n/))}
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
        rows={Math.max(props.alignment, minRows)}
        placeholder={props.placeholder} onChange={props.onChange}
        style={{ fontFamily: props.alignment ? 'monospace' : '', whiteSpace: 'pre' }}
        value={props.value}
      />
    </FormGroup>
  </Col></Row>
);

AlignmentContainer.propTypes = {
  alignment: React.PropTypes.number,
  label: React.PropTypes.string,
  onChange: React.PropTypes.func,
  placeholder: React.PropTypes.string,
  value: React.PropTypes.string,
};

function AppNavbar() {
  function handleSelect(eventKey) {
    const helpMsg = "Paste this into the 'Reference Alignment' area:\n\n>SEQ_1\nabcde- \n>SEQ_2\n-bcdef\n\nPaste this into 'Child alignment for ... [abcde]' (FASTA headers are allowed but ignored)\n\nab-cde\n-bbcd-\n\nPaste this into 'Child alignment for ... [bcdef]' (FASTA headers are allowed but ignored)\n\nbcdef\n-cde-\n\nNotes\n - Sequences should not contain line breaks\n - All FASTA lines containing '>' are ignored";
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
