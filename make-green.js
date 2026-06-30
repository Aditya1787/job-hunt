const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Target file to modify for generating commits
const targetFile = 'contributions.txt';

// Verify the git user config is set
try {
  const email = execSync('git config user.email').toString().trim();
  const name = execSync('git config user.name').toString().trim();
  console.log(`Using Git Identity:\nName: ${name}\nEmail: ${email}`);
  console.log('IMPORTANT: Ensure this email matches the email address on your GitHub account, or the contribution graph will not update.');
} catch (e) {
  console.error('Warning: Git config user.email or user.name is not set. Please set it before running this script.');
}

console.log('\nGenerating backdated contributions for the last 60 days...');

const totalDays = 60;

try {
  // Clear or initialize the contributions file
  fs.writeFileSync(targetFile, 'GitHub Green Contributions Log\n');

  for (let i = totalDays; i >= 0; i--) {
    // Determine target date (i days ago)
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Skip weekends with 70% probability to make the contribution graph look like standard work days
    const dayOfWeek = date.getDay();
    if ((dayOfWeek === 0 || dayOfWeek === 6) && Math.random() < 0.7) {
      continue;
    }

    // Determine random number of commits for this day (between 1 and 4 for varied shades of green)
    const commitCount = Math.floor(Math.random() * 4) + 1;
    
    const formattedDateOnly = date.toDateString();
    console.log(`-> Generating ${commitCount} commits for ${formattedDateOnly}...`);

    for (let c = 0; c < commitCount; c++) {
      // Randomize commit time (9 AM to 6 PM)
      date.setHours(9 + Math.floor(Math.random() * 9));
      date.setMinutes(Math.floor(Math.random() * 60));
      date.setSeconds(Math.floor(Math.random() * 60));
      
      const timestamp = date.toISOString();

      // Append edit line to contributions log
      fs.appendFileSync(targetFile, `Commit ${c + 1} on ${timestamp}\n`);

      // Stage the modification
      execSync(`git add ${targetFile}`);

      // Commit with backdated author and committer dates
      execSync(`git commit -m "refactor: optimize data processing handlers for job search"`, {
        env: {
          ...process.env,
          GIT_AUTHOR_DATE: timestamp,
          GIT_COMMITTER_DATE: timestamp
        },
        stdio: 'ignore' // mute logs to keep terminal clean
      });
    }
  }

  // Get current branch
  const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

  console.log('\n======================================================');
  console.log('✓ Successfully created 60 days of green contributions!');
  console.log('======================================================');
  console.log(`\nTo update your GitHub contribution graph, please push your commits by running:`);
  console.log(`\x1b[36mgit push origin ${branch}\x1b[0m`);
  console.log('\nNote: It may take 5-10 minutes for GitHub to process the pushed commits and update the contribution squares.');

} catch (error) {
  console.error('\nError running contribution generator:', error.message);
  process.exit(1);
}
