import { getUrl } from "aws-amplify/storage";
import { useState, useEffect } from "react";

type S3ObjectHtmlProps = {
  quizId: any;
  questionId: any;
  fileType: any;
};

export default function S3ObjectHtml({ quizId, questionId, fileType }: S3ObjectHtmlProps) {
  //filePath = "c7534ee4-6115-48ac-a929-2e3f9ff9c770/8f58377a-bbfa-4e4f-a06a-3e6555c96171.wav";
  
  if(fileType!=null && fileType.toString().includes(":")){

    const filePath = quizId + "/" + questionId + "." + fileType.split(':')[1];
    
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    useEffect(() => {
      async function load() {
        const {url} = await getUrl({
          path: filePath
        });
        console.log(url.toString());
        setFileUrl(url.toString());
        
      }

      load();
    }, []);

    switch(fileType) { 
      case "URL:wav": { 
        return(
          <div>
            {fileUrl ? (
              <audio controls src={fileUrl} />
              ) : (
              <p>Loading audio…</p> 
            )}       
          </div>
        ); 
      } 
      case "URL:png": { 
        return(
          <div>
            {fileUrl ? (
              <img src={fileUrl} />
              ) : (
              <p>Loading audio…</p> 
            )}    
          </div>
        ) 
    
      } 
      default: { 
        return(<div></div>)
      } 
    } 
  }else{
    return(<div></div>)
  } 
  
}