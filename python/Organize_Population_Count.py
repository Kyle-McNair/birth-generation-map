import pandas as pd
from tqdm import tqdm

# To minimize confusion, the csv files computed for this script had coluns deleted/renamed for specifically classifying age groups.

print("Begin Script...")

#calculate popultion by birth generation
def CalculateGenerations(year, columns):
    print("Calculating "+year+" data")
    csv = pd.read_csv(str(year)+"_ACS_BG.csv", encoding = "ISO-8859-1")
    csv = pd.DataFrame(csv)
    GZ = [] #Generation Z
    ML = [] #Millennials
    GX = [] #Generation X
    BB = [] #Baby Boomers
    SG = [] #Silent Generation
    if year == "2018":
        # 2018 has different row values based on the 5-year gap.
        for index, row in tqdm(csv.iterrows(), total = csv.shape[0]):
            #iterates through to add population by birth generation.
            GZ_total = row[5] + row[6]+ row[7] + row[8]+ row[9] + row[29]+ row[30]+ row[31]+ row[32]+ row[33]
            ML_total = row[10] + row[11] + row[12] + row[13] + row[14] + row[34] + row[35] + row[36] + row[37] + row[38]
            GX_total = row[15] + row[16] + row[17] + row[18] + row[39] + row[40] + row[41] + row[42]
            BB_total = row[19] + row[20] + row[21] + row[22] + row[23] + row[24] + row[43] + row[44] + row[45] + row[46] + row[47] + row[48]
            SG_total = row[25] + row[26] + row[27] + row[49] + row[50] + row[51]
            #appends each number to the birth generation lists.
            GZ.append(GZ_total)
            ML.append(ML_total)
            GX.append(GX_total)
            BB.append(BB_total)
            SG.append(SG_total)
        #new column added in dataframe
        csv['GZ_'+str(year)] = GZ
        csv['ML_'+str(year)] = ML
        csv['GX_'+str(year)] = GX
        csv['BB_'+str(year)] = BB
        csv['SG_'+str(year)] = SG
        csv.drop(columns, inplace=True, axis=1)
    if year == "2013":
        for index, row in tqdm(csv.iterrows(), total = csv.shape[0]):
            GZ_total = row[5] + row[6]+ row[7]  + row[29]+ row[30]+ row[31]
            ML_total = row[8] + row[9] + row[10] + row[11] + row[12] + row[13] + row[32] + row[33] + row[34] + row[35] + row[36] + row[37]
            GX_total = row[14] + row[15] + row[16] + row[17] + row[38] + row[39] + row[40] + row[41]
            BB_total = row[18] + row[19] + row[20] + row[21] + row[22] + row[23] + row[42] + row[43] + row[44] + row[45] + row[46] + row[47]
            SG_total = row[24] + row[25] + row[26] + row[27] + row[48] + row[49] + row[50] + row[51]
            GZ.append(GZ_total)
            ML.append(ML_total)
            GX.append(GX_total)
            BB.append(BB_total)
            SG.append(SG_total)
        csv['GZ_'+str(year)] = GZ
        csv['ML_'+str(year)] = ML
        csv['GX_'+str(year)] = GX
        csv['BB_'+str(year)] = BB
        csv['SG_'+str(year)] = SG
        csv.drop(columns, inplace=True, axis=1)
    print(year+" is calculated")
    return csv

# Population change between 2018 and 2013
# Used after the CalculateGenerations
def Calculate_Changes(data):
    print("Calculating population changes by birth generation...")
    GZ = [] #Generation Z
    ML = [] #Millennials
    GX = [] #Generation X
    BB = [] #Baby Boomers
    SG = [] #Silent Gneration
    for index, row in tqdm(data.iterrows(), total = data.shape[0]):
        #reads the dataframe and creates a new number of the population change
        GZ_ch = row['GZ_2018'] - row['GZ_2013']
        ML_ch = row['ML_2018'] - row['ML_2013']
        GX_ch = row['GX_2018'] - row['GX_2013']
        BB_ch = row['BB_2018'] - row['BB_2013']
        SG_ch = row['SG_2018'] - row['SG_2013']
        #appends number to birth generation lists
        GZ.append(GZ_ch)
        ML.append(ML_ch)
        GX.append(GX_ch)
        BB.append(BB_ch)
        SG.append(SG_ch)
    #new columns added in dataframe
    data['GZ_ch'] = GZ
    data['ML_ch'] = ML
    data['GX_ch'] = GX
    data['BB_ch'] = BB
    data['SG_ch'] = SG
    print("Calculation complete. Exporting to new csv...")
    data.to_csv("Birth_Generations_BG.csv", sep = ',', index = False)
    print("csv export complete")

columns = ['STATE','COUNTY','Total','Male', 'Male: Under 5 years', 'Male: 5 to 9 years', 'Male: 10 to 14 years',
         'Male: 15 to 17 years','Male: 18 and 19 years','Male: 20 years','Male: 21 years','Male: 22 to 24 years',
         'Male: 25 to 29 years','Male: 30 to 34 years','Male: 35 to 39 years','Male: 40 to 44 years','Male: 45 to 49 years',
         'Male: 50 to 54 years','Male: 55 to 59 years','Male: 60 and 61 years','Male: 62 to 64 years','Male: 65 and 66 years',
         'Male: 67 to 69 years','Male: 70 to 74 years','Male: 75 to 79 years','Male: 80 to 84 years','Male: 85 years and over',
         'Female','Female: Under 5 years','Female: 5 to 9 years','Female: 10 to 14 years','Female: 15 to 17 years','Female: 18 and 19 years',
         'Female: 20 years','Female: 21 years','Female: 22 to 24 years','Female: 25 to 29 years','Female: 30 to 34 years','Female: 35 to 39 years',
         'Female: 40 to 44 years','Female: 45 to 49 years','Female: 50 to 54 years','Female: 55 to 59 years','Female: 60 and 61 years','Female: 62 to 64 years',
         'Female: 65 and 66 years','Female: 67 to 69 years','Female: 70 to 74 years','Female: 75 to 79 years','Female: 80 to 84 years','Female: 85 years and over']

years = ["2018","2013"]
df_list = []

for y in years:
    df = CalculateGenerations(y, columns)
    df_list.append(df)

# merge years together
yr1 = df_list[0]
yr2 = df_list[1]

data = yr1.merge(yr2, on = 'GISJOIN')


print("Both dataframes are merged")

Calculate_Changes(data)
    
    
    
