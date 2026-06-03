const express = require("express");

const router = express.Router();

router.post("/analyze-resume", async (req, res) => {
  try {
    const { resumeText } = req.body;

    const analysis = `
ATS Score: 84/100

Strengths:
- Strong React fundamentals
- Good cloud computing background
- Full-stack project experience

Weaknesses:
- Missing internship experience
- Resume lacks measurable achievements
- Could improve project descriptions

Missing Skills:
- Docker
- CI/CD
- AWS Deployment

Suggestions:
- Add GitHub project links
- Add metrics to projects
- Improve ATS keywords
- Add certifications section

Recommended Roles:
- Frontend Developer
- Full Stack Intern
- Cloud Engineering Intern

Interview Questions:
1. Explain React hooks.
2. What is REST API?
3. Difference between SQL and NoSQL?
4. Explain authentication flow.
5. What is cloud deployment?
`;

    res.json({
  atsScore: 84,

  strengths: [
    "Strong React fundamentals",
    "Cloud Computing knowledge",
    "Good full-stack projects"
  ],

  weaknesses: [
    "No internship experience",
    "Few measurable achievements"
  ],

  missingSkills: [
    "Docker",
    "CI/CD",
    "AWS"
  ],

  suggestions: [
    "Add GitHub links",
    "Add project metrics",
    "Add certifications"
  ],

  interviewQuestions: [
    "Explain React Hooks",
    "What is REST API?",
    "Difference between SQL and NoSQL?"
  ]
});

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "AI analysis failed",
    });
  }
});

module.exports = router;