import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import Anthropic from "@anthropic-ai/sdk";

const ANTHROPIC_API_KEY = "your key";

const anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputFolderPath = join(__dirname, "segments");
const outputFolderPath = join(__dirname, "Segments_Processed");

mkdirSync(outputFolderPath, { recursive: true });

const processVideo = async (video) => {
    try {
        if (!Array.isArray(video.segments)) {
            throw new Error("Video segments are not in the expected format");
        }

        const summarizedSegments = await Promise.all(video.segments.map(async (segment) => {
            const response = await anthropic.messages.create({
                model: "claude-3-opus-20240229",
                system: "Summarize the following text in exactly 5 sentences in Spanish. Capture the essence of the discussion, maintaining the flow and key points. Perfectly capture the essence of what was said. ensure the summaries are concise and accurate. Each summary must flow well with the next, capturing who talks about what and the important conversations and concepts. the name of the speaker is Jan Kostadinov.",
                messages: [
                    {
                        role: "user",
                        content: segment.text
                    }
                ],
                max_tokens: 1024,
            });

            return {
                time: segment.time,
                text: response.content
            };
        }));

        return { ...video, segments: summarizedSegments };
    } catch (error) {
        console.error(`Failed to process video: ${error.message}`);
        return video;
    }
};

const processJSONFile = async (file) => {
    const inputFilePath = join(inputFolderPath, file);
    const outputFilePath = join(outputFolderPath, `${file}`);

    let fileContent = JSON.parse(readFileSync(inputFilePath, "utf-8"));

    // Check if fileContent is an array, if not, wrap it in an array
    if (!Array.isArray(fileContent)) {
        fileContent = [fileContent];
    }

    const processedVideos = [];
    for (const video of fileContent) {
        const processedVideo = await processVideo(video);
        processedVideos.push(processedVideo);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between videos
    }

    writeFileSync(outputFilePath, JSON.stringify(processedVideos, null, 2));
    console.log(`Processed file saved: ${outputFilePath}`);
};

const processAllFiles = async () => {
    try {
        const files = readdirSync(inputFolderPath).filter(file => file.endsWith('.json'));

        for (const file of files) {
            console.log(`Starting to process ${file}`);
            await processJSONFile(file);
            console.log(`Finished processing ${file}`);
            console.log("Waiting for 1 minute before processing the next file...");
            await new Promise(resolve => setTimeout(resolve, 60000)); // 1 minute delay between files
        }

        console.log("All files have been processed.");
    } catch (error) {
        console.error("Error processing JSON files:", error);
    }
};

// Call the function to process the JSON files one at a time
processAllFiles();