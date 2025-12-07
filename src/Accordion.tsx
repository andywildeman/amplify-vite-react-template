 import { useEffect, useState} from "react"
 import Accordion from 'react-bootstrap/Accordion';  

 import type { Schema } from "../amplify/data/resource";
 
 import { Amplify } from "aws-amplify";
 import outputs from "../amplify_outputs.json";
 import S3ObjectHtml from "./S3File.tsx";
 import Button from 'react-bootstrap/Button';
 import Form from 'react-bootstrap/Form';
 import { generateClient } from "aws-amplify/data";
 import { update } from "@aws-amplify/data";

 Amplify.configure(outputs);

 const client = generateClient<Schema>();

 function isAnswerCorrect(submittedAnswer: string, theAnswer){
  let isCorrect = false;
  if(submittedAnswer.toLowerCase() == theAnswer.toLowerCase()){isCorrect = true;}
  if(theAnswer.startsWith("(contains)|")){
    isCorrect = true;
    const subStrings = theAnswer.split("|");
    for(let x=1; x<subStrings.length, x++;){
      if(!submittedAnswer.includes(subStrings[x])){isCorrect = false;}
    }
  }
  if(theAnswer.startsWith("(OR)|")){
    const subStrings = theAnswer.split("|");
    for(let x=1; x<subStrings.length, x++;){
      if(submittedAnswer.toLowerCase() == theAnswer.toLowerCase()){isCorrect = true;}
     }
  }
  return isCorrect;
 }

 async function updateAnswer(questionId: string){
     if(questionId != null){
      try {
        const question = await client.models.Questions.get({ id: questionId });
        console.log(question.data?.answer);
        if(question != null){
          const submittedAnswer = document.getElementById("txb-"+ questionId) as HTMLInputElement;
          if(isAnswerCorrect(submittedAnswer.value, question.data?.answer?.toString())){
            console.log("correct");
          }else {
            console.log("wrong");
          }
        }
      } catch (err) {
        console.error("Error:", err);
      }  
    }
  }

 function QuizAccordion() {
   const [questions, setQuestions] = useState<Array<Schema["Questions"]["type"]>>([]);
 
   useEffect(() => {
     client.models.Questions.observeQuery().subscribe({
       next: (data) => setQuestions([...data.items]),
     });
   }, []);

   //question.category.toString().includes(":")?<S3ObjectHtml filePath={question.quiz_id + "/" + question.id + question.category?.toString().split(":")[1]} fileType={category} />: <div></div> 
           
  return (
    <div>
      <Accordion>
      {questions.map(question => 
        <Accordion.Item eventKey={"item-" + question.id} key={"item-" + question.id} >
          <Accordion.Header>Question Number {question.number}</Accordion.Header>
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
                    await updateAnswer(question.id)
                    }}>
                    Submit
                  </Button>
                </Form>
           </Accordion.Body>
        </Accordion.Item>
      )}
    </Accordion>
    </div>
  );

 }
 
 export default QuizAccordion;
 

