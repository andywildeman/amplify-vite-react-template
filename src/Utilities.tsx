 import { generateClient } from "aws-amplify/api";
 import { Amplify } from "aws-amplify";
 import outputs from "../amplify_outputs.json";
 import type { Schema } from "../amplify/data/resource";
//import { Color } from 'aws-cdk-lib/aws-cloudwatch';
//import { Container } from 'react-bootstrap';
 import Button from 'react-bootstrap/Button';
 
  Amplify.configure(outputs);

 const client = generateClient<Schema>();

export default function Utilities(){


  async function getAllQuestions(){
  try {
    const questions = await client.models.Questions.list({    });
    console.log(questions);
    for (const question of questions.data) {
      console.log(question);
      const newAnswer = await createAnswers(
        String(question.quiz_id),
        question.id,
        String(question.question_number),
        String(question!.answer),
    );
    console.log(newAnswer);
  }
 return (questions);   

  } catch (error) {
    console.error("Error listing questions:", error);
  }
} 

  async function createAnswers(quizId: string, questionId: string, questionNumber: string, answer: string) {
  try {
    const newTeam = await client.models.Answers.create({
      quiz_id: quizId,
      question_id: questionId,
      question_number: questionNumber,
      answer: answer  
    });

    console.log("Answer created:", newTeam);
    return newTeam;
  } catch (error) {
    console.error("Error creating team:", error);
  }
}


 /*    async function getAllQuestions(){
        try {
            const questions = await client.models.Questions.list({    });
            console.log(questions);
            for (const question of questions.data) {
            console.log(question);
            const newQuestion = await createQuestions(
                String(question.quiz_id),
                String(question.question_number)
            );
            console.log(newQuestion);
        }
        return (questions);   

        } catch (error) {
            console.error("Error listing questions:", error);
        }
    }



    async function createQuestions(quizId: string, questionNumber: string) {
        questionNumber = questionNumber.substring(0, questionNumber.length -1) + "B"
        try {
            const newQuestion = await client.models.Questions.create({
            quiz_id: quizId,
            question_number: questionNumber,
            question: questionNumber,
            category: "Text"
            });

            console.log("Question created:", newQuestion);
            return newQuestion;
        } catch (error) {
            console.error("Error creating team:", error);
        }
    } */

    return(
        <Button variant="primary" type="button" onClick={async () => {
        await getAllQuestions()
        }}>
        make tables
        </Button>
  
    )
}
