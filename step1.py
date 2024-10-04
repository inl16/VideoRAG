import os
import pandas as pd
import googleapiclient.discovery

def get_channel_videos(channel_id, api_key):
    # Create a YouTube client
    youtube = googleapiclient.discovery.build('youtube', 'v3', developerKey=api_key)

    # Get initial videos from the channel
    request = youtube.search().list(part='id', channelId=channel_id, maxResults=50, type='video')
    response = request.execute()

    videos = []
    while request is not None:
        # Iterate through each video and append its URL to the videos list
        for item in response['items']:
            video_id = item['id']['videoId']
            videos.append(f'https://www.youtube.com/watch?v={video_id}')

        # Fetch next page of results
        request = youtube.search().list_next(request, response)
        if request:
            response = request.execute()

    return videos

# Replace with your actual API key and channel ID
API_KEY = 'apikey'
CHANNEL_ID = 'UCui4jxDaMb53Gdh-AZUTPAg'

video_links = get_channel_videos(CHANNEL_ID, API_KEY)

# Create a DataFrame and export to Excel
df = pd.DataFrame(video_links, columns=['Video Links'])
df.to_excel('UCcefcZRL2oaA_uBNeo5UOWg.xlsx', index=False)
