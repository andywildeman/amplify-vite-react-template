import React from "react";
import {createRoot} from "react-dom/client";
import QuizAccordion from  "./Accordion.tsx";
import AppNavbar from "./navbar.tsx"
import '@aws-amplify/ui-react/styles.css'
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import Team from "./Team.tsx";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Authenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import Utilities from "./Utilities.tsx";
import { getCurrentUser } from 'aws-amplify/auth';
//import { render } from "react-dom";

Amplify.configure(outputs);
const client = generateClient<Schema>();

async function isUserAuthenticated() {
  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
}

async function getQuiz(quizId: string) {
  //console.log(quizId);
  if (quizId != null) {
    try {
      const theQuiz = await client.models.Quiz.get({ id: quizId });
      window.sessionStorage.setItem("quizId", String(theQuiz.data?.id));
      window.sessionStorage.setItem("quizName", String(theQuiz.data?.name));
      const timeNow = new Date();
      const quizStartTime = new Date(String(theQuiz.data?.start_time));
      console.log(timeNow);
      console.log(quizStartTime);
      if(timeNow >= quizStartTime){
        console.log("quiz started")
        window.sessionStorage.setItem("quizStarted", "Y");
      }else{
        window.sessionStorage.setItem("quizStarted", "N");
      }
      //console.log(quiz);
      if(await isUserAuthenticated()){
          getUserEmail(quizId); 
      }else{
        renderControls("");
      }
       
      
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
        window.sessionStorage.setItem("teamName", String(team.name));
        console.log("TeamId" + team.id);
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
//console.log(urlParams);
if(urlParams.get('quizId') != null){
  console.log(urlParams.get('quizId'));
  //window.sessionStorage.setItem("quizId", String(urlParams.get('quizId')));
  getQuiz(String(urlParams.get('quizId')));
}

if(urlParams.get('admin') != null){
  //console.log(urlParams.get('admin'));
  window.sessionStorage.setItem("admin", String(urlParams.get('admin')));
}
else{
  window.sessionStorage.setItem("admin", "false");
}

function renderControls(teamId: string){
  //console.log(teamId);
  //console.log(getQuiz('c7534ee4-6115-48ac-a929-2e3f9ff9c770'))

  const root = createRoot(document.getElementById("root")!)
  if(String(window.sessionStorage.getItem('admin')) == "true"){
    root.render(
      <React.StrictMode>
        <Authenticator>
          <Utilities />
        </Authenticator>
      </React.StrictMode>
    )
  }else if(teamId != ""){
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

