require('dotenv').config({ path: '../.env' })
const mongoose = require('mongoose')
const Resource = require('../models/Resource.model')

const resources = [
  //! ─── DSA ───────────────────────────────────────────
  {
    title: "Two Sum Problem",
    category: "DSA", role: "Backend", difficulty: "Beginner", type: "Technical",
    question: "Given an array of integers and a target, return indices of two numbers that add up to the target.",
    answer: "Use a hash map. For each number, check if (target - num) exists in the map. If yes, return both indices. If no, store the number with its index.",
    explanation: "Time complexity O(n), Space complexity O(n). The brute force is O(n²) — always explain trade-offs.",
    aiInsight: "Interviewers usually follow up asking: can you do it with O(1) space? Answer: no for this problem without sorting.",
    tags: ["Array", "HashMap", "Easy"],
    duration: "10 min",
    isFeatured: true,
    externalLinks: [{ label: "LeetCode #1", url: "https://leetcode.com/problems/two-sum/" }],
  },
  {
    title: "Binary Search",
    category: "DSA", role: "Backend", difficulty: "Beginner", type: "Technical",
    question: "Implement binary search on a sorted array. What is its time complexity?",
    answer: "Divide the array in half each iteration. Compare mid element with target. If equal return mid. If target > mid, search right half. If target < mid, search left half. Time: O(log n).",
    explanation: "Binary search only works on sorted arrays. Always verify the input is sorted before applying it.",
    aiInsight: "Follow-up: What happens if the array has duplicates? You need to handle left and right boundary searches.",
    tags: ["Array", "Divide & Conquer", "Search"],
    duration: "8 min",
    isFeatured: false,
    externalLinks: [{ label: "LeetCode #704", url: "https://leetcode.com/problems/binary-search/" }],
  },
  {
    title: "Reverse a Linked List",
    category: "DSA", role: "Backend", difficulty: "Intermediate", type: "Technical",
    question: "How do you reverse a singly linked list? Explain both iterative and recursive approaches.",
    answer: "Iterative: Use three pointers — prev, curr, next. At each step: save next, point curr to prev, move prev to curr, move curr to next. Recursive: reverse(head.next) then set head.next.next = head and head.next = null.",
    explanation: "Iterative is O(n) time O(1) space. Recursive is O(n) time O(n) space due to call stack.",
    aiInsight: "Very common in FAANG interviews. Always draw it on a whiteboard — interviewers appreciate visual thinking.",
    tags: ["Linked List", "Pointers", "Recursion"],
    duration: "12 min",
    isFeatured: true,
    externalLinks: [{ label: "LeetCode #206", url: "https://leetcode.com/problems/reverse-linked-list/" }],
  },
  {
    title: "Valid Parentheses",
    category: "DSA", role: "General", difficulty: "Beginner", type: "Technical",
    question: "Given a string containing just '(', ')', '{', '}', '[', ']', determine if it is valid.",
    answer: "Use a stack. Push opening brackets. When closing bracket found, check if top of stack is matching opening bracket. If yes pop, if no return false. At the end stack should be empty.",
    explanation: "Classic stack problem. Time O(n), Space O(n).",
    aiInsight: "Follow-up: What if you had to return the minimum number of characters to remove to make it valid?",
    tags: ["Stack", "String", "Easy"],
    duration: "8 min",
    isFeatured: false,
    externalLinks: [{ label: "LeetCode #20", url: "https://leetcode.com/problems/valid-parentheses/" }],
  },

  //! ─── React ─────────────────────────────────────────
  {
    title: "What is the Virtual DOM?",
    category: "React", role: "Frontend", difficulty: "Beginner", type: "Technical",
    question: "Explain the Virtual DOM and how React uses it for rendering.",
    answer: "The Virtual DOM is an in-memory representation of the real DOM. When state changes, React creates a new Virtual DOM tree, diffs it against the previous one (reconciliation), and only updates the real DOM where changes occurred.",
    explanation: "This makes updates much faster because real DOM manipulation is expensive. React batches multiple updates together.",
    aiInsight: "Interviewers often follow up with: 'What is React Fiber?' — Fiber is the reconciliation engine introduced in React 16.",
    tags: ["React Core", "Performance", "DOM"],
    duration: "10 min",
    isFeatured: true,
    externalLinks: [{ label: "React Docs", url: "https://react.dev/learn/preserving-and-resetting-state" }],
  },
  {
    title: "useEffect vs useLayoutEffect",
    category: "React", role: "Frontend", difficulty: "Intermediate", type: "Technical",
    question: "What is the difference between useEffect and useLayoutEffect? When would you use each?",
    answer: "useEffect runs asynchronously after the browser paints — good for API calls, subscriptions. useLayoutEffect runs synchronously after DOM mutations but before paint — use when you need to read/modify DOM layout before the user sees it (e.g., measuring element size).",
    explanation: "Misusing useLayoutEffect can block painting and cause visual jank. Always prefer useEffect unless you have a specific layout reading need.",
    aiInsight: "Common senior-level question. Mention that useLayoutEffect has the same signature as useEffect.",
    tags: ["Hooks", "React Core", "Performance"],
    duration: "12 min",
    isFeatured: true,
    externalLinks: [{ label: "React Docs", url: "https://react.dev/reference/react/useLayoutEffect" }],
  },
  {
    title: "React Reconciliation",
    category: "React", role: "Frontend", difficulty: "Advanced", type: "Technical",
    question: "How does React's reconciliation algorithm work? What is the role of keys?",
    answer: "React diffs two trees level by level. Same type elements get updated, different type elements get destroyed and recreated. Keys help React identify which items in a list changed — without keys React re-renders all list items on any change.",
    explanation: "Never use array index as key for dynamic lists — it breaks reconciliation when items are reordered.",
    aiInsight: "Follow-up: What is React Fiber's priority scheduling? Fiber lets React split rendering work into chunks and pause/resume.",
    tags: ["React Core", "Performance", "Advanced"],
    duration: "15 min",
    isFeatured: false,
    externalLinks: [{ label: "React Docs on Reconciliation", url: "https://legacy.reactjs.org/docs/reconciliation.html" }],
  },
  {
    title: "useMemo vs useCallback",
    category: "React", role: "Frontend", difficulty: "Intermediate", type: "Technical",
    question: "When would you use useMemo vs useCallback? What problem do they solve?",
    answer: "useMemo memoizes the return value of a function — use when computation is expensive. useCallback memoizes the function reference itself — use when passing callbacks to child components to prevent unnecessary re-renders.",
    explanation: "Both are optimization tools. Don't overuse — premature optimization adds complexity without benefit.",
    aiInsight: "Interviewers look for you to mention React.memo alongside useCallback — they work together.",
    tags: ["Hooks", "Performance", "Memoization"],
    duration: "10 min",
    isFeatured: false,
    externalLinks: [{ label: "React Docs", url: "https://react.dev/reference/react/useMemo" }],
  },

  //! ─── Node.js ───────────────────────────────────────
  {
    title: "Event Loop Explained",
    category: "Node.js", role: "Backend", difficulty: "Intermediate", type: "Technical",
    question: "Explain the Node.js Event Loop. How does it handle asynchronous operations?",
    answer: "Node.js is single-threaded but uses libuv for async I/O. The event loop has phases: timers (setTimeout/setInterval), pending callbacks, idle/prepare, poll (fetch I/O events), check (setImmediate), close callbacks. Each phase has a queue — the loop processes them in order.",
    explanation: "The key insight is that Node.js offloads I/O to the OS and uses callbacks when operations complete — this is what makes it non-blocking.",
    aiInsight: "Always mention process.nextTick() — it runs before the next event loop iteration, even before Promises.",
    tags: ["Node Core", "Async", "Performance"],
    duration: "15 min",
    isFeatured: true,
    externalLinks: [{ label: "Node.js Docs", url: "https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick" }],
  },
  {
    title: "Streams in Node.js",
    category: "Node.js", role: "Backend", difficulty: "Advanced", type: "Technical",
    question: "What are streams in Node.js and when would you use them?",
    answer: "Streams are objects that let you read/write data continuously rather than loading it all into memory. Types: Readable, Writable, Duplex, Transform. Use streams for large file processing, HTTP requests/responses, video streaming.",
    explanation: "Without streams, reading a 1GB file loads it all into RAM. With streams, you process it chunk by chunk — dramatically lower memory footprint.",
    aiInsight: "Interviewers love follow-up: pipe() method — it connects a readable stream to a writable stream automatically.",
    tags: ["Node Core", "I/O", "Memory"],
    duration: "12 min",
    isFeatured: false,
    externalLinks: [{ label: "Node.js Stream Docs", url: "https://nodejs.org/api/stream.html" }],
  },
  {
    title: "JWT Authentication",
    category: "Node.js", role: "Backend", difficulty: "Intermediate", type: "Technical",
    question: "How does JWT authentication work? What are its advantages and disadvantages?",
    answer: "JWT has three parts: Header (algorithm), Payload (claims/data), Signature (hash of header+payload+secret). Server creates and signs the token on login. Client sends it with each request. Server verifies signature — no DB lookup needed. Advantages: stateless, scalable. Disadvantages: can't invalidate tokens before expiry.",
    explanation: "Store JWTs in httpOnly cookies — never localStorage. localStorage is vulnerable to XSS attacks.",
    aiInsight: "Follow-up: How would you invalidate a JWT? Use a token blacklist in Redis or short expiry + refresh tokens.",
    tags: ["Auth", "Security", "Backend"],
    duration: "12 min",
    isFeatured: true,
    externalLinks: [{ label: "JWT.io", url: "https://jwt.io/introduction" }],
  },

  //! ─── System Design ─────────────────────────────────
  {
    title: "Design a URL Shortener",
    category: "System Design", role: "Full Stack", difficulty: "Intermediate", type: "Technical",
    question: "Design a URL shortening service like bit.ly. Walk through the architecture.",
    answer: "Components: API server, DB to store long→short mapping, Cache (Redis) for hot URLs, CDN for global distribution. For short URL generation: use base62 encoding of an auto-incremented ID. Handle redirects with 301 (permanent) or 302 (temporary). Scale: shard DB by hash of short URL.",
    explanation: "Key decisions: 301 vs 302 redirect (301 is cached by browser, 302 goes to server each time — 302 gives better analytics). Custom aliases need collision detection.",
    aiInsight: "This is a classic system design warm-up. Always start with requirements: QPS, read/write ratio, storage needs.",
    tags: ["System Design", "Scalability", "Database"],
    duration: "25 min",
    isFeatured: true,
    externalLinks: [{ label: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" }],
  },
  {
    title: "CAP Theorem",
    category: "System Design", role: "Backend", difficulty: "Advanced", type: "Technical",
    question: "Explain the CAP theorem and how it applies to distributed systems design.",
    answer: "CAP: Consistency (all nodes see same data), Availability (every request gets a response), Partition Tolerance (system works despite network failures). You can only guarantee 2 of 3. In practice, networks fail, so you must choose between CP (consistent) and AP (available) systems. MongoDB is CP. Cassandra is AP.",
    explanation: "Modern systems like DynamoDB offer tunable consistency — you can choose per-operation whether to prioritize C or A.",
    aiInsight: "Senior engineers are expected to discuss PACELC theorem which extends CAP — it considers latency vs consistency trade-offs even without partitions.",
    tags: ["Distributed Systems", "Database", "Architecture"],
    duration: "20 min",
    isFeatured: false,
    externalLinks: [{ label: "CAP Theorem Guide", url: "https://www.ibm.com/topics/cap-theorem" }],
  },

  //! ─── Behavioral ────────────────────────────────────
  {
    title: "Tell Me About a Conflict With a Teammate",
    category: "Behavioral", role: "General", difficulty: "Intermediate", type: "Behavioral",
    question: "Tell me about a time you had a conflict with a teammate. How did you resolve it?",
    answer: "Use STAR method: Situation — briefly describe the conflict. Task — what was at stake. Action — how you approached resolution (direct conversation, active listening, finding common ground). Result — positive outcome, what you learned.",
    explanation: "Avoid blaming the other person. Show emotional intelligence — acknowledge their perspective. End with what you learned.",
    aiInsight: "Interviewers want to see: self-awareness, communication skills, and the ability to collaborate under tension.",
    tags: ["STAR Method", "Communication", "Teamwork"],
    duration: "8 min",
    isFeatured: true,
    externalLinks: [{ label: "STAR Method Guide", url: "https://www.indeed.com/career-advice/interviewing/star-interview-questions" }],
  },
  {
    title: "Describe a Time You Failed",
    category: "Behavioral", role: "General", difficulty: "Intermediate", type: "Behavioral",
    question: "Tell me about a time you failed. What happened and what did you learn?",
    answer: "Choose a real failure that was meaningful but not catastrophic. STAR: Situation — set the context. Task — what you were responsible for. Action — what you did, including the mistake. Result — the outcome AND what you learned, changed afterward.",
    explanation: "This question tests self-awareness and growth mindset. Never choose a failure that shows a core character flaw.",
    aiInsight: "The best answers show you took ownership without blaming others, and demonstrate concrete changes you made afterward.",
    tags: ["STAR Method", "Self-Awareness", "Growth"],
    duration: "8 min",
    isFeatured: false,
    externalLinks: [],
  },
  {
    title: "Why Do You Want This Role?",
    category: "Behavioral", role: "General", difficulty: "Beginner", type: "Behavioral",
    question: "Why do you want this specific role at this company?",
    answer: "Structure: 1) Connect your skills to the role requirements. 2) Show genuine interest in the company's mission/product. 3) Explain how this role fits your career trajectory. Be specific — reference actual company projects, values, or products.",
    explanation: "Generic answers kill your chances. Do research before the interview. Mention a specific product feature, company initiative, or engineering blog post.",
    aiInsight: "The interviewer is checking: Do you actually want THIS job or just any job? Specificity signals genuine interest.",
    tags: ["Motivation", "Research", "Career Goals"],
    duration: "5 min",
    isFeatured: false,
    externalLinks: [],
  },

  //! ─── HR ────────────────────────────────────────────
  {
    title: "Introduce Yourself",
    category: "HR", role: "General", difficulty: "Beginner", type: "HR",
    question: "Tell me about yourself. Walk me through your background.",
    answer: "Use the Present-Past-Future formula: Present — your current role/situation and key skills. Past — relevant experience that built those skills. Future — why you're excited about this opportunity and where you want to go.",
    explanation: "Keep it to 90 seconds max. Practice it until it feels natural but not scripted. Tailor it to each role.",
    aiInsight: "This sets the tone for the entire interview. End with a line that naturally leads into the job — 'which is why this role caught my attention.'",
    tags: ["Introduction", "Communication", "First Impression"],
    duration: "5 min",
    isFeatured: true,
    externalLinks: [],
  },
  {
    title: "Salary Expectation Discussion",
    category: "HR", role: "General", difficulty: "Intermediate", type: "HR",
    question: "What are your salary expectations?",
    answer: "Research market rates first (Glassdoor, Levels.fyi, LinkedIn Salary). Give a range with your target at the lower end. Example: 'Based on my research and experience, I'm looking at ₹X–₹Y. I'm open to discussing the full compensation package.' Anchor high but reasonably.",
    explanation: "Never give a number first if you can avoid it — ask what budget they have. If forced, give a range. Never undersell.",
    aiInsight: "Mention 'total compensation' — stock, bonuses, benefits matter. Don't just focus on base salary.",
    tags: ["Negotiation", "Compensation", "HR"],
    duration: "5 min",
    isFeatured: false,
    externalLinks: [{ label: "Levels.fyi", url: "https://www.levels.fyi" }],
  },
  {
    title: "Strengths and Weaknesses",
    category: "HR", role: "General", difficulty: "Beginner", type: "HR",
    question: "What are your greatest strengths and weaknesses?",
    answer: "Strengths: Choose 2-3 relevant to the role, give a specific example for each. Weaknesses: Choose a real weakness you are actively working on — not a fake one like 'I work too hard.' Show self-awareness and the steps you're taking to improve.",
    explanation: "The weakness answer is a test of self-awareness and growth mindset. Never say 'I have no weaknesses' — it's a red flag.",
    aiInsight: "Frame your weakness as a learning opportunity: 'I used to struggle with X, so I started doing Y, and I've seen Z improvement.'",
    tags: ["Self-Awareness", "Communication", "HR"],
    duration: "8 min",
    isFeatured: false,
    externalLinks: [],
  },
]

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    //todo STEP-1: Clear existing resources
    await Resource.deleteMany({})
    console.log('Cleared existing resources')

    //todo STEP-2: Insert all resources
    await Resource.insertMany(resources)
    console.log(`Seeded ${resources.length} resources successfully`)

    process.exit(0)
  } catch (err) {
    console.error('Seed error:', err.message)
    process.exit(1)
  }
}

seedDB()