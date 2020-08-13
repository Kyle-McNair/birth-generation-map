import pandas as pd
import os
from tqdm import tqdm

#If csv's are too large, parquets are better to store the data. 

states = ["AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT",
                    "NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"]

csv_path = "Enter File Path"
parq_path = "Enter File Path"

for s in states:
    csv = pd.read_csv(csv_path+s+"_Gen_XY.csv", encoding = "ISO-8859-1")
    d = pd.DataFrame(csv)
    d.to_parquet(parq_path+s+"_Gen_XY.parquet.gzip", compression = "gzip")
    print(s+" complete")
