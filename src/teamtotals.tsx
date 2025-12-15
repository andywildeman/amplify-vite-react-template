import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import type { Schema } from "../amplify/data/resource";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

 Amplify.configure(outputs);

 const client = generateClient<Schema>();

 type TeamTotalsProps = {
  quizId: string;
  teamId: string;
  refreshKey: number;
};

export default function TeamTotals({refreshKey, quizId, teamId}: TeamTotalsProps) {
  const [puzzleCount, setPuzzleCount] = useState<string | null>(null);
  const [locationCount, setLocationCount] = useState<string | null>(null);
  
  if(refreshKey == null)(console.log(refreshKey));
  
  useEffect(() => {
    const loadCount = async () => {
      const result = await client.models.TeamQuestions.list({
      filter: {
        and: [
          { quiz_id: { eq: quizId }},
          { team_id: { eq: teamId }},
          { is_correct:{ eq: "Y" }}
        ]
      }
    });
    let pCount: number = 0;
    let lCount: number = 0;
    
    result.data.forEach(function (value) {
        console.log("hello" + String(value.question_number).substring(2,3));
      if(String(value.question_number).substring(2,3) == "A"){
        pCount ++;
      }else{
        lCount ++;
      }
    }); 
      setPuzzleCount(String(pCount));
      setLocationCount(String(lCount));
    };

    loadCount();
  }, [refreshKey, quizId, teamId]);

  return (
    <Container>
      <Row>
        <Col>Puzzles Solved: {puzzleCount}</Col>
        <Col>Location Challenges Solved: {locationCount}</Col>
        <Col>Total Score: {Number(puzzleCount) + Number(locationCount)}</Col>
      </Row>
    </Container>
  );
}

