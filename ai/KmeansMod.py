#!\usr\bin\python3
import random
import math
import time
from decimal import Decimal
import sys
import datetime
from os import listdir
from os.path import isfile, join

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
    trainCenter = [0.0,0.0,0.0,0.0]
    count = 0
    for i in measure: #loop through each note per measure
        for j in measure[i]: #loop through each value per note
            trainCenter[int(j)] += measure[i][j]
        count += 1

    for i in range(4):
        trainCenter[j] /= count

    return trainCenter


def CompCenters(cen1,cen2):
    return math.sqrt((cen2[0]-cen1[0])**2+(cen2[1]-cen1[1])**2+(cen2[2]-cen1[2])**2+(cen2[3]-cen1[3])**2)

# pass entire population
def ReturnBest(population):
    fit = {}
    for i in population:
        fit[i] = GenCenterInline(population[i])



cen1 = GenCenter('Train','\\')
cen2 = GenCenter('Test','\\')

print(CompCenters(cen1,cen2))



