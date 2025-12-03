 import { useEffect} from "react"
 import { useState } from "react"
import {
   Label,
   Input,
   Button,
   Flex,
Accordion,
 } from "@aws-amplify/ui-react";
   

 import type { Schema } from "../amplify/data/resource";
 import { generateClient } from "aws-amplify/data";

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
        <Accordion.Container>
        {questions.map(question => 
          <Accordion.Item key={"item-" + question.id} value={"item-" + question.id}>
            <Accordion.Trigger>
              <p>Question Number {question.number}</p>
              <Accordion.Icon />
            </Accordion.Trigger>
            <Accordion.Content>  
              <Flex direction="column" gap="small">
                <Label htmlFor="first_name">{question.question}</Label>
                <Input id="first_name" name="first_name" />
                <Button onClick={() => alert('Answer Submitted')}>Submit Answer</Button>
              </Flex>
            </Accordion.Content>
          </Accordion.Item>
        )}
        </Accordion.Container>
      </div>
   ); 

   /*return(
      <ul>
        {questions.map((question) => (
          <li key={question.id}>{question.question}</li>
        ))}
      </ul>
   );*/

 }
 
 export default QuizAccordion;
 

