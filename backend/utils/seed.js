import mongoose from 'mongoose';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import Report from '../models/Report.js';

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already has data. Seeding skipped.');
      return;
    }

    console.log('Seeding database with demo accounts...');

    // 1. Create Users
    // Passwords will be hashed by the User Schema's pre-save middleware
    const users = await User.create([
      {
        name: 'John Candidate',
        email: 'candidate@demo.com',
        password: 'password123',
        role: 'candidate',
        profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
        status: 'active',
        candidateProfile: {
          phone: '+1 555-0199',
          location: 'New York, NY',
          bio: 'Passionate MERN Stack Developer looking for opportunities in fast-paced teams.',
          skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Tailwind CSS', 'Git', 'REST APIs'],
          experience: [
            {
              title: 'Junior Web Developer',
              company: 'DevCraft Labs',
              startDate: new Date('2024-01-10'),
              endDate: new Date('2025-05-30'),
              current: false,
              description: 'Developed and maintained responsive web applications using React and Express. Optimized DB query performance.'
            }
          ],
          education: [
            {
              school: 'Tech University',
              degree: 'Bachelor of Science',
              fieldOfStudy: 'Computer Science',
              startDate: new Date('2020-09-01'),
              endDate: new Date('2024-05-20'),
              current: false,
              description: 'Graduated with Honors. Focused on Software Engineering and Database Systems.'
            }
          ],
          projects: [
            {
              title: 'Portfolio Website',
              description: 'Personal portfolio highlighting modern design using Tailwind and React.',
              link: 'https://github.com/john-dev/portfolio',
              skillsUsed: ['React', 'Tailwind CSS']
            }
          ],
          certifications: [
            {
              name: 'Certified React Developer',
              issuer: 'Meta / Coursera',
              issueDate: new Date('2024-06-15')
            }
          ],
          resumeUrl: '/uploads/resumes/demo-resume.pdf',
          resumeText: 'John Candidate. Skills: React, Node.js, Express, MongoDB, JavaScript, CSS, HTML, Git, API. Exp: Junior Web Dev at DevCraft Labs.',
          socialLinks: {
            linkedin: 'https://linkedin.com/in/johncandidate',
            github: 'https://github.com/johncandidate',
            portfolio: 'https://johncandidate.dev'
          }
        }
      },
      {
        name: 'Alice Recruiter',
        email: 'company@demo.com',
        password: 'password123',
        role: 'company',
        profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        status: 'active',
        companyProfile: {
          companyName: 'TechCorp',
          website: 'https://techcorp.example.com',
          description: 'A leading SaaS and innovative technology firm building products for the next generation.',
          companySize: '51-200 employees',
          industry: 'Software & SaaS',
          headquarters: 'San Francisco, CA',
          socialLinks: {
            linkedin: 'https://linkedin.com/company/techcorp',
            twitter: 'https://twitter.com/techcorp'
          }
        }
      },
      {
        name: 'System Admin',
        email: 'admin@main.com',
        password: 'password123',
        role: 'admin',
        profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        status: 'active'
      }
    ]);

    const candidateUser = users[0];
    const companyUser = users[1];
    const adminUser = users[2];

    // 2. Create Company entity
    const companyObj = await Company.create({
      owner: companyUser._id,
      companyName: 'TechCorp',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      website: 'https://techcorp.example.com',
      description: 'A leading SaaS and innovative technology firm building products for the next generation.',
      companySize: '51-200 employees',
      industry: 'Software & SaaS',
      headquarters: 'San Francisco, CA',
      verificationStatus: 'approved',
      socialLinks: {
        linkedin: 'https://linkedin.com/company/techcorp',
        twitter: 'https://twitter.com/techcorp'
      }
    });

    // 3. Create Jobs
    const jobs = await Job.create([
      {
        title: 'Full Stack Engineer (MERN)',
        description: 'We are looking for a skilled MERN Stack developer to build scalable backend services and responsive frontends. You will collaborate with designers and product managers to deliver clean user experiences.',
        skillsRequired: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'REST APIs'],
        salary: { min: 80000, max: 120000, currency: 'USD' },
        experience: 2,
        location: 'San Francisco, CA',
        employmentType: 'full-time',
        jobCategory: 'Technology',
        openings: 2,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        remoteType: 'hybrid',
        benefits: ['Medical Insurance', 'Flexible Hours', 'Stock Options', 'Learning Allowance'],
        status: 'approved',
        company: companyObj._id,
        postedBy: companyUser._id
      },
      {
        title: 'Senior Frontend Developer',
        description: 'Join our design system team to create beautiful, accessible web interfaces. Expert knowledge of React, Tailwind CSS, and UX micro-interactions is required.',
        skillsRequired: ['React', 'JavaScript', 'Tailwind CSS', 'HTML', 'CSS', 'Figma'],
        salary: { min: 100000, max: 150000, currency: 'USD' },
        experience: 5,
        location: 'Remote',
        employmentType: 'full-time',
        jobCategory: 'Technology',
        openings: 1,
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        remoteType: 'remote',
        benefits: ['Remote Work Stipend', 'Health & Dental', 'Equity'],
        status: 'approved',
        company: companyObj._id,
        postedBy: companyUser._id
      },
      {
        title: 'Backend Node.js Developer',
        description: 'Seeking a strong backend engineer focused on high-throughput Node.js microservices. Experience with Socket.io, API gateway design, and MongoDB scaling is a plus.',
        skillsRequired: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Socket.io', 'Git'],
        salary: { min: 90000, max: 130000, currency: 'USD' },
        experience: 3,
        location: 'San Francisco, CA',
        employmentType: 'full-time',
        jobCategory: 'Technology',
        openings: 3,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        remoteType: 'onsite',
        benefits: ['Free Lunch', 'Gym Membership', 'Unlimited PTO'],
        status: 'approved',
        company: companyObj._id,
        postedBy: companyUser._id
      },
      {
        title: 'Data Analyst Intern',
        description: 'Perfect role for a student or fresher. Help us query data, generate reports, and build visualization dashboards. Basic SQL and Excel knowledge required.',
        skillsRequired: ['SQL', 'Excel', 'Python', 'Tableau'],
        salary: { min: 30000, max: 50000, currency: 'USD' },
        experience: 0,
        location: 'Chicago, IL',
        employmentType: 'internship',
        jobCategory: 'Analytics',
        openings: 1,
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        remoteType: 'remote',
        benefits: ['Flexible Schedule', 'Mentorship Program'],
        status: 'approved',
        company: companyObj._id,
        postedBy: companyUser._id
      },
      {
        title: 'AI Product Specialist (Unverified Listing)',
        description: 'Work with the executive team to define roadmap for AI job recommendation. Fake listing for testing job approvals.',
        skillsRequired: ['Product Management', 'Machine Learning', 'UX Design'],
        salary: { min: 110000, max: 160000, currency: 'USD' },
        experience: 4,
        location: 'San Jose, CA',
        employmentType: 'full-time',
        jobCategory: 'Product Management',
        openings: 1,
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        remoteType: 'onsite',
        benefits: ['Stock Options'],
        status: 'pending', // Pending Admin approval
        company: companyObj._id,
        postedBy: companyUser._id
      }
    ]);

    // 4. Create Applications
    const app1 = await Application.create({
      candidate: candidateUser._id,
      job: jobs[1]._id, // Senior Frontend Developer
      resume: '/uploads/resumes/demo-resume.pdf',
      coverLetter: 'I am highly passionate about beautiful frontend development and React design systems. Looking forward to talking!',
      status: 'shortlisted'
    });

    const app2 = await Application.create({
      candidate: candidateUser._id,
      job: jobs[0]._id, // MERN developer
      resume: '/uploads/resumes/demo-resume.pdf',
      coverLetter: 'I have hands-on experience deploying MERN portals. Please review my profile.',
      status: 'applied'
    });

    // 5. Create Messages (Pre-populate some messages)
    await Message.create([
      {
        sender: companyUser._id,
        receiver: candidateUser._id,
        text: 'Hi John, thank you for applying to the Senior Frontend role! We loved your portfolio. Can you talk this Wednesday?',
        isRead: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        sender: candidateUser._id,
        receiver: companyUser._id,
        text: 'Hello Alice! Yes, I am free this Wednesday anytime after 2 PM EST. Thank you so much for reaching out!',
        isRead: true,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      {
        sender: companyUser._id,
        receiver: candidateUser._id,
        text: 'Excellent, I will schedule an interview slot and send you the link shortly.',
        isRead: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000)
      }
    ]);

    // 6. Create Notifications
    await Notification.create([
      {
        recipient: candidateUser._id,
        sender: companyUser._id,
        type: 'application_status',
        message: 'Your application for Senior Frontend Developer was shortlisted by TechCorp!',
        link: '/candidate/applications',
        isRead: false
      },
      {
        recipient: candidateUser._id,
        sender: companyUser._id,
        type: 'message',
        message: 'Alice Recruiter sent you a new message.',
        link: '/candidate/messages',
        isRead: false
      }
    ]);

    // 7. Create a Sample Report
    await Report.create({
      reportedBy: candidateUser._id,
      job: jobs[2]._id, // Backend Developer
      type: 'spam',
      description: 'The salary list is too high for this experience requirement.',
      status: 'pending'
    });

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seeding database failed:', error);
  }
};

export default seedDatabase;
