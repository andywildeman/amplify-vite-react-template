import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Questions: a
    .model({
      quiz_id: a.string(),
      question_number: a.string(),
      image: a.string(),
      question: a.string(),
      question_type: a.string(),
      location: a.string(),
      category: a.string(),
      answer: a.string(),
      show: a.string()
    }),
  Quiz: a
    .model({
      name: a.string(),
      start_time: a.string()
    }),
  Teams: a
    .model({
      quiz_id: a.string(),
      name: a.string(),
      team_leader: a.string(),
      team_leader_email: a.string(),
      members: a.string()
    }),
  TeamAnswers: a
    .model({
      quiz_id: a.string(),
      team_id: a.id(),
      question_id: a.string(),
      question_number: a.string(),
      question: a.string(),
      category: a.string(),
      team_answer: a.string(),
      is_correct: a.string(),
      pass_played: a.string()
    }),
  Answers: a
    .model({
      quiz_id: a.string(),
      question_number: a.string(),
      question_id: a.string(),
      answer: a.string()
    })
    
}).authorization((allow) => [allow.publicApiKey()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
