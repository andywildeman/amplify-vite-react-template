import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import type { Schema } from "../amplify/data/resource";

 Amplify.configure(outputs);

 const client = generateClient<Schema>();

 type TeamTotalsProps = {
  quizId: string;
  teamId: string;
};

export default function TeamTotals({quizId, teamId}: TeamTotalsProps) {
  const [count, setCount] = useState<string | null>(null);

  useEffect(() => {
    const loadCount = async () => {
      const result = await client.models.TeamAnswers.list({
      filter: {
        and: [
          { quiz_id: { eq: quizId }},
          { team_id: { eq: teamId }},
          { is_correct:{ eq: "Y" }}
        ]
      }
    });
    let puzzleCount: number = 0;
    let locationCount: number = 0;
    
    result.data.forEach(function (value) {
        console.log(String(value.question_number).substring(2,1));
      if(String(value.question_number).substring(3,0) == "A"){
        puzzleCount ++;
      }else{
        locationCount ++;
      }
    }); 
    let totals = "solved puzzles: " + puzzleCount;
    totals += "<br />solved Location challenges: " + locationCount;
    totals += "Total score: " + puzzleCount + locationCount;
      setCount(totals);
    };

    loadCount();
  }, []);

  return (
    <p>
      {count}
    </p>
  );
}

