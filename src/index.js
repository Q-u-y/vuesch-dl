#!/usr/bin/env node
import { program } from 'commander';
import Scraper from './scraper.js';
import fs from 'fs/promises';
import path from 'path';

program
    .argument('[courseUrl]', 'Course URL to download')
    .option('-e, --email <email>', 'Your email')
    .option('-p, --password <password>', 'Your password')
    .option('-d, --directory <directory>', 'Directory to save', './downloads')
    .option('-a, --all', 'Get all courses')
    .option('-f, --force', 'Force download even if course exists')
    .parse();

const options = program.opts();

async function checkCourseFolder(scraper, courseUrl, outputDir) {
    if (options.force) {
        return false;
    }

    try {
        const courseData = await scraper.getCourseData(courseUrl);
        const courseDir = path.join(outputDir, courseData.title.replace(/[/\\?%*:|"<>]/g, '-'));
        
        try {
            await fs.access(courseDir);
            console.log(`Course folder found: ${courseDir}`);
            
            const files = await fs.readdir(courseDir);
            
            // Track which lessons need downloading
            const lessonsToDownload = new Set();
            
            // Check incomplete files first
            const incompleteFiles = files.filter(file => 
                file.endsWith('.part') || file.endsWith('.ytdl')
            );
            
            // Add incomplete file numbers to download list
            incompleteFiles.forEach(file => {
                const match = file.match(/^(\d+)-/);
                if (match) {
                    lessonsToDownload.add(parseInt(match[1]) - 1); // Convert to 0-based index
                }
            });
            
            // Create a map of existing complete files
            const existingFiles = new Set(
                files
                    .filter(file => file.endsWith('.mp4'))
                    .map(file => {
                        const match = file.match(/^(\d+)-/);
                        return match ? parseInt(match[1]) : null;
                    })
                    .filter(num => num !== null)
            );
            
            // Check for missing files
            for (let i = 1; i <= courseData.videos.length; i++) {
                if (!existingFiles.has(i)) {
                    lessonsToDownload.add(i - 1); // Convert to 0-based index
                }
            }
            
            if (lessonsToDownload.size > 0) {
                const sortedLessons = Array.from(lessonsToDownload).sort((a, b) => a - b);
                console.log(`Need to download lessons: ${sortedLessons.map(i => i + 1).join(', ')}`);
                scraper.lessonsToDownload = sortedLessons;
                return false;
            }
            
            console.log(`All ${courseData.videos.length} videos already downloaded. Skipping.`);
            return true;
        } catch {
            console.log(`Course folder not found. Starting download...`);
            return false;
        }
    } catch (error) {
        console.error(`Error checking course folder: ${error.message}`);
        return false;
    }
}

async function main() {
    const outputDir = options.directory || './downloads';
    const scraper = new Scraper();
    await scraper.init();
    await scraper.login(options.email, options.password);
    
    try {
        if (options.all) {
            await scraper.downloadAllCourses(outputDir);
        } else {
            const courseUrl = program.args[0];
            if (!courseUrl) {
                console.error('Please provide a course URL or use --all option');
                process.exit(1);
            }
            
            const skipDownload = await checkCourseFolder(scraper, courseUrl, outputDir);
            if (!skipDownload) {
                await scraper.downloadCourse(courseUrl, outputDir, scraper.startFromIndex);
            }
        }
    } finally {
        await scraper.close();
    }
}

main().catch(console.error);