import json

def time_to_minutes(time_str):
    parts = time_str.split(':')
    if len(parts) == 2:
        minutes, seconds = map(int, parts)
        return minutes + seconds / 60
    elif len(parts) == 3:
        hours, minutes, seconds = map(int, parts)
        return hours * 60 + minutes + seconds / 60
    else:
        raise ValueError(f"Invalid time format: {time_str}")

def minutes_to_time(minutes):
    hours = int(minutes // 60)
    minutes = int(minutes % 60)
    seconds = int((minutes % 1) * 60)
    return f"{hours:01}:{minutes:02}:{seconds:02}"

def process_segments(data):
    result = []
    for item in data:
        new_item = {
            "title": item["title"],
            "url": item["url"],
            "segments": []
        }
        current_text = ""
        current_start_time = 0
        for segment in item["segments"]:
            minute = time_to_minutes(segment['time'])
            if minute - current_start_time >= 5:
                new_item["segments"].append({
                    "time": minutes_to_time(current_start_time),
                    "text": current_text.strip()
                })
                current_start_time = minute
                current_text = segment['text']
            else:
                current_text += " " + segment['text']
        if current_text:
            new_item["segments"].append({
                "time": minutes_to_time(current_start_time),
                "text": current_text.strip()
            })
        result.append(new_item)
    return result

def main():
    input_file = 'Edición_De_0_a_Avanzado.json'
    output_file = '5MinuteVideoEditing.json'
    
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    combined_texts = process_segments(data)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(combined_texts, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    main()
