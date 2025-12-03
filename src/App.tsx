//import { useEffect, useState } from "react";
//import type { Schema } from "../amplify/data/resource";
//import { generateClient } from "aws-amplify/data";
import QuizAccordion from  "./Accordion.tsx";

//const client = generateClient<Schema>();

function App() {
  return (
    QuizAccordion()
  );
}

export default App;