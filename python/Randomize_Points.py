import pandas as pd
import geopandas as gpd
import shapely
import os
import matplotlib
from tqdm import tqdm
import numpy as np
import random
from shapely.geometry import Polygon, Point

answer = input("Would you like the module to combine all the parquet files at the end? Enter Y/N")

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

def combine_parquet_files(input_folder, target_path):
    try:
        files = []
        for file_name in os.listdir(input_folder):
            files.append(pq.read_table(os.path.join(input_folder, file_name)))
        with pq.ParquetWriter(target_path,
                files[0].schema,
                version='2.0',
                compression='gzip',
                use_dictionary=True,
                write_statistics=True) as writer:
            for f in files:
                writer.write_table(f)
    except Exception as e:
        print(e)
        

csv = pd.read_csv("C:/Users/kwmcnair/Documents/Semester_2/Final_Practicum/Website/python/Census_Block/Birth_Generations_BG_2018.csv", encoding = "ISO-8859-1")
csv = pd.DataFrame(csv)

csv_path = "C:/Users/kwmcnair/Documents/Semester_2/Final_Practicum/Website/python/xy_csv/"
parquet_path = "C:/Users/kwmcnair/Documents/Semester_2/Final_Practicum/Website/python/xy_parquet_2018/"


for s in states:
    print("Creating random points with "+s+"...")
    d = getPoints(s, csv)
    d.to_csv(path+s+"_Gen_XY.csv", sep = ',', index = False)
    d.to_parquet(parq_path+s+"_Gen_XY.parquet.gzip", compression = "gzip")
    print(s+" complete")

input_path = "C:/Users/kwmcnair/Documents/Semester_2/Final_Practicum/Website/python/xy_parquet_2018"

if answer == "Y":
    combine_parquet_files(input_path, 'combined.parquet')
else:
    print("Randomize Points is complete.")