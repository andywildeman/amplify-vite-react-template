 import { useEffect} from "react"
 import { useState } from "react"
 import Accordion from 'react-bootstrap/Accordion';  

 import type { Schema } from "../amplify/data/resource";
 import { generateClient } from "aws-amplify/data";

 import { Amplify } from "aws-amplify";
 import outputs from "../amplify_outputs.json";
 Amplify.configure(outputs);

 const client = generateClient<Schema>();
 
 function QuizAccordion() {
   const [questions, setQuestions] = useState<Array<Schema["Questions"]["type"]>>([]);
 
   useEffect(() => {
     client.models.Questions.observeQuery().subscribe({
       next: (data) => setQuestions([...data.items]),
     });
   }, []);


  return (
    <div>
      <Accordion>
      {questions.map(question => 
        <Accordion.Item eventKey={"item-" + question.id} key={"item-" + question.id} >
          <Accordion.Header>Question Number {question.number}</Accordion.Header>
          <Accordion.Body>
            {question.question}
          </Accordion.Body>
        </Accordion.Item>
      )}
    </Accordion>
    </div>
  );

 }
 
 export default QuizAccordion;
 

