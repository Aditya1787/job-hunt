/**
 * Computes match scores between candidate details and a list of jobs.
 * @param {Object} candidate - Candidate user profile details
 * @param {Object[]} jobs - Array of approved Job documents
 * @returns {Object[]} Array of jobs with recommendation scores and matching details
 */
export const recommendJobsForCandidate = (candidate, jobs) => {
  if (!candidate || !jobs || jobs.length === 0) return [];

  const candidateSkills = (candidate.candidateProfile?.skills || []).map(s => s.toLowerCase());
  const candidateExp = candidate.candidateProfile?.experience || [];
  // Calculate total years of experience
  const candidateYearsExp = candidateExp.reduce((total, job) => {
    const start = new Date(job.startDate);
    const end = job.current ? new Date() : new Date(job.endDate);
    const diffYears = (end - start) / (1000 * 60 * 60 * 24 * 365.25);
    return total + (isNaN(diffYears) ? 0 : diffYears);
  }, 0);

  const candidateLocation = (candidate.candidateProfile?.location || '').toLowerCase();

  return jobs
    .map(job => {
      let scoreDetails = { skillsMatch: 0, experienceMatch: 0, locationMatch: 0 };
      
      // 1. Skills Match (50% weight)
      const reqSkills = (job.skillsRequired || []).map(s => s.toLowerCase());
      if (reqSkills.length > 0) {
        const matchingSkillsCount = reqSkills.filter(skill => 
          candidateSkills.some(cs => cs.includes(skill) || skill.includes(cs))
        ).length;
        scoreDetails.skillsMatch = Math.round((matchingSkillsCount / reqSkills.length) * 100);
      } else {
        scoreDetails.skillsMatch = 100; // No skills required
      }

      // 2. Experience Match (30% weight)
      const reqYears = job.experience || 0;
      if (reqYears === 0) {
        scoreDetails.experienceMatch = 100;
      } else if (candidateYearsExp >= reqYears) {
        scoreDetails.experienceMatch = 100;
      } else {
        // Partial score for experience
        scoreDetails.experienceMatch = Math.round((candidateYearsExp / reqYears) * 100);
      }

      // 3. Location/Remote Match (20% weight)
      const jobLocation = (job.location || '').toLowerCase();
      const isRemote = job.remoteType === 'remote';
      
      if (isRemote) {
        scoreDetails.locationMatch = 100;
      } else if (candidateLocation && (jobLocation.includes(candidateLocation) || candidateLocation.includes(jobLocation))) {
        scoreDetails.locationMatch = 100;
      } else {
        // Partial location match if same state or country (heuristic)
        const candParts = candidateLocation.split(',').map(p => p.trim());
        const jobParts = jobLocation.split(',').map(p => p.trim());
        const shared = candParts.filter(part => jobParts.includes(part));
        scoreDetails.locationMatch = shared.length > 0 ? 50 : 20;
      }

      // Weighted score calculation
      const overallScore = Math.round(
        (scoreDetails.skillsMatch * 0.5) + 
        (scoreDetails.experienceMatch * 0.3) + 
        (scoreDetails.locationMatch * 0.2)
      );

      return {
        job,
        score: overallScore,
        breakdown: scoreDetails
      };
    })
    // Sort descending by score
    .sort((a, b) => b.score - a.score);
};

/**
 * Generates search suggestions matching query term
 * @param {string} query - Typedin characters
 * @param {Object[]} jobs - Active listings
 * @returns {string[]} Suggestions list
 */
export const getSearchSuggestions = (query, jobs) => {
  if (!query || !jobs) return [];
  const cleanQuery = query.trim().toLowerCase();
  if (cleanQuery.length < 2) return [];

  const suggestions = new Set();

  jobs.forEach(job => {
    // Check job title
    if (job.title.toLowerCase().includes(cleanQuery)) {
      suggestions.add(job.title);
    }
    // Check skills
    job.skillsRequired.forEach(skill => {
      if (skill.toLowerCase().includes(cleanQuery)) {
        suggestions.add(skill);
      }
    });
    // Check Category
    if (job.jobCategory && job.jobCategory.toLowerCase().includes(cleanQuery)) {
      suggestions.add(job.jobCategory);
    }
    // Check location
    if (job.location && job.location.toLowerCase().includes(cleanQuery)) {
      suggestions.add(job.location);
    }
  });

  return Array.from(suggestions).slice(0, 8); // Return top 8 suggestions
};
