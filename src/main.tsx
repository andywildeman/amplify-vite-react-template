import React from "react";
import {createRoot} from "react-dom/client";
import App from "./App.tsx";
//import "./index.css";
import '@aws-amplify/ui-react/styles.css'
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import Example from "./Team.tsx";
import Quiz from "./Quiz.tsx";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

Amplify.configure(outputs);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const quizId = urlParams.get('quizId')
console.log(quizId);

const client = generateClient<Schema>();

if(quizId != null){
  try {
    const quiz = await getQuiz({ id: quizId });
    console.log(quiz);
    if(quiz != null){
      window.sessionStorage.setItem('quizId', JSON.stringify(quizId));
    }
  } catch (err) {
    console.error("Error:", err);
  }
  
}
console.log(window.sessionStorage.getItem('quizId'));
//console.log(getQuiz('c7534ee4-6115-48ac-a929-2e3f9ff9c770'))

const root = createRoot(document.getElementById("root")!)
if(quizId == "123"){
  root.render(
    <React.StrictMode>
      <App />
      <Example />
    </React.StrictMode>
  )
}else{
  root.render(
      <React.StrictMode>
      <Quiz id='c7534ee4-6115-48ac-a929-2e3f9ff9c770' />
    </React.StrictMode>
    )
}


export async function getQuiz({ id }: { id: string }) {
  const { data: quiz, errors } = await client.models.Quiz.get({ id });

  if (errors) {
    console.error(errors);
    throw new Error("Failed to fetch quiz");
  }

  return quiz;
}

