import random
from midiutil.MidiFile import MIDIFile
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
            testCenter[0] += measure[i]['start']
            testCenter[1] += measure[i]['velocity']
            testCenter[2] += measure[i]['duration']
            testCenter[3] += measure[i]['pitch']
            count += 1

    for i in range(4):
        testCenter[i] /= count

    return testCenter

# compares centers and returns distance between two points
def CompCenters(cen1,cen2):
    return math.sqrt((cen2[0]-cen1[0])**2+(cen2[1]-cen1[1])**2+(cen2[2]-cen1[2])**2+(cen2[3]-cen1[3])**2)

# population is test data, trainingData is used to compare center
def ReturnBest(trainingData):
    global fit
    fit = {} #dict of all good measures
    centers = {} #list of all centers of all measures, to be combed through later
    topPercent = 0
    for i in population:
        centers[i] = CompCenters(GenCenterInline(population[i]), trainingData) #mapping measure ID to distance from trainingData
        sortedCenters = sorted(centers.items(), key=operator.itemgetter(1)) #list of tuples sorted by center value
        topPercent += 1 #currently holds total number of measures

    topPercent *= .2 #20% of total
    topPercent = int(topPercent)
    topPercent = 7
    for i in range(1, topPercent + 1):
        fit[i] = {}
    #print(fit)
    for i in range(topPercent):

        fit[sortedCenters[i][0]] = population[sortedCenters[i][0]]

    return

def iterator(iterable):
    for i in iterable:
        yield i


class pop:

    def seed(seed):
        random.seed(seed)

    def info(density, timeSignature, tempo, measures):
        global numOfMeasures
        numOfMeasures = measures
        beatsPerSecond = tempo / 60
        global lengthOfMeasures
        lengthOfMeasures = timeSignature / beatsPerSecond
        global numOfSeconds
        numOfSeconds = numOfMeasures * lengthOfMeasures
        global numOfNotes
        numOfNotes = int(density * numOfSeconds)

    def create():
        global notes
        notes = []
        for i in range(numOfNotes):
            note = {
            'start' : random.randint(0,lengthOfMeasures*100),
            'duration' : random.randint(1,lengthOfMeasures*100),
            'pitch' : random.randint(21,109),
            'velocity' : random.randint(40,120)/100}
            notes.insert(0, note)
    def measures():
        kount = 0
        global population
        population = {}
        for i in range(1, numOfMeasures + 1):
            population[i] = {}
        for j in notes:
            kount += 1
            population[random.randint(1,numOfMeasures)]['note' + str(kount)] = j

    def breed():
        count = 1 #used in indexing new bred songs
        for i in range(1, numOfMeasures + 1):
            population[i] = {}

        for i in range(len(fit)-1): # 0 to 6
            i += 1 # now 1 to 6
            j = i + 1
            while (j < 8): # j goes from (i + 1) to 7 each time
                shorterID = i if (len(fit[i]) < len(fit[j])) else j # measure with fewer notes
                for k in fit[shorterID]: # loop through each note of shorter measure
                    for l in fit[shorterID][k]: # loop through each value inside of each note
                        if l != 'velocity': #don't floor if velocity
                            population[count][k][l] = (fit[i][k][l] + fit[j][k][l])/2
                        else:
                            population[count][k][l] = math.floor( (fit[i][k][l] + fit[j][k][l])/2 )
                count += 1 # increment count for next ID of new

        return population



    def writeTxt():
        for i in population:
            with open('output' + str(i) + '.txt', 'w') as outp:
                for note in population[i]:
                    outp.write(str(population[i][note]['start']) + ' ' + str(population[i][note]['duration']) + ' ' + str(population[i][note]['pitch']) + ' ' + str((population[i][note]['velocity'])) + '\n')
    def writeMidi():
        #print(population)
        channel = 0
        track = 0
        time = 0
        for i in population:
            mf = MIDIFile(numTracks = 1, adjust_origin=True)
            mf.addTrackName(track, time, 'main')
            mf.addTempo(track, time, 240)
            #print(i)
            for note in population[i]:
                pitch = population[i][note]['pitch']
                time = population[i][note]['start']
                duration = population[i][note]['duration'] / 10
                velocity = int((population[i][note]['velocity'])*100)
                mf.addNote(channel, track, pitch, time, duration, velocity)


            with open("output" + str(i) + ".mid", "wb") as outf:
                mf.writeFile(outf)

def main():
    trainer = GenCenter('./ai/Train', '/')
    pop.info(25, 8, 240, 35)
    pop.create()
    pop.measures()
    for i in range(10000):
        ReturnBest(trainer)
        pop.breed
    pop.writeTxt()
    pop.writeMidi()


if __name__ == main():
    main()
