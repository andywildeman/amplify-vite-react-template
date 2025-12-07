
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
//import InputGroup from 'react-bootstrap/InputGroup';

function Example() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Register Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="txb-team-name">
                    <Form.Control type="text" placeholder="team name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="txb-team-leader">
                    <Form.Control type="text" placeholder="team leader" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="txb-team-member">
                    <Form.Control type="text" placeholder="team member 1" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="txb-team-member2">
                    <Form.Control type="text" placeholder="team member 2" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="txb-team-member3">
                    <Form.Control type="text" placeholder="team member 3" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="txb-team-member4">
                    <Form.Control type="text" placeholder="team member 4" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="txb-team-member5">
                    <Form.Control type="text" placeholder="team member 5" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="txb-team-member6">
                    <Form.Control type="text" placeholder="team member 6" />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Example;