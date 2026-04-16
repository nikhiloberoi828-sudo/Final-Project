const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'lib', 'data.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Regex to find all Unsplash image URLs
const unsplashRegex = /image: "https:\/\/images\.unsplash\.com\/photo-[^"]+"/g;

// Function to generate a local path from the entry's context
// This is a bit tricky with just regex, so we'll do a simple replacement
// or parse the file better.

const updatedContent = content.replace(/id: "([^"]+)",[\s\S]*?image: "https:\/\/images\.unsplash\.com\/[^"]+"/g, (match, id) => {
    return match.replace(/image: "[^"]+"/, `image: "/assets/${id}.jpg"`);
});

fs.writeFileSync(filePath, updatedContent);
console.log('Successfully updated all image paths in src/lib/data.ts to use /assets/[id].jpg');
