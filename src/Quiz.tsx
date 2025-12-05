import { useEffect, useState } from "react";
//import { client } from "../amplify/data/client";

import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();


export default function Quiz({ id }:{id: string}) {
  
    const [quiz, setQuiz] = useState<Schema["Quiz"]["type"] | null>(null);

    useEffect(() => {
        async function fetchQuiz() {
        const result = await client.models.Quiz.get({ id });
        setQuiz(result.data) // `data` is the single DynamoDB item
        }

        fetchQuiz();
    }, [id]); 

    if (!quiz) return( <p>Loading...</p>);

    return (
        <div>
        <h2>{quiz.name}</h2>
        
        </div>
    );
}
