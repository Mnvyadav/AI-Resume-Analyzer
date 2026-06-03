import SkillsChart from "../components/SkillsChart";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import axios from "axios";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [file, setFile] = useState(null);

  const [resumes, setResumes] = useState([]);

  const [extractedText, setExtractedText] =
    useState("");

  const [atsScore, setAtsScore] =
    useState(null);

  const [strengths, setStrengths] =
    useState([]);

  const [weaknesses, setWeaknesses] =
    useState([]);

  const [missingSkills, setMissingSkills] =
    useState([]);

  const [suggestions, setSuggestions] =
    useState([]);

  const [darkMode, setDarkMode] =
  useState(false);

  const [
    interviewQuestions,
    setInterviewQuestions,
  ] = useState([]);

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
      .order("created_at", {
        ascending: false,
      });

    if (!error) {
      setResumes(data);
    }
  };

  const analyzeResume = async (
    extractedText
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/ai/analyze-resume",
        {
          resumeText: extractedText,
        }
      );

      setAtsScore(
        response.data.atsScore
      );

      setStrengths(
        response.data.strengths
      );

      setWeaknesses(
        response.data.weaknesses
      );

      setMissingSkills(
        response.data.missingSkills
      );

      setSuggestions(
        response.data.suggestions
      );

      setInterviewQuestions(
        response.data.interviewQuestions
      );

    } catch (error) {
      console.log(error);
      alert("AI analysis failed");
    }
  };

  const extractResumeText = async (
    selectedFile
  ) => {
    try {
      const formData = new FormData();

      formData.append(
        "resume",
        selectedFile
      );

      const response = await axios.post(
        "http://localhost:5000/api/resume/extract-text",
        formData
      );

      const text =
        response.data.extractedText;

      setExtractedText(text);

      await analyzeResume(text);

    } catch (error) {
      console.log(error);
      alert("Text extraction failed");
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

    const { error: uploadError } =
      await supabase.storage
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

    const { error: dbError } =
      await supabase
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
      alert(
        "Resume uploaded successfully!"
      );

      await extractResumeText(file);

      fetchResumes();
    }
  };

  return (
    <>
      <Navbar />

      <div className={`min-h-screen p-8 ${
        darkMode
      ? "bg-slate-900 text-white"
      : "bg-gray-100 text-black"
        }`}
      >
        <h1 className="text-4xl font-bold mb-8">
          AI Resume Analyzer
        </h1>

        <button
          onClick={() =>
            setDarkMode(!darkMode)
          }
          className="mb-6 bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {darkMode
            ? "Light Mode"
            : "Dark Mode"}
        </button>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setFile(
                e.target.files[0]
              )
            }
          />

          <br />
          <br />

          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Upload Resume
          </button>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-bold">
            ATS Score
          </h2>

          <p className="text-5xl font-bold mt-4">
            {atsScore || 0}%
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">
              Missing Skills
            </h2>

            <ul>
              {missingSkills.map(
                (skill) => (
                  <li key={skill}>
                    • {skill}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">
              Suggestions
            </h2>

            <ul>
              {suggestions.map(
                (item) => (
                  <li key={item}>
                    • {item}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">
              Strengths
            </h2>

            <ul>
              {strengths.map(
                (item) => (
                  <li key={item}>
                    • {item}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">
              Weaknesses
            </h2>

            <ul>
              {weaknesses.map(
                (item) => (
                  <li key={item}>
                    • {item}
                  </li>
                )
              )}
            </ul>
          </div>

        </div>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">
            Interview Questions
          </h2>

          <ul>
            {interviewQuestions.map(
              (q) => (
                <li key={q}>
                  • {q}
                </li>
              )
            )}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">
            Extracted Resume Text
          </h2>

          <textarea
            rows="12"
            value={extractedText}
            readOnly
            className="w-full border p-3 rounded"
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Skill Analysis
          </h2>

          <SkillsChart />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">
            Uploaded Resumes
          </h2>

          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white p-4 rounded-xl shadow-md mb-4"
            >
              <h3 className="font-semibold">
                {resume.file_name}
              </h3>

              <a
                href={resume.file_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View Resume
              </a>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

export default Dashboard;