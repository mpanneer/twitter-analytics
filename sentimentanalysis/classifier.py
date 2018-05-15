def classify(tweets, count_vect, clf):
    neutral_cnt = 0

    for t in tweets:
        predict_new = clf.predict(count_vect.transform([t['text_tokens']]))
        t['sentimentTag'] = predict_new.tolist()[0]
        if (t['sentimentTag'] == 'neutral'):
            neutral_cnt += 1

    #print(neutral_cnt)
    
    return tweets
