// client-side mock database simulating node express backend
const initialUsers = [
  {
    _id: "user-candidate-1",
    name: "Jane Doe",
    email: "candidate@demo.com",
    password: "password123",
    role: "candidate",
    status: "active",
    profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    candidateProfile: {
      phone: "+1 (555) 019-2834",
      location: "San Francisco, CA",
      bio: "Frontend Developer passionate about building gorgeous React applications with smooth animations and robust state management.",
      skills: ["React", "JavaScript", "Tailwind CSS", "HTML5", "CSS3", "Vite", "Node.js"],
      experience: [
        {
          _id: "exp-1",
          title: "Junior Developer",
          company: "WebTech Solutions",
          startDate: "2023-01-10",
          endDate: "2024-05-15",
          current: false,
          description: "Built responsive React pages and improved loading performance by 25%."
        }
      ],
      education: [
        {
          _id: "edu-1",
          school: "State Tech University",
          degree: "Bachelor of Science",
          fieldOfStudy: "Computer Science",
          startDate: "2019-09-01",
          endDate: "2023-06-15",
          current: false,
          description: "Graduated with honors. Specialized in human-computer interaction."
        }
      ],
      projects: [
        {
          _id: "proj-1",
          title: "Career Portals Dashboard",
          description: "A beautiful analytics dashboard for job seekers with dynamic SVG charts.",
          link: "https://github.com/demo/career-portal",
          skillsUsed: ["React", "Vite", "ChartJS"]
        }
      ],
      certifications: [
        {
          _id: "cert-1",
          name: "AWS Certified Developer",
          issuer: "Amazon Web Services",
          issueDate: "2024-02-15"
        }
      ],
      resumeUrl: "https://example.com/demo-resume.pdf",
      resumeText: "Jane Doe Resume Content",
      savedJobs: []
    }
  },
  {
    _id: "user-company-1",
    name: "John Recruiter",
    email: "company@demo.com",
    password: "password123",
    role: "company",
    status: "active",
    profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    companyProfile: {
      companyName: "Google Inc.",
      website: "https://google.com",
      description: "Organizing the world's information and making it universally accessible and useful.",
      companySize: "10000+",
      industry: "Technology & Software",
      headquarters: "Mountain View, CA",
      socialLinks: {
        linkedin: "https://linkedin.com/company/google",
        twitter: "https://twitter.com/google"
      }
    },
    companyId: "company-1"
  },
  {
    _id: "user-admin-1",
    name: "System Administrator",
    email: "admin@main.com",
    password: "password123",
    role: "admin",
    status: "active",
    profilePhoto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150"
  }
];

const initialCompanies = [
  {
    _id: "company-1",
    owner: "user-company-1",
    companyName: "Google Inc.",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100",
    website: "https://google.com",
    description: "Organizing the world's information and making it universally accessible and useful.",
    companySize: "10000+",
    industry: "Technology & Software",
    headquarters: "Mountain View, CA",
    verificationStatus: "approved"
  },
  {
    _id: "company-2",
    owner: "user-company-2",
    companyName: "Netflix",
    logo: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=100",
    website: "https://netflix.com",
    description: "Unlimited movies, TV shows, and more.",
    companySize: "5000-10000",
    industry: "Entertainment",
    headquarters: "Los Gatos, CA",
    verificationStatus: "approved"
  }
];

const initialJobs = [
  {
    _id: "job-1",
    title: "Senior React Engineer",
    description: "We are looking for a Senior React Engineer to lead our frontend architecture and design beautiful systems.",
    skillsRequired: ["React", "JavaScript", "TypeScript", "Vite", "Tailwind CSS"],
    salary: {
      min: 120000,
      max: 150000,
      currency: "USD"
    },
    experience: 5,
    location: "Remote",
    employmentType: "full-time",
    jobCategory: "Frontend Development",
    openings: 2,
    deadline: "2026-12-31T23:59:59.000Z",
    remoteType: "remote",
    benefits: ["Health Insurance", "401k Match", "Unlimited PTO"],
    status: "approved",
    company: {
      _id: "company-1",
      companyName: "Google Inc.",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100",
      industry: "Technology"
    },
    postedBy: "user-company-1",
    createdAt: "2026-06-25T10:00:00.000Z"
  },
  {
    _id: "job-2",
    title: "Frontend Developer Intern",
    description: "Gain hands-on experience building web apps with React, Vite, and tailwind.",
    skillsRequired: ["React", "JavaScript", "HTML", "CSS"],
    salary: {
      min: 40000,
      max: 60000,
      currency: "USD"
    },
    experience: 0,
    location: "New York, NY",
    employmentType: "internship",
    jobCategory: "Frontend Development",
    openings: 3,
    deadline: "2026-11-30T23:59:59.000Z",
    remoteType: "onsite",
    benefits: ["Mentorship", "Flexible Hours"],
    status: "approved",
    company: {
      _id: "company-1",
      companyName: "Google Inc.",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100",
      industry: "Technology"
    },
    postedBy: "user-company-1",
    createdAt: "2026-06-28T09:00:00.000Z"
  },
  {
    _id: "job-3",
    title: "Fullstack Developer (MERN)",
    description: "Join Netflix as a MERN stack developer working on high scalable web portals.",
    skillsRequired: ["MongoDB", "Express", "React", "Node.js"],
    salary: {
      min: 130000,
      max: 170000,
      currency: "USD"
    },
    experience: 3,
    location: "Los Gatos, CA",
    employmentType: "full-time",
    jobCategory: "Software Engineering",
    openings: 1,
    deadline: "2026-08-31T23:59:59.000Z",
    remoteType: "hybrid",
    benefits: ["Stock Options", "Free Lunches", "Gym Membership"],
    status: "approved",
    company: {
      _id: "company-2",
      companyName: "Netflix",
      logo: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=100",
      industry: "Entertainment"
    },
    postedBy: "user-company-2",
    createdAt: "2026-06-29T14:30:00.000Z"
  }
];

