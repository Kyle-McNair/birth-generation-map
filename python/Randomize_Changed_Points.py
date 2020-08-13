import pandas as pd
import geopandas as gpd
import shapely
import os
import matplotlib
from tqdm import tqdm
import numpy as np
import random
from shapely.geometry import Polygon, Point

# Random Points function goes through each census block group and generates random XY coordinates within that block group
def randomPoints(polygon, n):
    #finds the coordinates to the Block Group Polygon
    minX, minY, maxX, maxY = polygon.bounds
    points = []
    while len(points) < n:
        #randomly places XY coordinate
        dot = Point([random.uniform(minX, maxX), random.uniform(minY, maxY)])
        if(dot.within(polygon)):
            points.append(dot)
    #returns points to be used to retrieve XY coordinates
    return points

# getPoints is to retrieve the information by row and call the randomPoints function to generate random XY coordinates within the U.S.
# Census Block Group.
def getPoints(state, csv, dd):
    shp = gpd.read_file("File Path"+state+"shapefile name")
    shp = shp.to_crs('epsg:4326')
    shp = gpd.GeoDataFrame(shp)
    shp.head()
    data = shp.merge(csv, on='GISJOIN')
    # used to iterate through each birth generation.
    generations = ["GZ","ML","GX","BB","SG"]
    for g in generations:
        #lists for positive and negative changes used
        pos_x = []
        pos_y = []
        pos_gen = []
        pos_list = []
        neg_x = []
        neg_y = []
        neg_gen = []
        neg_list = []
        for index, row in tqdm(data.iterrows(), total = data.shape[0]):
            # positive population chagne
            if row[g] > 0:
                # row[g] is the population count. 
                pos = randomPoints(row['geometry'],row[g]/dd)
                for p in pos:
                    pos_x.append(p.x)
                    pos_y.append(p.y)
                    pos_gen.append(g)
                    pos_list.append("pos")
            # negative population change
            if row[g] < 0:
                neg = randomPoints(row['geometry'],(row[g]*(-1))/dd)
                for n in neg:
                    neg_x.append(n.x)
                    neg_y.append(n.y)
                    neg_gen.append(g)
                    neg_list.append("neg")
    #merge the positive change and negative changes together.
    df1 = pd.DataFrame(data={"X": pos_x, "Y":pos_y, "Generation":pos_gen,"Type":pos_list})
    df2 = pd.DataFrame(data={"X": neg_x, "Y":neg_y, "Generation":neg_gen,"Type":neg_list})
    frames = [df1, df2]
    df = pd.concat(frames)
    return df

## WARNING: Alaska may take a while in this script and may be done faster manually in ArcGIS
states = ["AL","AZ","AK","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IA","IN","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT",
        "NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"]

csv = pd.read_csv("Enter File Path", encoding = "ISO-8859-1")
csv = pd.DataFrame(csv)

path = "Enter File Path"

dot_density = 25

for s in states:
    print("Creating random points with "+s+"...")
    d = getPoints(s, csv, dot_density)
    d.to_csv(path+s+"_Gen_XY_change.csv", sep = ',', index = False)
    print(s+" complete")
    


