import pandas as pd
from tqdm import tqdm
import json
import numpy as np
import fastparquet


# naming json and geojson files for initial input
name1 = input("Enter the name you would like to call the json file: ")
name2 = input("Enter the name you would like to call the geojson file: ")

# converting the file to json first
def convert_json(df, json_name):
    print("Converting data frame to json file...")
    df_list = []
    for row in tqdm(df.itertuples(index=True), total=df.shape[0]):
        data = {}
        data['X'] = getattr(row, "X")
        data['Y'] = getattr(row, "Y")
        data['Generation'] = getattr(row, "Generation")
        df_list.append(data)
    df_json = json.dumps(df_list)
    with open(json_name+".json","w") as json_file:
        json_file.write(df_json)
        print("json is created.")
        json_file.close()
    return df_json

# reading json then converting to geojson
def convert_geojson(df_json, geojson_name):
    json_load = json.loads(df_json) #load the json
    geojson = {"type":"FeatureCollection"} 
    features = []
    for i in tqdm(json_load): 
        properties = {} 
        centroids = []
        x = (i["X"]) 
        y = (i["Y"]) 
        centroids.append(x)
        centroids.append(y)
        g = (i['Generation'])
        data_dict = {"type":"Feature","geometry":{"type":"Point","coordinates":centroids},"properties":{"Generation": g}}
        features.append(data_dict)
    geojson.update({"features":features})
    data_geojson = json.dumps(geojson) #dump the json into a geojson
    with open(geojson_name+'geojson.json','w') as  geojson_file:
        geojson_file.write(data_geojson)
        print ('json is converted to geojson.')

# read parquet file to convert to json (then later geojson)
combined = pd.read_parquet('xy_parquet_2018/CA_Gen_XY.parquet.gzip')

json1 = convert_json(combined, name1)

json2 = convert_geojson(json1, name2)
