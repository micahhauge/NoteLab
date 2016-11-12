#!\usr\bin\python3
import random
import math
import time
from decimal import Decimal
import sys
import datetime
from os import listdir
from os.path import isfile, join
import operator #used for sorting dict parsing

# for training data
def GenCenter(songDir,dirSep):
    index = 0
    
    musicFiles = [f for f in listdir(songDir) if isfile(join(songDir, f))]
    #print(onlyfiles)
    songIndex = 0
    songProp = []
    trainCenter = [0.0,0.0,0.0,0.0]
    count = 0
    
    for mFile in musicFiles:
        with open(songDir+dirSep+mFile) as f:
            currSong = f.readlines();

        for index, songPart in enumerate(currSong):
            if(index+1 < len(currSong)):
                #songLinePrev = songLinePost[:]
                songProp = songPart.split(" ")

                for i in range(4):
                   songProp[i] = float(songProp[i].replace('\n',''))
                   trainCenter[i] += songProp[i]
            count += 1

    for i in range(4):
        trainCenter[i] /= count

    return trainCenter

# Be sure to pass a measure as argument and not the population
def GenCenterInline(measure):
    testCenter = [0.0,0.0,0.0,0.0]
    count = 0
    for i in measure: #loop through each note per measure
        for j in measure[i]: #loop through each value per note
            testCenter[int(j)] += measure[i][j]
        count += 1

    for i in range(4):
        testCenter[j] /= count

    return testCenter

# compares centers and returns distance between two points
def CompCenters(cen1,cen2):
    return math.sqrt((cen2[0]-cen1[0])**2+(cen2[1]-cen1[1])**2+(cen2[2]-cen1[2])**2+(cen2[3]-cen1[3])**2)

# population is test data, trainingData is used to compare center
def ReturnBest(population, trainingData):
    fit = {} #dict of all good measures
    centers = {} #list of all centers of all measures, to be combed through later
    topPercent = 0
    for i in population:
        centers[i] = CompCenters(GenCenterInline(population[i]), trainingData) #mapping measure ID to distance from trainingData
        sortedCenters = sorted(centers.items(), key=operator.itemgetter(1)) #list of tuples sorted by center value 
        topPercent += 1 #currently holds total number of measures
    
    topPercent *= .2 #20% of total
    topPercent = int(topPercent)

    for i in range(topPercent):
        fit[sortedCenters[2*i]] = population[sortedCenters[2*i]]
            
    return fit



