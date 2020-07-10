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
    x = []
    y = []
    gen = []
    for g in generations:
        for index, row in tqdm(data.iterrows(), total = data.shape[0]):
            dots = randomPoints(row['geometry'],row[g])
            for d in dots:
                x.append(d.x)
                y.append(d.y)
                gen.append(g)
    df = pd.DataFrame(data={"X": x, "Y":y, "Generation":gen})
    return df
#AL already done, AK will go last...
states = ["AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT",
                    "NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","AK","IN"]

csv = pd.read_csv("C:/Users/kwmcnair/Documents/Semester_2/Final_Practicum/Website/python/Census_Block/Birth_Generations_BG_2018.csv", encoding = "ISO-8859-1")
csv = pd.DataFrame(csv)

path = "C:/Users/kwmcnair/Documents/Semester_2/Final_Practicum/Website/python/xy_csv/"

for s in states:
    print("Creating random points with "+s+"...")
    d = getPoints(s, csv)
    d.to_csv(path+s+"_Gen_XY.csv", sep = ',', index = False)
    print(s+" complete")


##print("combining all dataframes into one before exporting to csv...") 
##combine = pd.concat(df_list)    
###naming the csv file
##print("exporting csv...")


##print("csv exported")
