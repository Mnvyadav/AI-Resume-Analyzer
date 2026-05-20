import { useEffect, useState } from "react";
import { supabase } from "../supabase";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setResumes(data);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(fileName, file);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("resumes")
      .getPublicUrl(fileName);

    const { error: dbError } = await supabase
      .from("resumes")
      .insert([
        {
          user_id: user.id,
          file_name: file.name,
          file_url: publicUrl,
        },
      ]);

    if (dbError) {
      alert(dbError.message);
    } else {
      alert("Resume uploaded!");

      fetchResumes();
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Upload Resume
      </button>

      <hr />

      <h2>Your Uploaded Resumes</h2>

      {resumes.map((resume) => (
        <div
          key={resume.id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{resume.file_name}</h3>

          <a
            href={resume.file_url}
            target="_blank"
          >
            View Resume
          </a>

          <p>
            Uploaded:
            {" "}
            {new Date(
              resume.created_at
            ).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;