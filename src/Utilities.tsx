 import { generateClient } from "aws-amplify/api";
 import { Amplify } from "aws-amplify";
 import outputs from "../amplify_outputs.json";
 import type { Schema } from "../amplify/data/resource";
//import { Color } from 'aws-cdk-lib/aws-cloudwatch';
//import { Container } from 'react-bootstrap';
 import Button from 'react-bootstrap/Button';
//import { a } from "@aws-amplify/backend";
 
  Amplify.configure(outputs);

 const client = generateClient<Schema>();

export default function Utilities(){


    async function resetTeamQuestions(){
        try {
            const teamQuestions = await client.models.TeamQuestions.list({    });
            //console.log(questions);
            for (const teamQuestion of teamQuestions.data) {

                if(String(teamQuestion.question_number).substring(String(teamQuestion.question_number).length -1) == "A"){
                    await client.models.TeamQuestions.update({
                    id: teamQuestion.id,
                    team_answer: "",
                    show: "Y",
                    is_correct: "",
                    pass_played: "",
                    question_type: "puzzle"
                    });
                }else{
                    await client.models.TeamQuestions.update({
                    id: teamQuestion.id,
                    team_answer: "",
                    show: "",
                    is_correct: "",
                    pass_played: "",
                    question_type: "location"
                    })
                }
            }
        }catch(err){
            console.error("Error:", err);
        }
    } 

    async function createNewQUiz(name: string, startTime: string){
        try {
            const newQuiz = await client.models.Quiz.create({
                name: name,
                start_time: startTime
            });
            console.log(String(newQuiz.data?.id));
            createNewQUizQuestions(String(newQuiz.data?.id))
        }catch(err){
            console.log("Error:", err);
        } 
    }   

    async function createNewQUizQuestions(newQuizId: string){
        console.log("question creation commenced");
        try{
            for (let i = 1; i<11; i++) {
                console.log ("Block statement execution no." + i);
                let questionNumber = i + "A";
                if(questionNumber.length < 3){
                    questionNumber = "0" + questionNumber;
                }
                await client.models.Questions.create({
                    quiz_id: newQuizId,
                    question_number: questionNumber,
                    question: "Add together: " + String(i) + " + " + String(i),
                    question_type: "puzzle",
                    location: "",
                    category: "Text",
                    answer: String(i + i),
                    show: "Y"
                });
                questionNumber = i + "B";
                if(questionNumber.length < 3){
                    questionNumber = "0" + questionNumber;
                }
                await client.models.Questions.create({
                    quiz_id: newQuizId,
                    question_number: questionNumber,
                    question: "What is " + String(i) + "squared",
                    question_type: "location",
                    location: "Location: " + questionNumber,
                    category: "",
                    answer: String(i * i),
                    show: ""
                });
            }
    
        }catch(err){
            console.log("Error:", err);

        }
    }


    return(
        <div>
            <Button variant="primary" type="button" onClick={async () => {
            await resetTeamQuestions()
            }}>
            Reset team questions
            </Button>

            <Button variant="primary" type="button" onClick={async () => {
            await createNewQUiz("Test Quiz", "2025-11-30T10:40:38Z")
            }}>
            Create New Quiz Tables
            </Button>
        </div> 
    )

}
