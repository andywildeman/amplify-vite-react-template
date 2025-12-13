//import { useState } from 'react';
import Button from 'react-bootstrap/Button';
//import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
//import InputGroup from 'react-bootstrap/InputGroup';
import { generateClient } from "aws-amplify/api";
 import { Amplify } from "aws-amplify";
 import outputs from "../amplify_outputs.json";
 import type { Schema } from "../amplify/data/resource";
//import { Color } from 'aws-cdk-lib/aws-cloudwatch';
//import { Container } from 'react-bootstrap';
  
 Amplify.configure(outputs);

 const client = generateClient<Schema>();

 async function createTeam() {
    const quizId = String(window.sessionStorage.getItem('quizId'));
    const teamName = (document.getElementById("txb-team-name") as HTMLInputElement).value;
    const teamLeader = (document.getElementById("txb-team-leader") as HTMLInputElement).value;
    const teamLeaderEmail = window.sessionStorage.getItem('userEmail');
    let teamMembers = "";
    if((document.getElementById("txb-team-member1") as HTMLInputElement).value != ""){
      teamMembers += (document.getElementById("txb-team-member1") as HTMLInputElement).value + "|";
    }
    if((document.getElementById("txb-team-member2") as HTMLInputElement).value != ""){
      teamMembers += (document.getElementById("txb-team-member2") as HTMLInputElement).value + "|" ;
    }
    if((document.getElementById("txb-team-member3") as HTMLInputElement).value != ""){
      teamMembers += (document.getElementById("txb-team-member3") as HTMLInputElement).value + "|";
    }
    if((document.getElementById("txb-team-member4") as HTMLInputElement).value != ""){
      teamMembers += (document.getElementById("txb-team-member4") as HTMLInputElement).value  + "|";
    }
    if((document.getElementById("txb-team-member5") as HTMLInputElement).value != ""){
      teamMembers += (document.getElementById("txb-team-member5") as HTMLInputElement).value  + "|";
    }
    if((document.getElementById("txb-team-member6") as HTMLInputElement).value != ""){
      teamMembers += (document.getElementById("txb-team-member6") as HTMLInputElement).value  + "|";
    }

  try {
    const newTeam = await client.models.Teams.create({
      quiz_id: quizId,
      name: teamName,
      team_leader: teamLeader,
      team_leader_email: teamLeaderEmail,
      members: teamMembers
    });

    console.log("Team created:", newTeam);
    const teamQuestions = await getAllQuestions(String(newTeam.data!.id))
    console.log(teamQuestions);

    return newTeam;
  } catch (error) {
    console.error("Error creating team:", error);
  }
}

async function getAllQuestions(teamId: string){
  try {
    const questions = await client.models.Questions.list({    });
    console.log(questions);
    for (const question of questions.data) {
      console.log(question);
      const newTeamQuestion = await createTeamQuestion(
        teamId,
        String(question.quiz_id),
        question.id,
        String(question!.question_type),
        String(question.question)
    );
    console.log(newTeamQuestion);
  }
 return (questions);   

  } catch (error) {
    console.error("Error listing questions:", error);
  }
}

async function createTeamQuestion(teamId: string, quizId: string, questionId: string, question: string, category: string) {
  try {
    const newTeam = await client.models.TeamAnswers.create({
      team_id: teamId,
      quiz_id: quizId,
      question_id: questionId,
      question: question,
      category: category,
      team_answer: "",
    });

    console.log("Team created:", newTeam);
    return newTeam;
  } catch (error) {
    console.error("Error creating team:", error);
  }
}


function Team() {
  const styleObj = {
    padding: "10px",
    border: "solid"
  }
  const btnStyle = {
    padding: "10px"
  }
  return (
    <div className="container" style={styleObj}>
      <h1>Enter Your team details</h1>
            <Form>
                <Form.Group className="mb-3" controlId="txb-team-name">
                  <Form.Control type="text" placeholder="team name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="txb-team-leader">
                    <Form.Control type="text" placeholder="team leader" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="txb-team-member1">
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

          <Button variant="primary" style={btnStyle} onClick={async (e) => {
                e.preventDefault(); 
                await createTeam();
              }}>
            Create Team
          </Button>

    </div>
  );
}

export default Team;