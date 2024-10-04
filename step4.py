import json
import re

def parse_txt_file(file_path):
    videos = []
    current_video = {}
    current_segment = []

    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()
        for line in lines:
            line = line.strip()
            if line.startswith("Title:"):
                if current_video:
                    current_video["segments"] = current_segment
                    videos.append(current_video)
                    current_video = {}
                    current_segment = []
                title = line.replace("Title: ", "").strip()
                current_video["title"] = title
            elif line.startswith("URL:"):
                url = line.replace("URL: ", "").strip()
                current_video["url"] = url
            elif re.match(r'^\d{2}:\d{2}', line):
                time_text_split = line.split(' - ', 1)
                if len(time_text_split) == 2:
                    time = time_text_split[0]
                    segment_text = time_text_split[1]
                    current_segment.append({
                        "time": time,
                        "text": segment_text
                    })
        
        if current_video:
            current_video["segments"] = current_segment
            videos.append(current_video)

    return videos

def save_to_json(data, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# Example usage
file_path = 'Edición_De_0_a_Avanzado.txt'
output_file = 'Edición_De_0_a_Avanzado.json'

parsed_data = parse_txt_file(file_path)
save_to_json(parsed_data, output_file)

print(f"Data saved to {output_file}")