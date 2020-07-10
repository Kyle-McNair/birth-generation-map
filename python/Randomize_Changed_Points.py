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
    minX, minY, maxX, maxY = polygon.bounds
    points = []
    while len(points) < n:
        dot = Point([random.uniform(minX, maxX), random.uniform(minY, maxY)])
        if(dot.within(polygon)):
            points.append(dot)
    return points

def getPoints(state, csv):
    shp = gpd.read_file("C:/Users/kwmcnair/Documents/Semester_2/Final_Practicum/Website/python/Block_Erase/Block_Groups_Erased/"+state+"_new_bg.shp")
    shp = shp.to_crs('epsg:4326')
    shp = gpd.GeoDataFrame(shp)
    shp.head()
    data = shp.merge(csv, on='GISJOIN')
    generations = ["GZ","ML","GX","BB","SG"]
    for g in generations:
        pos_x = []
        pos_y = []
        pos_gen = []
        pos_list = []
        neg_x = []
        neg_y = []
        neg_gen = []
        neg_list = []
        for index, row in tqdm(data.iterrows(), total = data.shape[0]):
            if row[g] > 0:
                pos = randomPoints(row['geometry'],row[g])
                for p in pos:
                    pos_x.append(p.x)
                    pos_y.append(p.y)
                    pos_gen.append(g)
                    pos_list.append("pos")
            if row[g] < 0:
                neg = randomPoints(row['geometry'],row[g]*(-1))
                for n in neg:
                    neg_x.append(n.x)
                    neg_y.append(n.y)
                    neg_gen.append(g)
                    neg_list.append("neg")
    df1 = pd.DataFrame(data={"X": pos_x, "Y":pos_y, "Generation":pos_gen,"Type":pos_list})
    df2 = pd.DataFrame(data={"X": neg_x, "Y":neg_y, "Generation":neg_gen,"Type":neg_list})
    frames = [df1, df2]
    df = pd.concat(frames)
    return df
#AL already done, AK will go last...
states = ["AL","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT",
        "NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","AK","IN"]

csv = pd.read_csv("C:/Users/kwmcnair/Documents/Semester_2/Final_Practicum/Website/python/Census_Block/Birth_Generations_BG_Change.csv", encoding = "ISO-8859-1")
csv = pd.DataFrame(csv)

path = "C:/Users/kwmcnair/Documents/Semester_2/Final_Practicum/Website/python/gain_loss_xy_csv/"

for s in states:
    print("Creating random points with "+s+"...")
    d = getPoints(s, csv)
    d.to_csv(path+s+"_Gen_XY_change.csv", sep = ',', index = False)
    print(s+" complete")
    


