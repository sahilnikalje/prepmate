import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

//todo Stub for starting an interview session
const startInterview = async ({
  role,
  category,
  industry,
  jobDescription,
  resumeFile,
}) => {
  // --- DUMMY (remove when backend ready) ---
  //  return {interviewId:'dummy-123'}
  const formData = new FormData();
  formData.append("role", role);
  formData.append("category", category);
  formData.append("industry", industry);
  formData.append("jobDescription", jobDescription);
  formData.append("resume", resumeFile);

  const response = await api.post("/api/interview", formData);
  return response.data;
};

//todo Get interview session by ID
const getInterview = async (id) => {
  const response = await api.get(`/api/interview/${id}`);
  return response.data;
};

//todo Stub for generating JD via Groq AI
const generateJobDescription = async ({ role, category, industry }) => {
  //! dummy
  return {
    jobDescription: `
          We are looking for a skilled and motivated ${role} specializing in ${category} within the ${industry} industry. The ideal candidate should have a strong understanding of their domain, a structured approach to problem-solving, and the ability to contribute effectively in a collaborative environment.

  Key Responsibilities:
- Plan, execute, and deliver tasks aligned with business goals and user needs
- Collaborate with cross-functional teams to ensure smooth workflow and successful outcomes
- Analyze requirements and contribute to creating effective solutions or strategies
- Maintain quality, consistency, and efficiency in all deliverables
- Identify challenges, propose improvements, and take ownership of outcomes
- Ensure adherence to best practices, standards, and timelines

Core Skills:
- Strong knowledge and practical understanding of ${category}
- Ability to think critically and solve real-world problems
- Good organizational and time management skills
- Familiarity with tools, processes, or methodologies relevant to the ${industry}
- Capability to adapt to changing requirements and environments

Preferred Qualifications:
- Prior experience, projects, or internships in a similar role
- Exposure to real-world workflows and team collaboration
- Understanding of performance optimization, user experience, or business impact (as applicable)

Soft Skills:
- Clear communication and teamwork abilities
- Proactive mindset with willingness to learn and improve
- Attention to detail and accountability for work

What We Offer:
- Opportunity to work on real-world challenges across the ${industry} industry
- Collaborative and growth-focused environment
- Exposure to modern tools, practices, and workflows
- Continuous learning and development opportunities

If you are passionate about contributing to impactful work and growing as a ${role} in the ${industry} industry, we would love to have you on board.
`,
  };
};

export default { startInterview, generateJobDescription, getInterview };
