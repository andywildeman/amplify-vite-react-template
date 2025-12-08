import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
//import InputGroup from 'react-bootstrap/InputGroup';
import { generateClient } from "aws-amplify/api";
 import { Amplify } from "aws-amplify";
 import outputs from "../amplify_outputs.json";
 import type { Schema } from "../amplify/data/resource";
  
 Amplify.configure(outputs);

 const client = generateClient<Schema>();

 async function createTeam(quizId: string, name: string, members: string) {
  try {
    const newTeam = await client.models.Teams.create({
      quiz_id: quizId,
      name: name,
      members: members
    });

    console.log("Team created:", newTeam);
    return newTeam;
  } catch (error) {
    console.error("Error creating team:", error);
  }
}


function Team() {
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
          <Button variant="primary" onClick={async (e) => {
                e.preventDefault(); 
                await createTeam("c7534ee4-6115-48ac-a929-2e3f9ff9c770", "Dream Team", "Alice, Bob, Charlie");
              }}>
            Create Team
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Team;