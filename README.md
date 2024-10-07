# VideoRAG
how to find any concept within hundreds of hours of video 


A Video Retrieval-Augmented Generation (RAG) system allows you to interact with vast amounts of video content by asking any question. It provides GPT-like responses along with direct video links and exact timestamps where the relevant information is discussed, enabling you to access and verify the source material efficiently.


Step 1 

This code interacts with the YouTube Data API to retrieve video URLs from a specific YouTube channel by using the channel's unique ID and an API key for authentication. It makes an initial request to fetch up to 50 videos, and then continues fetching additional videos using pagination until all the videos from the channel are retrieved. The video URLs are stored in a list, which is then converted into a pandas DataFrame. Finally, the DataFrame is exported to an Excel file, providing a downloadable list of all video links from the specified YouTube channel.

Step 2 

This code is a Python script that utilizes Selenium WebDriver to automate the process of logging into the **Skool.com** website, navigating to specific video lecture pages, and extracting transcript data from those videos. It defines a function `open_skool_page_login_and_redirect` that handles the login using provided email and password credentials, then iterates over a list of `redirect_urls` corresponding to different video lectures. For each URL, it calls the `process_redirect_url` function, which navigates to the video page, interacts with the web elements to reveal the transcript section, and executes a JavaScript function to recursively expand and collect all transcript entries along with their timestamps.

Specifically, the script automates clicking on necessary buttons to start video playback and access the transcript pane within an embedded iframe. It then uses a custom JavaScript function executed within the browser context to scroll through the transcript list, expand all collapsible elements, and gather transcript text paired with their corresponding timestamps. The collected transcripts are written to a text file, effectively saving the content for offline access or further analysis. Throughout the process, the script includes error handling and debug statements to ensure robustness and provide feedback during execution.


Step 3 

This Python script reads the Excel file from step 1, which contains video titles and their corresponding YouTube links. For each video link, it extracts the YouTube video ID using a regular expression. It then uses the **YouTube Transcript API** to fetch the transcript of each video, formatting the timestamps into **hours:minutes:seconds** format for readability. The script compiles all the video titles, URLs, and their transcripts into a Word document, with each video starting on a new page for clarity. Finally, it saves the consolidated transcripts in a Word file 

step 4 

This Python script processes the text file from Step 3 and Step 2 containing video titles, URLs, and their corresponding transcript segments with timestamps. It reads the file line by line, identifying and extracting the video title when a line starts with "Title:" and the video URL when a line starts with "URL:". For each transcript segment, the script uses a regular expression to detect lines that begin with a timestamp (formatted as HH:MM) and splits them into time and text components. These extracted details are organized into a structured dictionary for each video, where each video contains its title, URL, and a list of transcript segments with their respective times and texts. Finally, the script saves the compiled data into a JSON file, facilitating easy access and further analysis of the video transcripts.

RAG vector databases prefer using JavaScript objects because structured data provides a consistent and organized format that simplifies indexing and querying. This structure enhances search efficiency and enables seamless integration with vector embeddings, making it easier to retrieve relevant information quickly.

Step 5 

Providing raw or excessive data to a vector database can overwhelm its search capabilities, making it difficult to efficiently locate relevant information. This overload not only slows down query performance but also increases the cost per query, as the system must process a larger volume of data each time. By curating and optimizing the data before ingestion, you ensure faster, more accurate searches and maintain cost-effective operations.

This Python script is designed to prepare and summarize video transcript data by chunking it into five-minute segments. It begins by loading a JSON file from the previous steps that contains video titles, URLs, and their corresponding transcript segments with timestamps. The script includes utility functions to convert time strings between "HH:MM:SS" or "MM:SS" formats and total minutes, facilitating accurate time-based processing. The core function, `process_segments`, iterates through each video's transcript segments and groups them into five-minute chunks, ensuring that each segment is organized into manageable and meaningful portions for easier analysis. After processing, the script saves the structured, five-minute segmented data into a new JSON file, enabling streamlined access and further utilization of the transcript information.

Step 6 

