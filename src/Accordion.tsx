 import { useEffect, useState} from "react"
 import Accordion from 'react-bootstrap/Accordion';  

 import type { Schema } from "../amplify/data/resource";
 
 import { Amplify } from "aws-amplify";
 import outputs from "../amplify_outputs.json";
 import S3ObjectHtml from "./S3File.tsx";
 import Button from 'react-bootstrap/Button';
 import Form from 'react-bootstrap/Form';
 import { generateClient } from "aws-amplify/api";
 //import { useAuthenticator } from '@aws-amplify/ui-react';
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

 async function updateAnswer(questionId: string, passPlayed: string){
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
        const question = await client.models.Questions.get({ id: questionId });
        console.log(question.data?.answer);
        if(question != null){
          const submittedAnswer = document.getElementById("txb-"+ questionId) as HTMLInputElement;
          const answerSpan = document.getElementById("ans-"+ questionId) as HTMLSpanElement;
          if(isAnswerCorrect(submittedAnswer.value, String(question.data?.answer))){
            console.log("correct");
                 answerSpan.innerText = "Well done, that's the right answer";
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


const quizId = 'c7534ee4-6115-48ac-a929-2e3f9ff9c770';

 function QuizAccordion() {
  
   const [questions, setQuestions] = useState<Array<Schema["Questions"]["type"]>>([]);
 
   useEffect(() => {
     client.models.Questions.observeQuery().subscribe({
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
        <Accordion.Item eventKey={"item-" + question.id} key={"item-" + question.id} >
          <Accordion.Header>Question Number {question.question_number}</Accordion.Header>
          <Accordion.Body>
            {question.question}
            <br /><br />
             <S3ObjectHtml quizId={question.quiz_id} questionId={question.id} fileType={question.category} />
                <br />
                <Form>
                  <Form.Group className="mb-3" controlId={"txb-" + question.id}>
                      <Form.Control type="text" placeholder="your answer" />
                  </Form.Group>
                  <Button variant="primary" type="button" onClick={async () => {
                    await updateAnswer(question.id, "passFalse")
                    }}>
                    Submit
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button variant="primary" type="button" onClick={async () => {
                    await updateAnswer(question.id, "passTrue")
                    }}>
                    Play a pass
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <span id={"ans-" + question.id}></span>
                </Form>
           </Accordion.Body>
        </Accordion.Item>
      )}
    </Accordion>
    </div>
  );

 }
 
 export default QuizAccordion;
 

