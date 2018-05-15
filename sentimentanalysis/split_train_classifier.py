from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB
from sklearn import metrics
from sklearn.pipeline import Pipeline


def split_data(labelled_tweets):
    X = labelled_tweets.lemmatized_content
    y = labelled_tweets.sentiment

    # X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state=42)

    return train_test_split(X, y, test_size = 0.1, random_state=42)


def train_model(labelled_tweets):
    X_train, X_test, y_train, y_test = split_data(labelled_tweets)
    count_vect = CountVectorizer()
    X_train_bow = count_vect.fit(X_train)
    X_train_bow = count_vect.transform(X_train)
    X_test_bow = count_vect.transform(X_test)

    tfidf_transformer = TfidfTransformer(use_idf=False).fit(X_train_bow)
    X_train_tfidf = tfidf_transformer.transform(X_train_bow)

    classifier = MultinomialNB().fit(X_train_tfidf, y_train)
    y_predict_class = classifier.predict(X_test_bow)

    print("Train data summary")
    
    print("Classifier Accuracy is {0}".format(metrics.accuracy_score(y_test, y_predict_class)))
    print(y_test.value_counts())
        
    return count_vect, classifier

