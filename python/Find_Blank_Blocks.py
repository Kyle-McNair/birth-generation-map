import pandas as pd
import geopandas as gpd
import shapely
import os
import matplotlib
from tqdm import tqdm

print("Begin Script...")

def findBlankBlocks(state, csv, s):
    shp = gpd.read_file(state)
    shp = shp.to_crs(epsg=4326)
    shp = gpd.GeoDataFrame(shp)
    data = shp.merge(csv, on='GISJOIN')
    geometry = []
    gisJOIN = []
    for index, row in tqdm(data.iterrows(), total = data.shape[0]):
        if(row['H7V001']) == 0:
            gisJOIN.append(row['GISJOIN'])
            geometry.append(row['geometry'])
    print(s+" had "+str(len(gisJOIN))+" blocks with 0 people")
    result = pd.DataFrame(data = {'GISJOIN':gisJOIN, 'geometry':geometry})
    gdf = gpd.GeoDataFrame(result, geometry=result['geometry'])
    print("Exporting "+s+" to shapefile...")
    gdf.to_file(driver = 'ESRI Shapefile', filename= "2010_Blank_Blocks/"+s+"_blank_block.shp")
    print(s+ " shapefile export complete")

states = ["AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV",
                    "NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"]

print("Loading csv...")

csv = pd.read_csv("2010_Blocks/nhgis0009_csv/nhgis0009_ds172_2010_block.csv", encoding = "ISO-8859-1")
csv = pd.DataFrame(csv)
csv.drop(columns = ['YEAR','REGIONA','DIVISIONA','STATE','STATEA','COUNTY','COUNTYA','COUSUBA','PLACEA','TRACTA',
                    'BLKGRPA','BLOCKA','CONCITA','AIANHHA','RES_ONLYA','TRUSTA','AITSCEA','TTRACTA','TBLKGRPA','ANRCA','CBSAA',
                    'METDIVA','CSAA','NECTAA','NECTADIVA','CNECTAA','UAA','URBRURALA','CDA','SLDUA','SLDLA','ZCTA5A','SUBMCDA',
                    'SDELMA','SDSECA','SDUNIA','NAME','SABINSA'])

print("csv successfully loaded")


for s in states:
    print("Starting with "+ s)
    file_input = ("C:/Users/kwmcnair/documents/semester_2/Final_Practicum/Website/python/Block_Erase/2010_Blocks/nhgis0009_shape/"+s+"_block_2010.shp")
    findBlankBlocks(file_input, csv, s)
    print(s + " is complete")
