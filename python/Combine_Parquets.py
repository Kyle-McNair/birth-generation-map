import os
import numpy as np
import pyarrow.parquet as pq

#merges all the parquet files into one parquet file.

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
        

input_path = "Enter File Path"


combine_parquet_files(input_path, 'Output Name')
