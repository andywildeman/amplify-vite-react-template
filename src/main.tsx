import React from "react";
import {createRoot} from "react-dom/client";
import QuizAccordion from  "./Accordion.tsx";
import AppNavbar from "./navbar.tsx"
//import "./index.css";
import '@aws-amplify/ui-react/styles.css'
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import Team from "./Team.tsx";
//import Quiz from "./Quiz.tsx";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Authenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';
//import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
//import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
//const s3 = new S3Client({ region: "eu-west-2" });

Amplify.configure(outputs);
const client = generateClient<Schema>();

async function getQuiz(quizId: string) {
  console.log(quizId);
  if (quizId != null) {
    try {
      const quiz = await client.models.Quiz.get({ id: quizId });
      console.log(quiz);
      getUserEmail(quizId);        
      
    } catch (err) {
      console.error("Error:", err);
    }
  }
}

async function getUserEmail(quizId: string) {
  try{
    const userAttributes = await fetchUserAttributes();
    window.sessionStorage.setItem("userEmail", String(userAttributes.email));
    //console.log(String(window.sessionStorage.getItem('quizId')));
    getUsersTeam(quizId, String(userAttributes.email));
  }catch (err) {
    console.log(err);
  }
}

async function getUsersTeam(quizId: string, teamLeaderEmail: string) {
      //teamLeaderEmail = "andy@wildeman.co.uk";
      //quizId = "c7534ee4-6115-48ac-a929-2e3f9ff9c770";
      console.log(quizId);
      //const quizId = window.sessionStorage.getItem('quizId');
    try {
      const teams = await client.models.Teams.list({ 
        filter: {
          and: [
            { quiz_id: { eq: quizId }},
            { team_leader_email: { eq: teamLeaderEmail }}
          ]
        }
      });

      const team = teams.data[0];

      if (teams.data[0] != null) {
        window.sessionStorage.setItem("teamId", team.id);
        renderControls(team.id);
        //init(String(quizId), teams.data[0].id);
      }else{
        renderControls("");
      }
    } catch (err) {
      console.error("Error:", err);
    }
}


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
console.log(urlParams);
if(urlParams.get('quizId') != null){
  console.log(urlParams.get('quizId'));
  //quizId = (String(urlParams.get('quizId'))); 
  window.sessionStorage.setItem("quizId", String(urlParams.get('quizId')));
  getQuiz(String(urlParams.get('quizId')));
}

function renderControls(teamId: string){
  console.log(teamId);
  //console.log(getQuiz('c7534ee4-6115-48ac-a929-2e3f9ff9c770'))

  const root = createRoot(document.getElementById("root")!)
  if(teamId != ""){
    root.render(
      <React.StrictMode>
        <Authenticator>
          <AppNavbar />
          <QuizAccordion />        
        </Authenticator>  
      </React.StrictMode>
    )
  }else{
    root.render(
      <React.StrictMode>
        <Authenticator>
          <Team />
        </Authenticator>
      </React.StrictMode>
      )
  }
}

