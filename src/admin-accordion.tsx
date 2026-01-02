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
 import S3FileUpload from "./admin-uploadS3File.tsx";

 Amplify.configure(outputs);

 const client = generateClient<Schema>();

  type accordionProps = {
    quizId: string;
  };

export default function AdminAccordion({quizId}: accordionProps) {

  async function updateQuestion(
    questionId: string
  ){
    const question = (document.getElementById("txbQuestion-" + questionId) as HTMLInputElement).value;
    const answer = (document.getElementById("txbAnswer-" + questionId) as HTMLInputElement).value;
    const questionType = (document.getElementById("txbQuestionType-" + questionId) as HTMLInputElement).value;
    const location = (document.getElementById("txbLocation-" + questionId) as HTMLInputElement).value;
    const category = (document.getElementById("txbCategory-" + questionId) as HTMLInputElement).value;

    await client.models.Questions.update({
      id: questionId,
      question: question, 
      answer: answer, 
      question_type: questionType, 
      location: location, 
      category: category
    })
    //console.log(updatedAnswer);
  }

  function headerText(questionNumber: string, location: string){
    if(questionNumber.substring(questionNumber.length -1) == "A"){
      return("Puzzle Number: " + questionNumber.substring(0, questionNumber.length -1))
    }else{
      return("Location: " + questionNumber.substring(0, questionNumber.length -1) + " " + location)
    }
  }

/*   function displayAnswer(answer: string){
    if(answer == "null"){
      return("");
    }else{
      return(answer);
    }
  } */


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
            quizId: {question.quiz_id}
            <br />
            questionId: {question.id}
            <br />
            {question.question}
            <br /><br />
             <S3ObjectHtml quizId={question.quiz_id} questionId={question.id} fileType={question.category} />
                <br />
                <Form>
                  <Form.Group className="mb-3" controlId={"txbQuestion-" + question.id}>
                      <Form.Control type="text" defaultValue={String(question.question)} placeholder="the question" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId={"txbAnswer-" + question.id}>
                      <Form.Control type="text" defaultValue={String(question.answer)} placeholder="the answer" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId={"txbQuestionType-" + question.id}>
                      <Form.Control type="text" defaultValue={String(question.question_type)} placeholder="question type" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId={"txbLocation-" + question.id}>
                      <Form.Control type="text" defaultValue={String(question.location)} placeholder="location" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId={"txbCategory-" + question.id}>
                      <Form.Control type="text" defaultValue={String(question.category)} placeholder="category" />
                  </Form.Group>
                  <S3FileUpload quizId={question.quiz_id} questionId={question.id} />
                  <br />                  
                  <Button variant="primary" type="button" onClick={async () => {
                    await updateQuestion(
                      String(question.id)
                    )
                    }}>
                    Update
                  </Button>
                  <br />
                 </Form>
           </Accordion.Body>
        </Accordion.Item>
      )}
    </Accordion>
     </div>
  );

 }
 

 

