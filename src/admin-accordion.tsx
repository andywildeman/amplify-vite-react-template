 import { useEffect, useState} from "react"
 import Accordion from 'react-bootstrap/Accordion';  
 import type { Schema } from "../amplify/data/resource.ts";
 import { Amplify } from "aws-amplify";
 import outputs from "../amplify_outputs.json";
 import S3ObjectHtml from "./S3File.tsx";
 import Button from 'react-bootstrap/Button';
 import Form from 'react-bootstrap/Form';
 import { generateClient } from "aws-amplify/api";
 //import { update } from "@aws-amplify/data";

 Amplify.configure(outputs);

 const client = generateClient<Schema>();

  type accordionProps = {
    quizId: string;
  };

export default function AdminAccordion({quizId}: accordionProps) {

 function isAnswerCorrect(submittedAnswer: string, theAnswer: string){
  let isCorrect = false;
  if(submittedAnswer.toLowerCase() == theAnswer.toLowerCase()){isCorrect = true;}
  if(theAnswer.startsWith("(AND):")){
    //console.log(theAnswer.substring(6));
    isCorrect = true;
    theAnswer.substring(6).split("|").forEach(function (value) {
       if(!submittedAnswer.toLowerCase().includes(value.toLowerCase())){isCorrect = false;}
    });
  }
  if(theAnswer.startsWith("(OR):")){
    //console.log(theAnswer.substring(5));
    theAnswer.substring(5).split("|").forEach(function (value) {
      if(submittedAnswer.toLowerCase() == value.toLowerCase()){isCorrect = true;}
    }); 
  }
  return isCorrect;
 }

 async function updateAnswer(questionId: string, questionNumber: string, passPlayed: string){
     const answerSpan = document.getElementById("ans-"+ questionId) as HTMLSpanElement;
     if(questionId != null){
      if(passPlayed == "passTrue"){
        if(confirm("Are you sure you want to play a pass? You cannot play this question once you have played your pass")){
          console.log("You pressed OK!");
            const answerSpan = document.getElementById("ans-"+ questionId) as HTMLSpanElement;           answerSpan.innerText = "Well done, that's the right answer";
            await updateTeamAnswer(
              String(window.sessionStorage.getItem('teamId')),
              questionId,
              "",
              "",
              "Y"
            );
            answerSpan.innerText = "You played your pass";
            await setAssociatedTeamQuestionVisible(
              quizId,
              questionNumber
            )
        } else {
          console.log("You pressed Cancel!")
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
              String(window.sessionStorage.getItem('teamId')),
              questionId,
              submittedAnswer.value,
              "Y",
              ""
            );

          }else {
            //console.log("wrong");
            if(passPlayed != "passTrue"){
              answerSpan.innerText = "Hard luck, that's the wrong answer"
            }else{
               answerSpan.innerText = "You played your pass"             
            }

          }
        }
      } catch (err) {

        console.error("Error:", err);
      }  
    }
  }

  async function updateTeamAnswer(
    teamId: string,
    questionId: string,
    teamAnswer: string,
    isCorrect: string,
    passPlayed: string
  ){
    const result = await client.models.TeamQuestions.list({
      filter: {
        and: [
          { question_id: { eq: questionId }},
          { team_id: { eq: teamId }}
        ]
      }
    });
    const objTeamAnswer = result.data[0];
    console.log(teamAnswer);
    await client.models.TeamQuestions.update({
      id: objTeamAnswer.id,
      team_answer: teamAnswer,
      is_correct: isCorrect,
      pass_played: passPlayed
    })
    //console.log(updatedAnswer);
  }

  async function setAssociatedTeamQuestionVisible(quizId: string, linkedQuestionNumber: string){
    const questionNumberToUpdate = linkedQuestionNumber.substring(0, linkedQuestionNumber.length - 1) + "B";
    //console.log(linkedQuestionNumber);
    //console.log(questionNumberToUpdate);
    //console.log(teamQuestionId);
    const result = await client.models.TeamQuestions.list({
        filter: {
          and: [
            { quiz_id: { eq: quizId }},
            { question_number: { eq: questionNumberToUpdate }}
          ]
        }
    });

    const answer = result.data[0];

    if (!answer) return;

    await client.models.TeamQuestions.update({
      id: answer.id,
      show: "Y"   
    });
  }

  function headerText(questionNumber: string, location: string){
    if(questionNumber.substring(questionNumber.length -1) == "A"){
      return("Puzzle Number: " + questionNumber.substring(0, questionNumber.length -1))
    }else{
      return("Location: " + questionNumber.substring(0, questionNumber.length -1) + " " + location)
    }
  }

  function displayTeamAnswer(teamAnswer: string){
    if(teamAnswer == "null"){
      return("");
    }else{
      return(teamAnswer);
    }
  }


//const quizId = String(window.sessionStorage.getItem('quizId'));

   const [questions, setQuestions] = useState<Array<Schema["Questions"]["type"]>>([]);
 
   useEffect(() => {
     client.models.Questions.observeQuery().subscribe({
       next: (data) => {

      const filtered = data.items.filter(
        q => 
        q.quiz_id === quizId 
      );

      // 2. SORT
      const sorted = filtered.sort(
        (a, b) => String(a.question_number).localeCompare(String(b.question_number))
      );

      // 3. UPDATE STATE
      setQuestions(sorted);
      //setQuestions([...data.items]),
         },
    });

    //return () => sub.unsubscribe();
   }, [quizId]);
   
   //teamQuestions.forEach(function (teamQuestion) {
   // if(teamQuestion)
   //})

  return (
    <div>
      <Accordion>
      {questions.map(question => 
        <Accordion.Item eventKey={"item-" + question.id} key={"item-" + question.id} >
          <Accordion.Header>{headerText(String(question.question_number), String(question.location))}</Accordion.Header>
          <Accordion.Body>
            {question.id}
            <br />
            {question.question}
            <br /><br />
             <S3ObjectHtml quizId={question.quiz_id} questionId={question.id} fileType={question.category} />
                <br />
                <Form>
                  <Form.Group className="mb-3" controlId={"txb-" + question.id}>
                      <Form.Control type="text" defaultValue={displayTeamAnswer(String(question.answer))} placeholder="your answer" />
                  </Form.Group>
                  <Button variant="primary" onClick={async () => {
                    await updateAnswer(String(question.id), String(question.question_number), "passFalse")
                    }}>
                    Submit
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                 </Form>
           </Accordion.Body>
        </Accordion.Item>
      )}
    </Accordion>
     </div>
  );

 }
 

 

