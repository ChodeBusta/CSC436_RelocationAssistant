import json
import html
import csv

states = {}

abbreviation = {}
state_translate = open('StateTranslate.txt', 'r')
curline = state_translate.readline()
while curline:
    split_line = curline.split(',')
    abbreviation[split_line[0]] = split_line[1].replace('\n', '')
    curline = state_translate.readline()
state_translate.close()

rent = open('Rent.csv', 'r')
rent.readline()
rent.readline()
rent.readline()

cur = True
while cur:
    cur = rent.readline()
    if not cur:
        break
    curline = cur.split(',')
    if curline[1] == 'DC':
        continue
    if curline[3] != 'state.average':
        continue
    curline[9] = int((curline[9] + curline[10]).replace('"', ''))
    if abbreviation[curline[1]] not in states:
        states[abbreviation[curline[1]]] = {}
    if curline[6] != '1' or curline[7] != '0':
        continue
    states[abbreviation[curline[1]]]['Rent'] = curline[9]
rent.close()

utilities = open('Utilities.txt', 'r')
cur = True
while cur:
    cur = utilities.readline()
    if not cur:
        break
    curline = cur.split('\t')
    curline[7] = curline[7].replace('\n', '')
    key = curline[0]
    states[key]['Electricity'] = int(curline[1])
    states[key]['Gas'] = int(curline[2])
    states[key]['Water'] = int(curline[3])
    states[key]['Sewer'] = int(curline[4])
    states[key]['Cable'] = int(curline[5])
    states[key]['Internet'] = int(curline[6])
utilities.close()

with open("StateData.json", "w") as outfile:
    outfile.write(json.dumps(states))