This Python script is designed to organize video transcript data into manageable chunks, facilitating its preparation for integration with Retrieval-Augmented Generation (RAG) vector databases. It begins by loading a JSON file (from the previous steps) that contains video titles, URLs, and their associated transcript segments with timestamps. The script includes utility functions to convert time strings between "HH:MM:SS" or "MM:SS" formats and total minutes, ensuring accurate time-based processing. Additionally, it features a `sanitize_filename` function to ensure that generated filenames are valid and filesystem-safe by removing any illegal characters.

The core functionality resides in the `split_video_segments` function, which iterates through each video's transcript segments and groups them into parts, each spanning up to 60 minutes of video time. This chunking process ensures that the data is broken down into smaller, more efficient segments for easier uploading and querying within a RAG vector database. Each chunk is saved as a separate JSON file in the specified output directory, with filenames indicating the video title and part number. By organizing the transcripts into these structured, time-based segments, the script enhances the efficiency of data retrieval and reduces the computational costs associated with processing large volumes of raw data, making the transcripts more suitable for advanced search and analysis applications.

Step 7 

This JavaScript script is designed to further prepare the five-minute segmented video transcript data for integration with Retrieval-Augmented Generation (RAG) vector databases by organizing and summarizing the data into concise chunks suitable for uploading. It reads JSON files from an input directory (`segments`) and processes each video's transcript segments by using the Anthropic AI SDK to generate five-sentence summaries in Spanish, ensuring that the essence and key points of the discussions are accurately captured. The script handles file system operations such as reading input files, creating an output directory (`Segments_Processed`), and writing the summarized data into new JSON files with sanitized filenames to ensure they are filesystem-safe. Additionally, it incorporates error handling and rate-limiting by introducing delays between processing videos and files to manage API usage effectively and prevent overwhelming the system. By transforming detailed transcript segments into summarized, structured JSON files, this script optimizes the data for efficient searching and retrieval within RAG vector databases, thereby enhancing search performance and reducing query costs.

Step 8 

This JavaScript script is designed to organize, summarize, and upload video transcript data into a Weaviate vector database, facilitating efficient Retrieval-Augmented Generation (RAG) operations. It begins by reading JSON files from a designated input directory (`RagReady`), which contain video titles, URLs, and their respective transcript segments. For each video, the script leverages the OpenAI and Anthropic APIs to generate concise summaries and extract key topics in Spanish, ensuring that the data is both meaningful and categorized accurately. The script then creates corresponding collections in Weaviate for each category, defining the necessary properties such as title, URL, topics, and segments. By processing the data into structured, summarized chunks, the script prepares the information for optimized indexing and retrieval within the vector database.

Furthermore, the script includes functionality to handle user queries by determining relevant categories and searching the Weaviate database for pertinent video segments. When a query is received, it uses Anthropic’s AI to identify the most relevant categories based on the predefined `categoriesMapping`. It then searches these collections in Weaviate to retrieve the top matching video segments. Finally, the script compiles these results and sends them to Anthropic’s AI to generate a well-structured, sourced response in Spanish, citing the video names, timestamp ranges, and URLs. This integration ensures that users receive accurate and contextually relevant answers, enhancing the efficiency and effectiveness of information retrieval and utilization within the RAG framework.

Steps 9 and 10 

When a user submits a query, the runQuery function employs Anthropic’s AI to identify relevant categories, retrieves the top matching video segments from Weaviate using semantic search, and compiles these results to generate a detailed, well-sourced response in Spanish, citing video names, timestamps, and URLs. The system incorporates robust error handling and retry mechanisms to ensure reliability and efficiency, ultimately providing users with accurate, contextually relevant answers by leveraging a seamless integration of AI-driven summarization, categorization, and vector-based data retrieval.

I also established an Express.js server that listens on a specified port and uses `body-parser` middleware to handle JSON request bodies. It defines two endpoints: a GET `/start` for verifying the server is running, which responds with a simple JSON message, and a POST `/query` that accepts a user query, processes it using the `runQuery` function from `queryService.js`, and returns the resulting answer in JSON format. Additionally, the server includes error handling for the `/query` endpoint and logs a confirmation message when it successfully starts. I used this to connect to Voiceflow to serve as a user interface for the RAG Chatbot 

Step 11

A voiceflow configuration that serves as a user interface with for RAG chatbot. 


