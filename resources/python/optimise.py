import sys
import argparse
import re
import ntpath

# Parse arguments
parser = argparse.ArgumentParser(description='Optimise PLY')
parser.add_argument('--path', dest='path', type=str, help='File path')
parser.add_argument('--precision', dest='precision', type=int, default=9, help='How many decimals for numbers')
parser.add_argument('--reduce', dest='reduce', type=float, default=1, help='Reduce to ratio')
parser.add_argument('--limit', dest='limit', type=int, default=1000000000, help='Limit results for testing')

args = parser.parse_args()

path = args.path
precision = args.precision
reduce = args.reduce
limit = args.limit

reducePerTeen = int(reduce * 10)

# Open original file
originalFile = open(path, 'r')

line = originalFile.readline()
i = 0
count = 0
newContent = ''

# Parse each line
while(line and count < limit):
    line = originalFile.readline()
    i += 1
    match = re.search(r'^([-0-9.]+)\s([-0-9.]+)\s([-0-9.]+)\s([0-9]{1,3})\s([0-9]{1,3})\s([0-9]{1,3})\s([0-9]{1,3})?', line)
    #                   (X       )  (Y       )  (Z       )  (R         )  (G         )  (B         )  (A         )

    if(match):
        if(i % 10 < reducePerTeen):

            x = float(match.group(1))
            y = float(match.group(2))
            z = float(match.group(3))
            r = match.group(4)
            g = match.group(5)
            b = match.group(6)

            xFormated = format(x, '.' + str(precision) + 'f')
            yFormated = format(y, '.' + str(precision) + 'f')
            zFormated = format(z, '.' + str(precision) + 'f')

            if(len(str(xFormated)) < len(str(x))):
                x = xFormated

            if(len(str(yFormated)) < len(str(y))):
                y = yFormated

            if(len(str(zFormated)) < len(str(z))):
                z = zFormated

            newLine = str(x) + ' ' + str(y) + ' ' + str(z) + ' ' + r + ' ' + g + ' ' + b + '\n'
            newContent += newLine

            count += 1

# Add header
header = [
    'ply',
    'format ascii 1.0',
    'element vertex ' + str(count),
    'element vertex',
    'property float x',
    'property float y',
    'property float z',
    'property uchar red',
    'property uchar green',
    'property uchar blue',
    'end_header',
]
newContent = '\n'.join(header) + '\n' + newContent

# Open destination file
fileDirectory = ntpath.dirname(path)
fileName = ntpath.basename(path)
destinationFilePath = fileName.replace('.ply', '-optimised.ply')

destinationPath = fileDirectory + '/' + destinationFilePath
destinationFile = open(destinationPath, 'w')
destinationFile.write(newContent)
