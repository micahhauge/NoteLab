import random
import KmeansMod

maxPopSize = 10000
maxNumPopulations = 100



def genRandPopulation(baseTimeDif):
    population = []
    currNote = [0.0,0.0,0.0,0.0]
    currTimeStamp = 0
    for i in range(maxPopSize):
        if( i == 0):
            currNote[0] = 0
            currNote[1] = random.randrange(7, 50)/10
            currNote[2] = random.randint(21,109)
            currNote[3] = random.uniform(0, 1)
        else:
            currNote[0] = baseTimeDif + currTimeStamp
            currNote[1] = random.randrange(7, 50)/10
            currNote[2] = random.randint(21,109)
            currNote[3] = random.uniform(0, 1)

        currTimeStamp += baseTimeDif    
        population.append(currNote[:]);
    return population;


def breed(parentPop):
    childPop = []
    currChild = [0.0,0.0,0.0,0.0]
    for i in range(len(parentPop)):
        if(i+1 < len(parentPop)):
            currChild[0] = (parentPop[i][0] + parentPop[i+1][0])/2
            currChild[1] = (parentPop[i][1] + parentPop[i+1][1])/2
            currChild[2] = (parentPop[i][2] + parentPop[i+1][2])/2
            currChild[3] = (parentPop[i][3] + parentPop[i+1][3])/2
        else:
            currChild[0] = (parentPop[i][0] + parentPop[0][0])/2
            currChild[1] = (parentPop[i][1] + parentPop[0][1])/2
            currChild[2] = (parentPop[i][2] + parentPop[0][2])/2
            currChild[3] = (parentPop[i][3] + parentPop[0][3])/2
            
        childPop.append(currChild[:]);
        
            
    return childPop
            


def GenCenter_direct(population):
    popCenter = [0.0,0.0,0.0,0.0]
    
    for index in range(len(population)):
        popCenter[0] += population[index][0]
        popCenter[1] += population[index][1]
        popCenter[2] += population[index][2]
        popCenter[3] += population[index][3]

    popCenter[0] /= len(population)
    popCenter[1] /= len(population)
    popCenter[2] /= len(population)
    popCenter[3] /= len(population)

    return popCenter



def GenAllRandPopulations(numPops):
    fullPopulationSet = []
    for i in range(numPops):
        fullPopulationSet.append(genRandPopulation(15))




allPops = GenAllRandPopulations(maxNumPopulations)




trainCenter = KmeansMod.GenCenter("Test",'\\')

population1 = genRandPopulation(15)
print(population1[1])
population1 = breed(population1)
print(population1[1])


pop1Center = GenCenter_direct(population1)

population2 = genRandPopulation(15)
print(population2[1])
population2 = breed(population2)
print(population2[1])


pop2Center = GenCenter_direct(population2)



print(KmeansMod.CompCenters(trainCenter,pop1Center),KmeansMod.CompCenters(trainCenter,pop2Center))
