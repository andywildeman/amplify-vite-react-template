 import { useEffect, useState} from "react"
 import Accordion from 'react-bootstrap/Accordion';  
 import type { Schema } from "../amplify/data/resource";
 import { Amplify } from "aws-amplify";
 import outputs from "../amplify_outputs.json";
 import S3ObjectHtml from "./S3File.tsx";
 import Button from 'react-bootstrap/Button';
 import Form from 'react-bootstrap/Form';
 import { generateClient } from "aws-amplify/api";
 import TeamTotals from "./teamtotals.tsx";
 //import { update } from "@aws-amplify/data";

 Amplify.configure(outputs);

 const client = generateClient<Schema>();

function QuizAccordion() {

  const [elementTempDisabled, setElementTempDisabled] = useState(false);


 function isAnswerCorrect(submittedAnswer: string, theAnswer: string){
  let isCorrect = false;
  if(submittedAnswer.toLowerCase().trim() == theAnswer.toLowerCase().trim()){isCorrect = true;}
  if(theAnswer.startsWith("(AND):")){
    //console.log(theAnswer.substring(6));
    isCorrect = true;
    theAnswer.substring(6).split("|").forEach(function (value) {
       if(!submittedAnswer.toLowerCase().trim().includes(value.toLowerCase().trim())){isCorrect = false;}
    });
  }
  if(theAnswer.startsWith("(OR):")){
    //console.log(theAnswer.substring(5));
    theAnswer.substring(5).split("|").forEach(function (value) {
      if(submittedAnswer.toLowerCase().trim() == value.toLowerCase().trim()){isCorrect = true;}
    }); 
  }
  return isCorrect;
 }

 async function updateAnswer(teamQuestionId: string, questionId: string, questionNumber: string, passPlayed: string){
  setElementTempDisabled(true);   
  const answerSpan = document.getElementById("ans-"+ questionId) as HTMLSpanElement;
     if(questionId != null){
      if(passPlayed == "passTrue"){
        if(confirm("Are you sure you want to play a pass? You cannot play this question once you have played your pass")){
          console.log("You pressed OK!");
            const answerSpan = document.getElementById("ans-"+ questionId) as HTMLSpanElement;
            await updateTeamAnswer(
              //String(window.sessionStorage.getItem('teamId')),
              teamQuestionId,
              "",
              "",
              "Y"
            );
            answerSpan.innerText = "You played your pass";
            await setAssociatedTeamQuestionVisible(
              quizId,
              teamId,
              questionNumber
            )
        } else {
          console.log("You pressed Cancel!")
          setElementTempDisabled(false);
          return;
        }
      }
      try {
        const answer = await client.models.Questions.get({id: questionId});
        //console.log(answer.data[0].answer);

        if(answer != null){
          const submittedAnswer = document.getElementById("txb-"+ questionId) as HTMLInputElement;
          if(isAnswerCorrect(submittedAnswer.value, String(answer.data?.answer))){

            //console.log("correct");
            answerSpan.innerText = "Well done, that's the right answer";
            await updateTeamAnswer(
              //String(window.sessionStorage.getItem('teamId')),
              teamQuestionId,
              submittedAnswer.value,
              "Y",
              ""
            );
            await setAssociatedTeamQuestionVisible(
              quizId,
              teamId,
              questionNumber
            )
            setRefreshTotals(Math.random);
          }else {
            //console.log("wrong");
            if(passPlayed != "passTrue"){
              answerSpan.innerText = "Hard luck, that's the wrong answer";
              setTimeout(() => {
                setElementTempDisabled(false);
              }, 25000); // 25 seconds
            }else{
               answerSpan.innerText = "You played your pass";             
            }

          }
        }
      } catch (err) {

        console.error("Error:", err);
      }  
    }
  }

  async function updateTeamAnswer(
    teamQuestionId: string,
    //teamId: string,
    //questionId: string,
    teamAnswer: string,
    isCorrect: string,
    passPlayed: string
  ){

    //const objTeamAnswer = result.data[0];
    //console.log(teamAnswer);
    await client.models.TeamQuestions.update({
      id: teamQuestionId,
      team_answer: teamAnswer.trim(),
      is_correct: isCorrect,
      pass_played: passPlayed
    })
    //console.log(updatedAnswer);
  }

  async function setAssociatedTeamQuestionVisible(quizId: string, teamId: string, linkedQuestionNumber: string){
    const questionNumberToUpdate = linkedQuestionNumber.substring(0, linkedQuestionNumber.length - 1) + "B";
    console.log(questionNumberToUpdate);
    console.log(quizId);
    console.log(teamId);
    const result = await client.models.TeamQuestions.list({
        filter: {
          and: [
            { quiz_id: { eq: quizId }},
            { team_id: { eq: teamId}},
            { question_number: { eq: questionNumberToUpdate }}
          ]
        }
    });

    const answer = result.data[0];
    console.log(answer);

    if (!answer) return;

    await client.models.TeamQuestions.update({
      id: answer.id,
      show: "Y"   
    });
  }

  function headerText(questionNumber: string, location: string){
    if(questionNumber.substring(questionNumber.length -1) == "A"){
      return("Puzzle Number " + questionNumber.substring(0, questionNumber.length -1))
    }else{
      return("Location " + questionNumber.substring(0, questionNumber.length -1) + ": " + location)
    }
  }

  function confirmationText(isCorrect: string, passPlayed: string){
    if(isCorrect == "Y"){
      return("You answered this question correctly");
    }
    if(passPlayed == "Y"){
      return("You played your pass");
    }
  }

  function displayTeamAnswer(teamAnswer: string){
    if(teamAnswer == "null"){
      return("");
    }else{
      return(teamAnswer);
    }
  }

/*     function buttonEnabled(isCorrect: string, passPlayed: string){
      if(isCorrect == "Y" || passPlayed == "Y"){
        return {
          disabled: true || true
        };
      }else{
        return "";
      }
    } */

     function elementDisabled(isCorrect: string, passPlayed: string){
      if(isCorrect == "Y" || passPlayed == "Y"){
        return(true);
      }else{
        return(false);
      }
    }  

const quizId = String(window.sessionStorage.getItem('quizId'));
const teamId = String(window.sessionStorage.getItem('teamId'));

  const [refreshTotals, setRefreshTotals] = useState(0);

   const [teamQuestions, setTeamQuestions] = useState<Array<Schema["TeamQuestions"]["type"]>>([]);
 
   useEffect(() => {
     client.models.TeamQuestions.observeQuery().subscribe({
       next: (data) => {

      const filtered = data.items.filter(
        q => 
        q.quiz_id === quizId &&
        q.team_id === teamId &&
        q.show === 'Y'
      );

      // 2. SORT
      const sorted = filtered.sort(
        (a, b) => String(a.question_number).localeCompare(String(b.question_number))
      );

      // 3. UPDATE STATE
      setTeamQuestions(sorted);
      //setQuestions([...data.items]),
         },
    });

    //return () => sub.unsubscribe();
   }, []);
   
   //teamQuestions.forEach(function (teamQuestion) {
   // if(teamQuestion)
   //})

  return (
    <div>
      <Accordion>
      {teamQuestions.map((teamQuestion) => {
        const isCompleted = elementDisabled(String(teamQuestion.is_correct), String(teamQuestion.pass_played));
        console.log(teamQuestion.question);
        console.log(isCompleted);
        console.log(elementTempDisabled);
        return(
          <Accordion.Item eventKey={"item-" + teamQuestion.question_id} key={"item-" + teamQuestion.question_id} >
            <Accordion.Header>{headerText(String(teamQuestion.question_number), String(teamQuestion.location))}</Accordion.Header>
            <Accordion.Body>
              {teamQuestion.question}
              <br /><br />
              <S3ObjectHtml quizId={teamQuestion.quiz_id} questionId={teamQuestion.question_id} fileType={teamQuestion.category} />
                  <br />
                  <Form>
                    <Form.Group className="mb-3" controlId={"txb-" + teamQuestion.question_id}>
                        <Form.Control type="text"  defaultValue={displayTeamAnswer(String(teamQuestion.team_answer))} 
                        placeholder="your answer" disabled={isCompleted || elementTempDisabled} />
                    </Form.Group>
                    <Button variant="primary" id={"btnAnswer-" + teamQuestion.question_id} type="button" onClick={async () => {
                      await updateAnswer(String(teamQuestion.id), String(teamQuestion.question_id), String(teamQuestion.question_number), "passFalse")
                      }} disabled={isCompleted || elementTempDisabled}>
                        Submit
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button variant="primary" id={"btnPass-" + teamQuestion.question_id} type="button" onClick={async () => {
                      await updateAnswer(String(teamQuestion.id), String(teamQuestion.question_id), String(teamQuestion.question_number), "passTrue")
                      }} disabled={isCompleted || elementTempDisabled}>
                        Play a pass
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <span id={"ans-" + teamQuestion.question_id}>{confirmationText(String(teamQuestion.is_correct), String(teamQuestion.pass_played))}</span>
                    &nbsp;&nbsp;&nbsp;

                  </Form>
            </Accordion.Body>
          </Accordion.Item>
        )}
      )}
    </Accordion>
    <TeamTotals refreshKey={refreshTotals} quizId={String(window.sessionStorage.getItem('quizId'))} teamId={String(window.sessionStorage.getItem('teamId'))} />
    </div>
  );

 }
 
 export default QuizAccordion;
 

