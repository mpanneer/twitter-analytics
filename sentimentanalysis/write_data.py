import os
import json

def write_tweets(tweets, output_dir, output_file):
    tmp_output_path = os.path.join(os.getcwd(), output_dir, output_file+"_tmp")
    output_path = os.path.join(os.getcwd(), output_dir, output_file)
    with open(tmp_output_path, mode='wt', encoding='utf-8') as myfile:
        myfile.write('\n'.join(json.dumps(line) for line in tweets))
        
    os.replace(tmp_output_path, output_path)
    # for elem in tweets:
        # print elem
    # tweets_json = json.dumps(tweets)

    # f = open(os.path.join(os.getcwd(), output_dir, output_file), "w")
    # f.write(tweets_json)
    # f.close()