const initialApplications = [
  {
    _id: "app-1",
    candidate: {
      _id: "user-candidate-1",
      name: "Jane Doe",
      email: "candidate@demo.com",
      profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      candidateProfile: {
        phone: "+1 (555) 019-2834",
        location: "San Francisco, CA",
        bio: "Frontend Developer passionate about building gorgeous React applications...",
        skills: ["React", "JavaScript", "Tailwind CSS", "HTML5", "CSS3", "Vite", "Node.js"]
      }
    },
    job: {
      _id: "job-2",
      title: "Frontend Developer Intern",
      company: {
        _id: "company-1",
        companyName: "Google Inc.",
        logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100"
      }
    },
    resume: "demo-resume.pdf",
    coverLetter: "I would love to apply for this internship as a React enthusiast.",
    status: "applied",
    createdAt: "2026-06-30T10:00:00.000Z"
  }
];

const initialNotifications = [
  {
    _id: "notif-1",
    recipient: "user-candidate-1",
    message: "Google Inc. viewed your application for Frontend Developer Intern",
    type: "info",
    isRead: false,
    link: "/candidate/applications",
    createdAt: new Date().toISOString()
  }
];

const initialMessages = [];
const initialReports = [];

export const initMockDb = () => {
  if (!localStorage.getItem('mock_db_initialized')) {
    localStorage.setItem('mock_users', JSON.stringify(initialUsers));
    localStorage.setItem('mock_companies', JSON.stringify(initialCompanies));
    localStorage.setItem('mock_jobs', JSON.stringify(initialJobs));
    localStorage.setItem('mock_applications', JSON.stringify(initialApplications));
    localStorage.setItem('mock_messages', JSON.stringify(initialMessages));
    localStorage.setItem('mock_reports', JSON.stringify(initialReports));
    localStorage.setItem('mock_notifications', JSON.stringify(initialNotifications));
    localStorage.setItem('mock_db_initialized', 'true');
  }
};

// Database Getters & Setters
const getUsers = () => JSON.parse(localStorage.getItem('mock_users') || '[]');
const setUsers = (data) => localStorage.setItem('mock_users', JSON.stringify(data));

const getCompanies = () => JSON.parse(localStorage.getItem('mock_companies') || '[]');
const setCompanies = (data) => localStorage.setItem('mock_companies', JSON.stringify(data));

const getJobs = () => JSON.parse(localStorage.getItem('mock_jobs') || '[]');
const setJobs = (data) => localStorage.setItem('mock_jobs', JSON.stringify(data));

const getApplications = () => JSON.parse(localStorage.getItem('mock_applications') || '[]');
const setApplications = (data) => localStorage.setItem('mock_applications', JSON.stringify(data));

const getMessages = () => JSON.parse(localStorage.getItem('mock_messages') || '[]');
const setMessages = (data) => localStorage.setItem('mock_messages', JSON.stringify(data));

const getReports = () => JSON.parse(localStorage.getItem('mock_reports') || '[]');
const setReports = (data) => localStorage.setItem('mock_reports', JSON.stringify(data));

const getNotifications = () => JSON.parse(localStorage.getItem('mock_notifications') || '[]');
const setNotifications = (data) => localStorage.setItem('mock_notifications', JSON.stringify(data));

