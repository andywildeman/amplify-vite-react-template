 import { useEffect, useState} from "react";
 import Table from "react-bootstrap/Table";
 import { Amplify } from "aws-amplify";
 import type { Schema } from "../amplify/data/resource";
 import outputs from "../amplify_outputs.json";
 import TeamTotals from "./teamtotals";
 import { generateClient } from "aws-amplify/api";
 import Row from 'react-bootstrap/Row';
 import Col from 'react-bootstrap/Col';

 Amplify.configure(outputs);

 const client = generateClient<Schema>();

  type accordionProps = {
    quizId: string;
  };

export default function QuizResults({quizId}: accordionProps) {
  
const [teams, setTeams] = useState<Array<Schema["Teams"]["type"]>>([]);

  useEffect(() => {
    client.models.Teams.observeQuery().subscribe({
      next: (data) => {

      const filtered = data.items.filter(
        q => 
        q.quiz_id === quizId
        //q.team_id === teamId &&
        //q.show === 'Y'
      );

      // 2. SORT
      const sorted = filtered.sort(
        (a, b) => String(a.name).localeCompare(String(b.name))
      );

      // 3. UPDATE STATE
      setTeams(sorted);
      //setQuestions([...data.items]),
        },
    });
  }, [quizId]);



  return (
    <div>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Team</th>
          <th>Members</th>
          <th>    
            <Row>
              <Col style={{textAlign:'center'}}>Puzzles</Col>
              <Col style={{textAlign:'center'}}>Locations</Col>
              <Col style={{textAlign:'center'}}>Total</Col>
            </Row>
          </th>
        </tr>
      </thead>
      <tbody>
        {teams.map((team) => (
          <tr key={team.id}>
            <td>{team.name}</td>
            <td>{team.team_leader +  "," + String(team.members).split("|")}</td>
            <td>{<TeamTotals refreshKey={1} quizId={quizId} teamId={team.id} />}</td>
          </tr>
        ))}
      </tbody>
    </Table>
    </div>
  );
}