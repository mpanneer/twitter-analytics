from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB


def split_data(labelled_tweets):
    X = labelled_tweets.lemmatized_content
    y = labelled_tweets.sentiment

    # X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state=42)

    return train_test_split(X, y, test_size = 0.1, random_state=42)


def train_model(labelled_tweets):
    X_train, X_test, y_train, y_test = split_data(labelled_tweets, 'lemmatized_content', 'sentiment')
    count_vect = CountVectorizer()
    X_train_bow = count_vect.fit(X_train)
    X_train_bow = count_vect.transform(X_train)
    X_test_bow = count_vect.transform(X_test)

    tfidf_transformer = TfidfTransformer(use_idf=False).fit(X_train_bow)
    X_train_tfidf = tfidf_transformer.transform(X_train_bow)

    classifier = MultinomialNB().fit(X_train_tfidf, y_train)
    return classifier



    # why was this here?
    # features = ['tweet_id', 'sentiment', 'text']

    # X_train, X_test, y_train, y_test = split_data(tweets_emotions, 'lemmatized_content', 'sentiment')
    # clf = train_model(X_train, X_test, y_train)

    # y_predict_class = clf.predict(X_test_bow)

# regex_hashtag = re.compile(r'(?:\A|\s)#([a-z]{1,})(?:\Z|\s)')
# remove_hashtag(tweets_emotion, regex_hashtag)
# print(tweets_emotion[32694]['text']
                        
# def tokenize(s):
#     return tokens_re.findall(s)

# tknzr = nltk.tokenize.casual.TweetTokenizer(preserve_case=False,
#                                             strip_handles=True, reduce_len=True)
#     regex_hashtag = re.compile(r'(?:\A|\s)#([a-z]{1,})(?:\Z|\s)')

#     remove_hashtag(tweets_emotion, regex_hashtag)
