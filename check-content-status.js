/**
 * Content Status Checker for ThinkScope
 * Run this script to check how many articles have full content
 * 
 * Usage: node check-content-status.js
 */

const fs = require('fs');
const path = require('path');

// Read the categories file
const categoriesPath = path.join(__dirname, 'data', 'categories.ts');
const content = fs.readFileSync(categoriesPath, 'utf8');

// Parse articles (basic regex parsing)
const articleMatches = content.match(/\{[^}]*id:\s*\d+[^}]*\}/gs) || [];

let totalArticles = 0;
let articlesWithContent = 0;
let articlesWithAuthor = 0;
let articlesWithStaggeredDates = 0;
const dates = [];

console.log('\n📊 ThinkScope Content Status Report\n');
console.log('=' .repeat(50));

articleMatches.forEach((article, index) => {
  totalArticles++;
  
  // Check for content field
  const hasContent = /content:\s*`/.test(article);
  if (hasContent) {
    articlesWithContent++;
    
    // Estimate word count (very rough)
    const contentMatch = article.match(/content:\s*`([^`]*)`/s);
    if (contentMatch) {
      const wordCount = contentMatch[1].split(/\s+/).length;
      if (wordCount >= 500) {
        console.log(`✅ Article ${index + 1}: Has content (${wordCount} words)`);
      } else {
        console.log(`⚠️  Article ${index + 1}: Content too short (${wordCount} words)`);
      }
    }
  } else {
    console.log(`❌ Article ${index + 1}: Missing content`);
  }
  
  // Check for author
  if (/author:\s*'/.test(article)) {
    articlesWithAuthor++;
  }
  
  // Extract date
  const dateMatch = article.match(/date:\s*'([^']+)'/);
  if (dateMatch) {
    dates.push(dateMatch[1]);
  }
});

// Check date distribution
const uniqueDates = [...new Set(dates)];
if (uniqueDates.length > 1) {
  articlesWithStaggeredDates = uniqueDates.length;
}

console.log('\n' + '='.repeat(50));
console.log('\n📈 Summary Statistics:\n');
console.log(`Total Articles:              ${totalArticles}`);
console.log(`Articles with Full Content:  ${articlesWithContent} / ${totalArticles}`);
console.log(`Articles with Author Info:   ${articlesWithAuthor} / ${totalArticles}`);
console.log(`Unique Publication Dates:    ${uniqueDates.length}`);

const completionPercentage = Math.round((articlesWithContent / totalArticles) * 100);
console.log(`\nCompletion:                  ${completionPercentage}%`);

console.log('\n' + '='.repeat(50));

if (completionPercentage < 100) {
  console.log('\n⚠️  ACTION REQUIRED:');
  console.log(`   You need to add full content to ${totalArticles - articlesWithContent} more articles.`);
  console.log('   Each article should have 800-1500 words of original content.\n');
} else if (uniqueDates.length < 10) {
  console.log('\n⚠️  ACTION REQUIRED:');
  console.log('   Dates need to be more staggered (at least 10+ unique dates).');
  console.log('   Spread articles over 3-6 months.\n');
} else {
  console.log('\n✅ GREAT JOB!');
  console.log('   Your content looks ready for AdSense review.');
  console.log('   Remember to build traffic before applying!\n');
}

console.log('For detailed guidance, see: ADSENSE_READINESS_GUIDE.md\n');
