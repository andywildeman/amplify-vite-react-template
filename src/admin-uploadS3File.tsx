import React from "react";
import { uploadData } from "aws-amplify/storage";

type UploadFIleProps = {
  quizId: any,
  questionId: any;
};

function S3FileUpload({quizId, questionId}: UploadFIleProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
 
    const fullS3Path = quizId + '/' + questionId  + file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    console.log(fullS3Path);

    try {
      await uploadData({
        path: fullS3Path,
        data: file,
      }).result;

      alert("✅ Upload successful");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleChange} disabled={uploading} />
      <button type="button" onClick={handleClick} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

export default S3FileUpload;
