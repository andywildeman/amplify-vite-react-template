 import { generateClient } from "aws-amplify/api";
 import { Amplify } from "aws-amplify";
 import outputs from "../amplify_outputs.json";
 import type { Schema } from "../amplify/data/resource";
//import { Color } from 'aws-cdk-lib/aws-cloudwatch';
//import { Container } from 'react-bootstrap';
 import Button from 'react-bootstrap/Button';
//import { a } from "@aws-amplify/backend";
import { SelectField } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import AdminAccordion from "./admin-accordion";
import QuizResults from "./admin-resultsTable.tsx";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function Utilities(){

  let defaultQuizId = '';
  if(window.sessionStorage.getItem('quizId') != null){
    defaultQuizId = String(window.sessionStorage.getItem('quizId'));
  }

  const [quizzes, setQuizzes] = useState<Array<Schema["Quiz"]["type"]>>([]);
  const [selectedQuiz, setSelectedQuiz] = useState(defaultQuizId);

  const [teams, setTeams] = useState<Array<Schema["Teams"]["type"]>>([]);
  const [selectedTeam, setSelectedTeam] = useState(defaultQuizId);

  // 🔹 Load quizzes ONCE
  useEffect(() => {
    const loadQuizzes = async () => {
      const result = await client.models.Quiz.list({});
      setQuizzes(result.data);
    };
    loadQuizzes();
  }, []);

  // 🔹 Load teams WHEN quiz changes
  useEffect(() => {
    if (!selectedQuiz) {
      setTeams([]);
      setSelectedTeam("");
      return;
    }
 
    const loadTeams = async () => {
      const result = await client.models.Teams.list({
        filter: { quiz_id: { eq: selectedQuiz } },
      });
      setTeams(result.data);
    };

    loadTeams();
  }, [selectedQuiz]);

  const updateSelectedQuiz = (quizId: string) => {
    setSelectedQuiz(quizId);
    setSelectedTeam(""); // reset team
    sessionStorage.setItem("quizId", quizId);
  };

  const updateSelectedTeam = (teamId: string) => {
    setSelectedTeam(teamId);
    sessionStorage.setItem("teamId", teamId);
  };

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

    async function deleteTeamAndQuestions(teamId: string){
        console.log(teamId);
      //await client.models.Teams.delete
      //({
        //filter: { quiz_id: { eq: selectedQuiz } },
      //});
    }

    return(
        <div>
            <div>
                <SelectField label="Quiz" 
                    value={selectedQuiz}
                     onChange={(e) => updateSelectedQuiz(e.target.value)}
                >
                    <option value="">Select a quiz</option>
                    {quizzes.map((quiz) => (
                    <option key={quiz.id} value={quiz.id}>
                        {quiz.name}
                    </option>
                    ))}
                </SelectField>
            </div>
            <p>{selectedQuiz}</p>

            <div>
                <SelectField label="Teams" 
                    value={selectedTeam}
                     onChange={(e) => updateSelectedTeam(e.target.value)}
                >
                    <option value="">Select a team</option>
                    {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                        {team.name}
                    </option>
                    ))}
                </SelectField>
            </div>
            <p>{selectedTeam}</p>

            <QuizResults quizId={selectedQuiz}></QuizResults>

            <AdminAccordion quizId={selectedQuiz}></AdminAccordion>

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

            <Button variant="primary" type="button" onClick={async () => {
            await deleteTeamAndQuestions("1234")
            }}>
            Create New Quiz Tables
            </Button>
        </div> 

    )

}
