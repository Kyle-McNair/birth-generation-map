import pandas as pd
import geopandas as gpd
import shapely
import os
import matplotlib
from tqdm import tqdm

print("Begin Script...")

csv_file = input("Enter the file path of the U.S. Census Block csv: ")
shp_path = input("Entre the file path of the where all U.S. Census Block shapefiles are stored: ")

# findBlankBlocks goes through each state and finds U.S. Census Blocks that have a population of zero.
def findBlankBlocks(state, csv, s):
    shp = gpd.read_file(state)
    # reprojecting
    shp = shp.to_crs(epsg=4326)
    shp = gpd.GeoDataFrame(shp)
    data = shp.merge(csv, on='GISJOIN')
    geometry = []
    gisJOIN = []
    for index, row in tqdm(data.iterrows(), total = data.shape[0]):
        if(row['H7V001']) == 0:
            gisJOIN.append(row['GISJOIN'])
            geometry.append(row['geometry'])
    # print statement informing how many blocks are removed.
    print(s+" had "+str(len(gisJOIN))+" blocks with 0 people")
    result = pd.DataFrame(data = {'GISJOIN':gisJOIN, 'geometry':geometry})
    # converts to geodataframe and then exported into an ESRI shapfile.
    gdf = gpd.GeoDataFrame(result, geometry=result['geometry'])
    print("Exporting "+s+" to shapefile...")
    gdf.to_file(driver = 'ESRI Shapefile', filename= "2010_Blank_Blocks/"+s+"_blank_block.shp")
    print(s+ " shapefile export complete")

# List of states
states = ["AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV",
                    "NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"]

print("Loading csv...")

# Enter the csv filepath of Census Block data.
csv = pd.read_csv(csv_file, encoding = "ISO-8859-1")
csv = pd.DataFrame(csv)
# Columns not needed
csv.drop(columns = ['YEAR','REGIONA','DIVISIONA','STATE','STATEA','COUNTY','COUNTYA','COUSUBA','PLACEA','TRACTA',
                    'BLKGRPA','BLOCKA','CONCITA','AIANHHA','RES_ONLYA','TRUSTA','AITSCEA','TTRACTA','TBLKGRPA','ANRCA','CBSAA',
                    'METDIVA','CSAA','NECTAA','NECTADIVA','CNECTAA','UAA','URBRURALA','CDA','SLDUA','SLDLA','ZCTA5A','SUBMCDA',
                    'SDELMA','SDSECA','SDUNIA','NAME','SABINSA'])

print("csv successfully loaded")

# For loop going through each state in the state list
for s in states:
    print("Starting with "+ s)
    #loops through state file name
    file_input = (shp_path+s+"Name of shapefile here")
    #findBlankBlocks is called to join csv and shapefile together and export a new shapefile of blocks with population of 0.
    findBlankBlocks(file_input, csv, s)
    print(s + " is complete")
