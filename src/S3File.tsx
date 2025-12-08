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
        const linkToStorageFile = await getUrl({
          path: filePath,
        });
        console.log(linkToStorageFile.url.toString());
        setFileUrl(linkToStorageFile.url.toString());
      }

      load();
    }, []);

    
    switch(fileType) { 
      case "URL:wav": { 
        return(
          <div>
          <audio controls>
            <source src={String(fileUrl)} type="audio/wav" />
          Your browser does not support the audio element.
          </audio>  
          </div>
        ); 
      } 
      case "URL:png": { 
        return(
          <div>
            <img src={String(fileUrl)} />
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