 
async function representativeFlow(page) {
  // Navigate to the home page
  await page.goto('/');
  await page.waitForLoadState('networkidle')
  const randomX = Math.floor(Math.random() * 63)+1;

  // Navigate to the generated URL
  await page.goto(`/representatives/${randomX}`);
  await page.waitForLoadState('networkidle')

}

async function visitPollFlow(page) {
  // Navigate to the home page
  await page.goto('/');

  await page.waitForLoadState('networkidle');

  // List all cards with the data-testid attribute 'poll-card-xxx'
  const pollCards = await page.locator('[data-testid^="poll-card-"]').all()  // Select all elements starting with 'poll-card-'


  if (pollCards.length <= 0) {
    console.log("No poll cards found!");
    return;
  }

  // Select a random poll card
  const randomIndex = Math.floor(Math.random() * pollCards.length);
  const randomPollCard = pollCards[randomIndex];

  // Click on the random card
  await randomPollCard.click();
  await page.waitForLoadState('networkidle')

  // You can uncomment the next line if you need to navigate to a specific page after clicking
  // await page.goto(`/representatives/${randomX}`); 
}

module.exports = { representativeFlow,visitPollFlow };
