import os
import csv
import pandas as pd

from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from preprocess import lemmatize


def sanitize_content(text):
    text = ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)"," ",text).split())
    return text


def nostop_content(text):
    text = ' '.join([word for word in text.split() if word not in stopwords_list])
    return text.lower()


def lemmatize_content(text):
    tmp = []
    lemmatizer = WordNetLemmatizer()   
    for word in text.split():
        tmp.append(lemmatize(word), lemmatizer)
    return ' '.join(tmp)


def prep_training():
    tweets_labelled_file = './reference/text_emotion.csv'
    tweets_labelled = pd.read_csv(tweets_labelled_file)
    stopwords_list = nltk.corpus.stopwords.words("english")

    content_sanitizer = lambda x: sanitize_content(x)
    content_stopwordsremover = lambda x: nostop_content(x)
    content_lemmatizer = lambda x: lemmatize_content(x)

    tweets_labelled['sanitized_content'] = tweets_labelled['content'].apply(content_sanitizer)
    tweets_labelled['sanitized_content'] = tweets_labelled['sanitized_content'].apply(content_stopwordsremover)
    tweets_labelled['lemmatized_content'] = tweets_labelled['sanitized_content'].apply(content_lemmatizer)

    return tweets_labelled
