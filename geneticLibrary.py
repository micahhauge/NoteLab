import random
from midiutil.MidiFile import MIDIFile

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
            'velocity' : random.random()}
            notes.insert(0, note)
    def measures():
        kount = 0
        global population
        population = {}
        for i in range(1, numOfMeasures + 1):
            population['m' + str(i)] = {}
        for j in notes:
            kount += 1
            population['m' + str(random.randint(1,numOfMeasures))]['note' + str(kount)] = j



    def breed():
        measurable = iterator(population)
        for i in range(len(population)//4):
            measure1 = next(measurable)
            measure2 = next(measurable)
            measure3 = next(measurable)
            measure4 = next(measurable)
            notable1 = iterator(population[measure1])
            notable2 = iterator(population[measure2])
            notable3 = iterator(population[measure3])
            notable4 = iterator(population[measure4])
            for j in population[measure1]:
                noter1 = next(notable1)
                noter2 = next(notable2)
                noter3 = next(notable3)
                noter4 = next(notable4)
                population[measure2][noter2]['start'] = population[measure1][noter1]['start']
                population[measure3]

    def writeTxt():
        for i in population:
            with open('output' + i + '.txt', 'w') as outp:
                for note in population[i]:
                    outp.write(str(population[i][note]['start']) + ' ' + str(population[i][note]['duration']) + ' ' + str(population[i][note]['pitch']) + ' ' + str((population[i][note]['velocity'])) + '\n')
    def writeMidi():
        for i in population:
            mf = MIDIFile(numTracks = 1, adjust_origin=True)
            measure = next(iterator(population[i]))
            pitch = population[i][measure]['pitch']
            start = population[i][measure]['start']
            duration = population[i][measure]['duration']
            velocity = int((population[i][measure]['velocity'])*255)
            mf.addNote(0, 0, pitch, start, duration, velocity)
            with open("output" + i + ".mid", "wb") as outf:
                mf.writeFile(outf)
def main():
    pop.info(15, 4, 120, 100)
    pop.create()
    pop.measures()
    pop.writeTxt()
    pop.breed()
    pop.writeMidi()


if __name__ == main():
    main()
