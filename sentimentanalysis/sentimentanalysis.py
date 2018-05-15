# encoding: utf-8
import os
import sys
import time
import re
import string
import json
import glob

from random import randint

import nltk
from nltk.tokenize.casual import TweetTokenizer
from nltk.stem import WordNetLemmatizer
from nltk.corpus import sentiwordnet as swn
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB


import numpy as np
import pandas as pd

from extract_data import prep_training
from split_train_classifier import train_model
from preprocess import preprocess
from classifier import classify
from write_data import write_tweets


def read_arguments(argv):
    input_dir = argv[0]
    output_dir = argv[1]

    output_path = os.getcwd() + '/' + output_dir
    if not os.path.exists(output_path):
       os.makedirs(output_path)

    return input_dir, output_dir


def get_filenames(input_dir, show_folder):
    if show_folder:
        txt_files = glob.glob(input_dir + '/*.txt')
    else:
        txt_files = os.listdir('./' + input_dir)
    return txt_files


def attach_filenames(filenames, tag):
    files = []
    for f in filenames:
        f_split = list(os.path.splitext(f))
        if f_split[1] in ['.txt']:
            f_split[0] += tag
            f_split = ''.join(f_split)
            files.append(f_split)
    return files

def attach_filename(filename, tag):

    f_split = list(os.path.splitext(filename))
    if f_split[1] in ['.txt']:
        f_split[0] += tag
        f_split = ''.join(f_split)
    return f_split    

def read_tweets(filename):
    # https://stackoverflow.com/questions/24754861/unicode-file-with-python-and-fileinput
    # fileinput.input(filename, openhook=fileinput.hook_encoded("utf-8")).
    # raw = url.read().decode('windows-1252')
    tweets = []
    with open(filename, 'r', encoding='utf-8') as tweet_data:
        for line in tweet_data:
            try:
                t = json.loads(line)
                tweets.append(t)
            except json.decoder.JSONDecodeError:
                print ("invalid json:",line)
        print('Read in {0}'.format(filename))
        return tweets


def align_files(before, output_dir, input_dir):
    # input_files = get_filenames(input_dir, show_folder=False)
    # print("Input files are: {0}".format(input_files))
    output_files = attach_filenames(before, tag='_output')
    # print("Output files are: {0}".format(output_files))
    input_files = get_filenames(input_dir, show_folder=True)

    zipped_files = list(zip(input_files, output_files))
    # print("Zipped files are: {0}.".format(zipped_files))

    return zipped_files
    
if __name__ == '__main__':

    # conduct supervised learning
    emotions_labelled_data = prep_training('./reference/text_emotion.csv')
    emotions_vect, emotions_classifier = train_model(emotions_labelled_data)

    # parse commandline arguments
    input_dir, output_dir = read_arguments(sys.argv[1:])

    path_to_watch = os.path.join(os.getcwd(), input_dir)
    # before = dict ([(f, None) for f in os.listdir (path_to_watch)])
    while 1:
        currentfiles = os.listdir(path_to_watch)
        
        #  after = dict ([(f, None) for f in os.listdir (path_to_watch)])
        #  added = [f for f in after if not f in before]
        #  removed = [f for f in before if not f in after]
        #  if added:
        #      print(','.join(added))
        #  if removed:
        #      print(','.join(removed))
        #  before = after
            
        #  zipped_io = align_files(before, output_dir, input_dir)
        if (len(currentfiles)) > 0:
            currentfile = currentfiles.pop()
            outputfile = attach_filename(currentfile, tag='_output')
            absolutecurrentfile = os.path.join(os.getcwd(), input_dir, currentfile)
            start_time = time.time()
            tweets = read_tweets(absolutecurrentfile)
            tweets = preprocess(tweets)
            tweets_classified = classify(tweets, emotions_vect, emotions_classifier)
            # print(tweets_classified[randint(0, len(tweets_classified)-1)]['text_sentiment'])
            write_tweets(tweets, output_dir, outputfile)
            end_time = time.time()
            result_time = end_time - start_time
            
            print('It took {0} second'.format(result_time))
            if os.path.isfile(absolutecurrentfile):
                    os.remove(absolutecurrentfile)
        else:
            print('Waiting...')
            time.sleep(10)
                
    