// Retrieve authenticated user from Bearer token
const getCurrentUser = (config) => {
  const auth = config.headers?.Authorization || config.headers?.authorization;
  if (auth && auth.startsWith('Bearer demo-token-')) {
    const userId = auth.substring(18); // length of 'Bearer demo-token-'
    const users = getUsers();
    return users.find(u => u._id === userId) || null;
  }
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

// Router Request Handler
export const handleMockRequest = async (config) => {
  initMockDb();
  
  let path = config.url || '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    const urlObj = new URL(path);
    path = urlObj.pathname;
  }
  if (path.startsWith('/api')) {
    path = path.substring(4);
  }

  const method = config.method.toUpperCase();
  const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
  const user = getCurrentUser(config);

  console.log(`[Mock Router] Handling ${method} ${path}`, body, 'Auth User:', user?.email);

  // AUTH ENDPOINTS
  if (path === '/auth/login' && method === 'POST') {
    const { email } = body;
    const users = getUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!foundUser) {
      throw { status: 400, message: "User does not exist with this email" };
    }
    if (foundUser.status === 'blocked') {
      throw { status: 403, message: "Your account is blocked. Contact support." };
    }
    
    const token = `demo-token-${foundUser._id}`;
    const refreshToken = `demo-refresh-token-${foundUser._id}`;
    
    // Extract password out of the response
    const { password: _, ...userData } = foundUser;
    
    return { data: { token, refreshToken, ...userData } };
  }

  if (path === '/auth/register' && method === 'POST') {
    const { name, email, password, role } = body;
    const users = getUsers();
    
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw { status: 400, message: "User already exists with this email" };
    }
    
    const newUser = {
      _id: `user-${Math.random().toString(36).substring(2, 9)}`,
      name,
      email,
      password,
      role,
      status: 'active',
      profilePhoto: '',
      candidateProfile: role === 'candidate' ? { skills: [], experience: [], education: [], projects: [], certifications: [], savedJobs: [] } : undefined,
      companyProfile: role === 'company' ? { companyName: name, website: '', description: '', companySize: '', industry: '', headquarters: '' } : undefined
    };
    
    users.push(newUser);
    setUsers(users);
    
    // Create companion Company record for company roles
    if (role === 'company') {
      const companies = getCompanies();
      const newCompany = {
        _id: `company-${Math.random().toString(36).substring(2, 9)}`,
        owner: newUser._id,
        companyName: name,
        logo: '',
        website: '',
        description: '',
        companySize: '',
        industry: '',
        headquarters: '',
        verificationStatus: 'approved'
      };
      companies.push(newCompany);
      setCompanies(companies);
      newUser.companyId = newCompany._id;
    }
    
    const token = `demo-token-${newUser._id}`;
    const refreshToken = `demo-refresh-token-${newUser._id}`;
    const { password: _, ...userData } = newUser;
    
    return { data: { token, refreshToken, ...userData } };
  }

  if (path === '/auth/change-password' && method === 'PUT') {
    return { data: { message: "Password updated successfully" } };
  }

  // JOBS ENDPOINTS
  if (path === '/jobs' && method === 'GET') {
    const params = config.params || {};
    const search = params.search || '';
    const location = params.location || '';
    const remoteType = params.remoteType || '';
    const employmentType = params.employmentType || '';
    const experience = params.experience || '';
    const minSalary = params.minSalary || '';
    const sort = params.sort || '';
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 6;

    let jobsList = getJobs().filter(j => j.status === 'approved');

    if (search) {
      const q = search.toLowerCase();
      jobsList = jobsList.filter(j => 
        j.title.toLowerCase().includes(q) || 
        j.description.toLowerCase().includes(q) ||
        j.skillsRequired.some(s => s.toLowerCase().includes(q))
      );
    }
    if (location) {
      const q = location.toLowerCase();
      jobsList = jobsList.filter(j => j.location.toLowerCase().includes(q));
    }
    if (remoteType) {
      jobsList = jobsList.filter(j => j.remoteType === remoteType);
    }
    if (employmentType) {
      jobsList = jobsList.filter(j => j.employmentType === employmentType);
    }
    if (experience) {
      jobsList = jobsList.filter(j => j.experience <= parseInt(experience));
    }
    if (minSalary) {
      jobsList = jobsList.filter(j => j.salary?.max >= parseInt(minSalary));
    }

    // Sort
    if (sort === 'salary_desc') {
      jobsList.sort((a, b) => b.salary.max - a.salary.max);
    } else if (sort === 'salary_asc') {
      jobsList.sort((a, b) => a.salary.min - b.salary.min);
    } else if (sort === 'experience_asc') {
      jobsList.sort((a, b) => a.experience - b.experience);
    } else {
      jobsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const totalJobs = jobsList.length;
    const totalPages = Math.ceil(totalJobs / limit) || 1;
    const paginatedJobs = jobsList.slice((page - 1) * limit, page * limit);

    return {
      data: {
        jobs: paginatedJobs,
        totalPages,
        totalJobs,
        page
      }
    };
  }

  // Get job details by ID
  if (path.startsWith('/jobs/') && method === 'GET') {
    const jobId = path.split('/')[2];
    const job = getJobs().find(j => j._id === jobId);
    if (!job) {
      throw { status: 404, message: "Job not found" };
    }
    return { data: job };
  }

  // Apply to Job
  if (path.startsWith('/jobs/') && path.endsWith('/apply') && method === 'POST') {
    const jobId = path.split('/')[2];
    const jobs = getJobs();
    const job = jobs.find(j => j._id === jobId);
    if (!job) throw { status: 404, message: "Job not found" };

    if (!user) throw { status: 401, message: "Unauthorized candidate" };

    const applications = getApplications();
    const alreadyApplied = applications.find(a => a.candidate._id === user._id && a.job._id === jobId);
    if (alreadyApplied) throw { status: 400, message: "You have already applied for this job" };

    const newApp = {
      _id: `app-${Math.random().toString(36).substring(2, 9)}`,
      candidate: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        candidateProfile: user.candidateProfile
      },
      job: {
        _id: job._id,
        title: job.title,
        company: job.company
      },
      resume: body.resume || "uploaded-resume.pdf",
      coverLetter: body.coverLetter || "",
      status: "applied",
      createdAt: new Date().toISOString()
    };

    applications.push(newApp);
    setApplications(applications);

    // Create a mock notification for the recruiter
    const notifications = getNotifications();
    notifications.push({
      _id: `notif-${Math.random().toString(36).substring(2, 9)}`,
      recipient: job.postedBy,
      message: `${user.name} applied for ${job.title}`,
      type: "info",
      isRead: false,
      link: "/company/applicants",
      createdAt: new Date().toISOString()
    });
    setNotifications(notifications);

    return { data: { message: "Application submitted successfully!", application: newApp } };
  }

  // Report Job
  if (path.startsWith('/jobs/') && path.endsWith('/report') && method === 'POST') {
    const jobId = path.split('/')[2];
    const reports = getReports();
    const newReport = {
      _id: `rep-${Math.random().toString(36).substring(2, 9)}`,
      reportedBy: user ? { _id: user._id, name: user.name } : { name: "Anonymous" },
      job: jobId,
      type: body.type,
      description: body.description,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    reports.push(newReport);
    setReports(reports);
    return { data: { message: "Report logged successfully" } };
  }

  // CANDIDATE SPECIFIC ENDPOINTS
  if (path === '/candidates/profile' && method === 'PUT') {
    if (!user) throw { status: 401, message: "Unauthorized" };
    const users = getUsers();
    const userIndex = users.findIndex(u => u._id === user._id);
    
    users[userIndex].name = body.name || users[userIndex].name;
    users[userIndex].profilePhoto = body.profilePhoto || users[userIndex].profilePhoto;
    users[userIndex].candidateProfile = {
      ...users[userIndex].candidateProfile,
      ...body
    };

    setUsers(users);
    return { data: users[userIndex] };
  }

  if (path === '/candidates/upload-resume' && method === 'POST') {
    if (!user) throw { status: 401, message: "Unauthorized" };
    const users = getUsers();
    const userIndex = users.findIndex(u => u._id === user._id);
    
    users[userIndex].candidateProfile.resumeUrl = "https://example.com/demo-resume.pdf";
    users[userIndex].candidateProfile.resumeText = "Mock extracted text from PDF resume";
    
    setUsers(users);
    return { data: users[userIndex] };
  }

  if (path.startsWith('/candidates/save-job/') && method === 'POST') {
    const jobId = path.split('/')[3];
    if (!user) throw { status: 401, message: "Unauthorized" };
    const users = getUsers();
    const userIndex = users.findIndex(u => u._id === user._id);
    
    if (!users[userIndex].candidateProfile.savedJobs) {
      users[userIndex].candidateProfile.savedJobs = [];
    }
    if (!users[userIndex].candidateProfile.savedJobs.includes(jobId)) {
      users[userIndex].candidateProfile.savedJobs.push(jobId);
    }
    setUsers(users);
    return { data: { message: "Job saved successfully" } };
  }

  if (path.startsWith('/candidates/save-job/') && method === 'DELETE') {
    const jobId = path.split('/')[3];
    if (!user) throw { status: 401, message: "Unauthorized" };
    const users = getUsers();
    const userIndex = users.findIndex(u => u._id === user._id);
    
    if (users[userIndex].candidateProfile.savedJobs) {
      users[userIndex].candidateProfile.savedJobs = users[userIndex].candidateProfile.savedJobs.filter(id => id !== jobId);
    }
    setUsers(users);
    return { data: { message: "Job unsaved successfully" } };
  }

  if (path === '/candidates/saved-jobs' && method === 'GET') {
    if (!user) throw { status: 401, message: "Unauthorized" };
    const savedIds = user.candidateProfile?.savedJobs || [];
    const savedJobs = getJobs().filter(j => savedIds.includes(j._id));
    return { data: savedJobs };
  }

  if (path === '/candidates/applications' && method === 'GET') {
    if (!user) throw { status: 401, message: "Unauthorized" };
    const apps = getApplications().filter(a => a.candidate._id === user._id);
    return { data: apps };
  }

  // COMPANY SPECIFIC ENDPOINTS
  if (path === '/companies/profile' && method === 'GET') {
    if (!user) throw { status: 401, message: "Unauthorized" };
    const companies = getCompanies();
    let company = companies.find(c => c.owner === user._id);
    if (!company) {
      company = {
        _id: `company-${Math.random().toString(36).substring(2, 9)}`,
        owner: user._id,
        companyName: user.name,
        website: "",
        description: "",
        companySize: "",
        industry: "",
        headquarters: "",
        verificationStatus: "approved"
      };
      companies.push(company);
      setCompanies(companies);
    }
    return { data: company };
  }

  if (path === '/companies/profile' && method === 'PUT') {
    if (!user) throw { status: 401, message: "Unauthorized" };
    const companies = getCompanies();
    const cIndex = companies.findIndex(c => c.owner === user._id);
    
    const updates = body;
    if (cIndex !== -1) {
      companies[cIndex] = {
        ...companies[cIndex],
        ...updates
      };
      setCompanies(companies);
    }

    const users = getUsers();
    const uIndex = users.findIndex(u => u._id === user._id);
    users[uIndex].companyProfile = {
      ...users[uIndex].companyProfile,
      ...updates
    };
    setUsers(users);

    return { data: companies[cIndex] };
  }

  if (path === '/companies/jobs' && method === 'POST') {
    if (!user) throw { status: 401, message: "Unauthorized" };
    const companies = getCompanies();
    const companyObj = companies.find(c => c.owner === user._id) || { companyName: "Demo Company", logo: "" };
    
    const jobs = getJobs();
    const newJob = {
      _id: `job-${Math.random().toString(36).substring(2, 9)}`,
      title: body.title,
      description: body.description,
      skillsRequired: body.skillsRequired || [],
      salary: body.salary || { min: 50000, max: 80000 },
      experience: body.experience || 0,
      location: body.location,
      employmentType: body.employmentType,
      jobCategory: body.jobCategory,
      openings: body.openings || 1,
      deadline: body.deadline,
      remoteType: body.remoteType,
      benefits: body.benefits || [],
      status: "approved",
      company: {
        _id: companyObj._id,
        companyName: companyObj.companyName,
        logo: companyObj.logo || ""
      },
      postedBy: user._id,
      createdAt: new Date().toISOString()
    };
    jobs.push(newJob);
    setJobs(jobs);

    // Notify admins about new job approval
    const notifications = getNotifications();
    const admins = getUsers().filter(u => u.role === 'admin');
    admins.forEach(admin => {
      notifications.push({
        _id: `notif-${Math.random().toString(36).substring(2, 9)}`,
        recipient: admin._id,
        message: `New job pending approval: ${newJob.title} by ${companyObj.companyName}`,
        type: "warning",
        isRead: false,
        link: "/admin/dashboard",
        createdAt: new Date().toISOString()
      });
    });
    setNotifications(notifications);

    return { data: newJob };
  }

  if (path === '/companies/jobs' && method === 'GET') {
    if (!user) throw { status: 401, message: "Unauthorized" };
    const postedJobs = getJobs().filter(j => j.postedBy === user._id);
    return { data: postedJobs };
  }

  if (path.startsWith('/companies/jobs/') && path.endsWith('/close') && method === 'PUT') {
    const jobId = path.split('/')[3];
    const jobs = getJobs();
    const jobIndex = jobs.findIndex(j => j._id === jobId);
    if (jobIndex !== -1) {
      jobs[jobIndex].status = 'closed';
      setJobs(jobs);
    }
    return { data: { message: "Job closed successfully" } };
  }

  if (path.startsWith('/companies/jobs/') && path.endsWith('/reopen') && method === 'PUT') {
    const jobId = path.split('/')[3];
    const jobs = getJobs();
    const jobIndex = jobs.findIndex(j => j._id === jobId);
    if (jobIndex !== -1) {
      jobs[jobIndex].status = 'approved';
      setJobs(jobs);
    }
    return { data: { message: "Job re-opened successfully" } };
  }

  if (path.startsWith('/companies/jobs/') && method === 'DELETE') {
    const jobId = path.split('/')[3];
    const jobs = getJobs().filter(j => j._id !== jobId);
    setJobs(jobs);
    return { data: { message: "Job deleted successfully" } };
  }

  if (path === '/companies/applicants' && method === 'GET') {
    if (!user) throw { status: 401, message: "Unauthorized" };
    const myJobs = getJobs().filter(j => j.postedBy === user._id).map(j => j._id);
    let apps = getApplications().filter(a => myJobs.includes(a.job._id));

    const status = config.params?.status || '';
    const search = config.params?.search || '';

    if (status) {
      apps = apps.filter(a => a.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      apps = apps.filter(a => a.candidate.name.toLowerCase().includes(q) || a.job.title.toLowerCase().includes(q));
    }
    return { data: apps };
  }

  if (path.startsWith('/companies/applications/') && method === 'PUT') {
    const appId = path.split('/')[3];
    const apps = getApplications();
    const index = apps.findIndex(a => a._id === appId);
    if (index !== -1) {
      apps[index].status = body.status;
      if (body.interviewDate) apps[index].interviewDate = body.interviewDate;
      if (body.interviewDetails) apps[index].interviewDetails = body.interviewDetails;
      setApplications(apps);

      // Create notification for candidate
      const notifications = getNotifications();
      notifications.push({
        _id: `notif-${Math.random().toString(36).substring(2, 9)}`,
        recipient: apps[index].candidate._id,
        message: `Your application for ${apps[index].job.title} was updated to: ${body.status.toUpperCase()}`,
        type: body.status === 'rejected' ? 'error' : 'success',
        isRead: false,
        link: "/candidate/applications",
        createdAt: new Date().toISOString()
      });
      setNotifications(notifications);
    }
    return { data: { message: "Applicant status updated successfully" } };
  }

  if (path === '/companies/analytics' && method === 'GET') {
    if (!user) throw { status: 401, message: "Unauthorized" };
    const myJobs = getJobs().filter(j => j.postedBy === user._id);
    const myJobIds = myJobs.map(j => j._id);
    const myApps = getApplications().filter(a => myJobIds.includes(a.job._id));
    
    const breakdown = {
      applied: myApps.filter(a => a.status === 'applied').length,
      viewed: myApps.filter(a => a.status === 'viewed').length,
      shortlisted: myApps.filter(a => a.status === 'shortlisted').length,
      interview: myApps.filter(a => a.status === 'interview').length,
      hired: myApps.filter(a => a.status === 'hired').length,
      rejected: myApps.filter(a => a.status === 'rejected').length
    };

    const totalApplicants = myApps.length;
    const shortlistRate = totalApplicants ? Math.round((breakdown.shortlisted / totalApplicants) * 100) + '%' : '0%';

    return {
      data: {
        totalJobs: myJobs.length,
        activeJobs: myJobs.filter(j => j.status === 'approved').length,
        totalApplicants,
        shortlistRate,
        breakdown
      }
    };
  }

  if (path === '/companies/export-applicants' && method === 'GET') {
    const csvContent = "Candidate Name,Email,Applied Job,Status\nJane Doe,candidate@demo.com,Frontend Developer,Applied";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    return { data: blob };
  }

  // ADMIN ENDPOINTS
  if (path === '/admin/analytics' && method === 'GET') {
    const users = getUsers();
    const jobs = getJobs();
    const apps = getApplications();

    return {
      data: {
        metrics: {
          totalUsers: users.length,
          totalCompanies: getCompanies().length,
          totalJobs: jobs.length,
          totalApplications: apps.length,
          pendingJobs: jobs.filter(j => j.status === 'pending').length,
          pendingCompanies: getCompanies().filter(c => c.verificationStatus === 'pending').length,
          pendingReports: getReports().filter(r => r.status === 'pending').length,
          revenue: 12500
        },
        userBreakdown: {
          candidate: users.filter(u => u.role === 'candidate').length,
          company: users.filter(u => u.role === 'company').length,
          admin: users.filter(u => u.role === 'admin').length
        }
      }
    };
  }

  if (path === '/admin/users' && method === 'GET') {
    const search = config.params?.search || '';
    const role = config.params?.role || '';
    const status = config.params?.status || '';

    let usersList = getUsers();

    if (search) {
      const q = search.toLowerCase();
      usersList = usersList.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u._id === search);
    }
    if (role) {
      usersList = usersList.filter(u => u.role === role);
    }
    if (status) {
      usersList = usersList.filter(u => u.status === status);
    }

    return { data: { users: usersList, totalPages: 1 } };
  }

  if (path.startsWith('/admin/users/') && path.endsWith('/toggle-block') && method === 'PUT') {
    const userId = path.split('/')[3];
    const users = getUsers();
    const index = users.findIndex(u => u._id === userId);
    if (index !== -1) {
      users[index].status = users[index].status === 'active' ? 'blocked' : 'active';
      setUsers(users);
    }
    return { data: { message: "User status toggled successfully" } };
  }

  if (path.startsWith('/admin/users/') && method === 'DELETE') {
    const userId = path.split('/')[3];
    const users = getUsers().filter(u => u._id !== userId);
    setUsers(users);
    return { data: { message: "User deleted successfully" } };
  }

  if (path === '/admin/companies' && method === 'GET') {
    return { data: getCompanies() };
  }

  if (path.startsWith('/admin/companies/') && path.endsWith('/status') && method === 'PUT') {
    const companyId = path.split('/')[3];
    const companies = getCompanies();
    const index = companies.findIndex(c => c._id === companyId);
    if (index !== -1) {
      companies[index].verificationStatus = body.status;
      setCompanies(companies);
    }
    return { data: { message: "Company status updated" } };
  }

  if (path === '/admin/jobs/approvals' && method === 'GET') {
    const pendingJobs = getJobs().filter(j => j.status === 'pending');
    return { data: pendingJobs };
  }

  if (path.startsWith('/admin/jobs/') && path.endsWith('/verify') && method === 'PUT') {
    const jobId = path.split('/')[3];
    const jobs = getJobs();
    const index = jobs.findIndex(j => j._id === jobId);
    if (index !== -1) {
      jobs[index].status = body.status;
      if (body.rejectionReason) jobs[index].rejectionReason = body.rejectionReason;
      setJobs(jobs);

      const notifications = getNotifications();
      notifications.push({
        _id: `notif-${Math.random().toString(36).substring(2, 9)}`,
        recipient: jobs[index].postedBy,
        message: `Your job posting "${jobs[index].title}" was ${body.status.toUpperCase()} by the system admin.`,
        type: body.status === 'approved' ? 'success' : 'error',
        isRead: false,
        link: "/company/dashboard",
        createdAt: new Date().toISOString()
      });
      setNotifications(notifications);
    }
    return { data: { message: "Job verified successfully" } };
  }

  if (path === '/admin/reports' && method === 'GET') {
    const reports = getReports();
    const jobs = getJobs();
    const reportsPopulated = reports.map(r => ({
      ...r,
      job: jobs.find(j => j._id === r.job) || { title: "Deleted Job" }
    }));
    return { data: reportsPopulated };
  }

  if (path.startsWith('/admin/reports/') && path.endsWith('/resolve') && method === 'PUT') {
    const reportId = path.split('/')[3];
    const reports = getReports();
    const index = reports.findIndex(r => r._id === reportId);
    if (index !== -1) {
      reports[index].status = 'resolved';
      setReports(reports);
    }
    return { data: { message: "Report marked as resolved" } };
  }

  // CHAT ENDPOINTS
  if (path === '/messages/conversations' && method === 'GET') {
    if (!user) throw { status: 401, message: "Unauthorized" };
    
    const messages = getMessages();
    const users = getUsers();
    
    const myConversations = {};
    messages.forEach(msg => {
      if (msg.sender === user._id || msg.receiver === user._id) {
        const otherId = msg.sender === user._id ? msg.receiver : msg.sender;
        if (!myConversations[otherId]) {
          myConversations[otherId] = [];
        }
        myConversations[otherId].push(msg);
      }
    });

    const threadList = Object.keys(myConversations).map(otherId => {
      const msgs = myConversations[otherId];
      msgs.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      const lastMsg = msgs[msgs.length - 1];
      const otherUser = users.find(u => u._id === otherId) || { _id: otherId, name: "Deleted User", role: "candidate" };
      const unreadCount = msgs.filter(m => m.receiver === user._id && !m.isRead).length;

      return {
        user: otherUser,
        lastMessage: lastMsg.text,
        lastMessageAt: lastMsg.createdAt,
        unreadCount
      };
    });

    threadList.sort((a,b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

    return { data: threadList };
  }

  if (path.startsWith('/messages/') && method === 'GET') {
    const otherId = path.split('/')[2];
    if (!user) throw { status: 401, message: "Unauthorized" };
    
    const allMsgs = getMessages();
    const filtered = allMsgs.filter(m => 
      (m.sender === user._id && m.receiver === otherId) ||
      (m.sender === otherId && m.receiver === user._id)
    );
    
    const updated = allMsgs.map(m => {
      if (m.sender === otherId && m.receiver === user._id) {
        return { ...m, isRead: true };
      }
      return m;
    });
    setMessages(updated);

    filtered.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return { data: filtered };
  }

  if (path.startsWith('/messages/') && method === 'PUT') {
    const otherId = path.split('/')[2];
    if (!user) throw { status: 401, message: "Unauthorized" };
    const allMsgs = getMessages();
    const updated = allMsgs.map(m => {
      if (m.sender === otherId && m.receiver === user._id) {
        return { ...m, isRead: true };
      }
      return m;
    });
    setMessages(updated);
    return { data: { message: "Messages read" } };
  }

  // NOTIFICATION ENDPOINTS
  if (path === '/notifications' && method === 'GET') {
    if (!user) throw { status: 401, message: "Unauthorized" };
    const list = getNotifications().filter(n => n.recipient === user._id);
    list.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { data: list };
  }

  if (path === '/notifications/read-all' && method === 'PUT') {
    if (!user) throw { status: 401, message: "Unauthorized" };
    const list = getNotifications().map(n => n.recipient === user._id ? { ...n, isRead: true } : n);
    setNotifications(list);
    return { data: { message: "All notifications read" } };
  }

  if (path.startsWith('/notifications/') && path.endsWith('/read') && method === 'PUT') {
    const notifId = path.split('/')[2];
    const list = getNotifications().map(n => n._id === notifId ? { ...n, isRead: true } : n);
    setNotifications(list);
    return { data: { message: "Notification read" } };
  }

  if (path.startsWith('/notifications/') && method === 'DELETE') {
    const notifId = path.split('/')[2];
    const list = getNotifications().filter(n => n._id !== notifId);
    setNotifications(list);
    return { data: { message: "Notification deleted" } };
  }

  // AI & EXTRA ENDPOINTS
  if (path === '/ai/recommendations' && method === 'GET') {
    const jobs = getJobs().filter(j => j.status === 'approved');
    const recs = jobs.slice(0, 3).map(job => ({
      job,
      score: 85,
      breakdown: { skillsMatch: 80, experienceMatch: 90, locationMatch: 85 }
    }));
    return { data: recs };
  }

  if (path === '/ai/suggestions' && method === 'GET') {
    const q = (config.params?.q || '').toLowerCase();
    const skills = ["React", "Vue", "Angular", "Python", "NodeJS", "Machine Learning", "System Design", "UI Design"];
    const filtered = skills.filter(s => s.toLowerCase().includes(q));
    return { data: filtered };
  }

  throw { status: 404, message: `Mock Endpoint not found: ${method} ${path}` };
};

// WebSocket Offline Mock Simulator
export class MockSocket {
  constructor() {
    this.listeners = {};
    console.log('[Mock Socket] Initialized client emulations.');
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    if (callback) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    } else {
      delete this.listeners[event];
    }
  }

  emit(event, data) {
    console.log(`[Mock Socket] EMIT ${event}:`, data);
    
    if (event === 'register') {
      setTimeout(() => {
        const users = getUsers().map(u => u._id);
        this.trigger('online_users', users);
      }, 500);
    }

    if (event === 'private_message') {
      const { senderId, receiverId, text } = data;
      const messages = getMessages();
      const newMsg = {
        _id: `msg-${Math.random().toString(36).substring(2, 9)}`,
        sender: senderId,
        receiver: receiverId,
        text: text,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      messages.push(newMsg);
      setMessages(messages);

      this.trigger('private_message', newMsg);

      // Simulate a recruiter typing and responding automatically after 1.5 seconds!
      setTimeout(() => {
        this.trigger('typing', { senderId: receiverId });
        
        setTimeout(() => {
          this.trigger('stop_typing', { senderId: receiverId });
          
          const receiverUser = getUsers().find(u => u._id === receiverId) || { name: "Recruiter" };
          const replies = [
            `Hi, thanks for reaching out! I received your inquiry about the vacancy. Let's schedule a call!`,
            `Thanks for your interest. We reviewed your profile and would love to move you forward.`,
            `Hi! Can you share a link to your portfolio or Github? Thanks!`,
            `Hello! I will review this with the hiring manager and get back to you shortly.`
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];

          const replyMsg = {
            _id: `msg-${Math.random().toString(36).substring(2, 9)}`,
            sender: receiverId,
            receiver: senderId,
            text: randomReply,
            isRead: false,
            createdAt: new Date().toISOString()
          };

          const allMsgs = getMessages();
          allMsgs.push(replyMsg);
          setMessages(allMsgs);

          this.trigger('private_message', replyMsg);

          const notifs = getNotifications();
          const newNotif = {
            _id: `notif-${Math.random().toString(36).substring(2, 9)}`,
            recipient: senderId,
            message: `New message from ${receiverUser.name}: "${randomReply.substring(0, 30)}..."`,
            type: "message",
            isRead: false,
            link: `/${getCurrentUser({}).role}/messages`,
            createdAt: new Date().toISOString()
          };
          notifs.push(newNotif);
          setNotifications(notifs);

          this.trigger('notification_received', newNotif);

        }, 1500);
      }, 1500);
    }
  }

  trigger(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  disconnect() {
    console.log('[Mock Socket] Client closed.');
  }
}
