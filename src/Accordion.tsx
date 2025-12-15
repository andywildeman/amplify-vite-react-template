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

 function isAnswerCorrect(submittedAnswer: string, theAnswer: string){
  let isCorrect = false;
  if(submittedAnswer.toLowerCase() == theAnswer.toLowerCase()){isCorrect = true;}
  if(theAnswer.startsWith("(AND)|")){
    isCorrect = true;
    theAnswer.split("|").forEach(function (value) {
       if(!submittedAnswer.includes(value.toLowerCase())){isCorrect = false;}
    });
  }
  if(theAnswer.startsWith("(OR)|")){
    theAnswer.split("|").forEach(function (value) {
      if(submittedAnswer.toLowerCase() == value.toLowerCase()){isCorrect = true;}
    }); 
  }
  return isCorrect;
 }

 async function updateAnswer(teamQuestionId: string, questionId: string, questionNumber: string, passPlayed: string){
     if(questionId != null){
      if(passPlayed == "passTrue"){
        if(confirm("Are you sure you want to play a pass? You cannot play this question once you have played your pass")){
          console.log("You pressed OK!");
        } else {
          console.log("You pressed Cancel!")
          return;
        }
      }
      try {
        const answer = await client.models.Answers.list({
            filter: {
              question_id: { eq: questionId }
            }
        });
        console.log(answer.data[0].answer);
        if(answer != null){
          const submittedAnswer = document.getElementById("txb-"+ questionId) as HTMLInputElement;
          const answerSpan = document.getElementById("ans-"+ questionId) as HTMLSpanElement;
          if(isAnswerCorrect(submittedAnswer.value, String(answer.data[0].answer))){
            console.log("correct");
            answerSpan.innerText = "Well done, that's the right answer";
            updateTeamAnswer(
              String(window.sessionStorage.getItem('teamId')),
              questionId,
              submittedAnswer.value,
              "Y"
            );
            setAssociatedTeamAnswerVisible(
              quizId,
              teamQuestionId,
              questionNumber
            )
          }else {
            console.log("wrong");
            answerSpan.innerText = "Hard luck, that's the wrong answer"
          }
        }
      } catch (err) {

        console.error("Error:", err);
      }  
    }
  }

  async function updateTeamAnswer(teamId: string, questionId: string, teamAnswer: string, isCorrect: string){
    const result = await client.models.TeamAnswers.list({
      filter: {
        and: [
          { question_id: { eq: questionId }},
          { team_id: { eq: teamId }}
        ]
      }
    });
    const objTeamAnswer = result.data[0];

    const updatedAnswer = await client.models.TeamAnswers.update({
      id: objTeamAnswer.id,
      team_answer: teamAnswer,
      is_correct: isCorrect
    })
    console.log(updatedAnswer);
  }

  async function setAssociatedTeamAnswerVisible(quizId: string, teamQuestionId: string, linkedQuestionNumber: string){
    const questionNumberToUpdate = linkedQuestionNumber.substring(0, linkedQuestionNumber.length - 1) + "B";
    console.log(linkedQuestionNumber);
    console.log(questionNumberToUpdate);
    console.log(teamQuestionId);
    const result = await client.models.TeamAnswers.list({
        filter: {
          and: [
            { quiz_id: { eq: quizId }},
            { question_number: { eq: questionNumberToUpdate }}
          ]
        }
    });

    const answer = result.data[0];

    if (!answer) return;

    await client.models.TeamAnswers.update({
      id: answer.id,
      show: "Y"   
    });
  }

  function headerText(questionNumber: string, location: string){
    if(questionNumber.substring(questionNumber.length -1) == "A"){
      return("Question Number: " + questionNumber.substring(0, questionNumber.length -1))
    }else{
      return("Location: " + questionNumber.substring(0, questionNumber.length -1) + " " + location)
    }
  }

const quizId = String(window.sessionStorage.getItem('quizId'));

 function QuizAccordion() {
  
   const [questions, setQuestions] = useState<Array<Schema["TeamAnswers"]["type"]>>([]);
 
   useEffect(() => {
     client.models.TeamAnswers.observeQuery().subscribe({
       next: (data) => {

      const filtered = data.items.filter(
        q => 
        q.quiz_id === quizId &&
        q.show === 'Y'
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
   }, []);

//   const quizId = 'c7534ee4-6115-48ac-a929-2e3f9ff9c770';
//   const [questions, setQuestions] = useState([]);

// useEffect(() => {
//   const load = async () => {
//     const result = await client.models.Questions.list({
//       filter: { quiz_id: { eq: quizId } }
//     });

//     const sorted = result.data.sort(
//       (a, b) => Number(a.number) - Number(b.number)
//     );

//     setQuestions(result.data);
//   };

//   load();
// }, [quizId]);
            
  return (
    <div>
      <Accordion>
      {questions.map(question => 
        <Accordion.Item eventKey={"item-" + question.question_id} key={"item-" + question.question_id} >
          <Accordion.Header>{headerText(String(question.question_number), String(question.location))}</Accordion.Header>
          <Accordion.Body>
            {question.question}
            <br /><br />
             <S3ObjectHtml quizId={question.quiz_id} questionId={question.question_id} fileType={question.category} />
                <br />
                <Form>
                  <Form.Group className="mb-3" controlId={"txb-" + question.question_id}>
                      <Form.Control type="text" placeholder="your answer" />
                  </Form.Group>
                  <Button variant="primary" type="button" onClick={async () => {
                    await updateAnswer(question.id, String(question.question_id), String(question.question_number), "passFalse")
                    }}>
                    Submit
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button variant="primary" type="button" onClick={async () => {
                    await updateAnswer(question.id, String(question.question_id), String(question.question_number), "passTrue")
                    }}>
                    Play a pass
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <span id={"ans-" + question.question_id}></span>
                </Form>
           </Accordion.Body>
        </Accordion.Item>
      )}
    </Accordion>
    <TeamTotals quizId={String(window.sessionStorage.getItem('quizId'))} teamId={String(window.sessionStorage.getItem('teamId'))} />
    </div>
  );

 }
 
 export default QuizAccordion;
 

