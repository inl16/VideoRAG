import json
import os
import re

def time_to_minutes(time_str):
    parts = time_str.split(':')
    if len(parts) == 2:
        minutes, seconds = map(float, parts)
        return minutes + seconds / 60
    elif len(parts) == 3:
        hours, minutes, seconds = map(float, parts)
        return hours * 60 + minutes + seconds / 60
    else:
        raise ValueError(f"Invalid time format: {time_str}")

def minutes_to_time(minutes):
    hours = int(minutes // 60)
    remaining_minutes = int(minutes % 60)
    seconds = (minutes % 1) * 60
    return f"{hours:01}:{remaining_minutes:02}:{seconds:06.3f}"

def sanitize_filename(filename):
    """Sanitize filename to be valid and filesystem safe."""
    return re.sub(r'[\\/*?:"<>|]', "", filename)

def split_video_segments(videos, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    
    for video in videos:
        title = video['title']
        url = video['url']
        segments = video['segments']
        
        current_duration = 0
        current_segments = []
        current_part = 1
        
        for segment in segments:
            segment_start_time = time_to_minutes(segment['time'])
            
            if current_segments:
                last_segment_start_time = time_to_minutes(current_segments[-1]['time'])
            else:
                last_segment_start_time = 0
            
            segment_duration = segment_start_time - last_segment_start_time
            
            if current_duration + segment_duration > 60:
                filename = f"{sanitize_filename(title)} - Part {current_part}.json"
                filepath = os.path.join(output_dir, filename)
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump({
                        'title': f"{title} - Part {current_part}",
                        'url': url,
                        'segments': current_segments
                    }, f, ensure_ascii=False, indent=4)
                current_segments = []
                current_duration = 0
                current_part += 1
            
            current_segments.append(segment)
            current_duration += segment_duration
        
        if current_segments:
            filename = f"{sanitize_filename(title)} - Part {current_part}.json"
            filepath = os.path.join(output_dir, filename)
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump({
                    'title': f"{title} - Part {current_part}",
                    'url': url,
                    'segments': current_segments
                }, f, ensure_ascii=False, indent=4)

def main():
    input_file = 'MiniCommunity_Classes.json'
    output_dir = 'Community_Classes-segments'
    
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    split_video_segments(data, output_dir)
    print(f"Processing complete. The segments have been saved in the directory: {output_dir}")

if __name__ == "__main__":
    main()
