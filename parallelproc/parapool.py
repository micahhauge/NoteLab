from subprocess import call
from multiprocessing import Process
import os, sys

pList = sys.argv[1]

#hostList = ["tayodroid0","tayodroid1"]

nextAvHost = 0
allProcs = []

hostList = ["192.168.1.2","192.168.1.3","192.168.1.4","192.168.1.5",
"192.168.1.10","192.168.1.11","192.168.1.20","192.168.1.21",
"192.168.1.22","192.168.1.23","192.168.1.24","192.168.1.25","192.168.1.26",
"192.168.1.27","192.168.1.30","192.168.1.31","192.168.1.32","192.168.1.33","192.168.1.34"];

hostBase = "192.168.1."

maxIp = 36



def GenAlgo_Parallel(host,trainingDir, iter):
	call(["ssh",host,"python3 /home/odroid/Documents/tmp.py "+trainingDir + " " + iter])
	#call(["ssh",host,"ls","-l"])
	

def GetNextAvHost():
	hostToUse = "";
	global nextAvHost;
	while(hostToUse == ""):
		#nextAvHost = (nextAvHost + 1)%maxIp
		#if os.system("ping -c 1 " + nextAvHost) == 0:
		#	hostToUse = hostBase + nextAvHost
		#nextAvHost = (nextAvHost + 1)%len(hostList)
		
		
		if os.system("ping -c 1 " + hostList[nextAvHost]) == 0:
			hostToUse = hostList[nextAvHost]
		nextAvHost = (nextAvHost + 1)%len(hostList)
	return hostToUse
	
def SetupThreads(argList):
	#print(argList)
	for i in range(int(len(argList)/2)):
		currHost = GetNextAvHost()
		print("HOST::: " + currHost)
		print(argList[i*2] + " "+argList[i*2+1])
		#print(argList[i*2],argList[i*2+1])
		#print("HOST:::^ " + currHost)
		
		allProcs.append(Process(target=GenAlgo_Parallel, args=(currHost,argList[i*2],argList[i*2+1])))
		'''if(i > 0 and i%2 == 0):
			print("i: %d, %s,%s", i, argList[i-1], argList[i])'''
			
			
	for i in range(len(allProcs)):
		print("proc: " + str(i))
		allProcs[i].start()
		allProcs[i].join()

if __name__ == '__main__':
	argList = [];

	with open(pList, 'r') as f:
		for line in f:
			for s in line.split(' '):
				argList.append(s)
	SetupThreads(argList)
			
	#print(argList[5])
	#SetupGramThreads(argList)
	#p1 = Process(target=GenNgram_parallel, args=("tayodroid0",'/home/odroid/Documents/', '/home/odroid/Documents/nGramData/', '/home/odroid/Documents/nGramData/out_23.txt'))
	