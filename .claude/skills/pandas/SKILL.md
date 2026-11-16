---
name: pandas
description: pandas & polars — data loading, cleaning, transformation, aggregation, merging, time series, and production data pipelines for data science and ML.
triggers: [pandas, polars, dataframe, csv, data cleaning, data wrangling, groupby, merge, pivot, time series, pd.read, iloc, loc, apply]
version: "1.0"
source: https://pandas.pydata.org/docs
---

# pandas / polars

## Setup
```python
import pandas as pd
import numpy as np
import polars as pl  # faster for large data
```

## Load data
```python
df = pd.read_csv("data.csv", parse_dates=["date"], dtype={"id": str})
df = pd.read_parquet("data.parquet")          # preferred for ML pipelines
df = pd.read_json("data.json", lines=True)    # JSONL
df = pd.read_sql("SELECT * FROM table", conn)
```

## Inspect
```python
df.shape          # (rows, cols)
df.dtypes
df.describe()
df.info()
df.head(10)
df.isnull().sum()
df.duplicated().sum()
df["col"].value_counts(normalize=True)
```

## Clean
```python
df = df.dropna(subset=["critical_col"])
df["col"] = df["col"].fillna(df["col"].median())
df = df.drop_duplicates(subset=["id"], keep="last")
df["col"] = df["col"].str.strip().str.lower()
df = df.rename(columns={"old": "new"})
df["date"] = pd.to_datetime(df["date"])
df["category"] = df["category"].astype("category")
```

## Filter + select
```python
df[df["score"] > 0.5]
df.query("score > 0.5 and status == 'active'")
df.loc[df["id"].isin(ids), ["id", "score", "label"]]
df.iloc[0:100, 0:5]
```

## Transform
```python
df["new"] = df["a"] + df["b"]
df["bucket"] = pd.cut(df["score"], bins=[0, .33, .66, 1], labels=["low","mid","high"])
df["rank"] = df["score"].rank(pct=True)
df = df.assign(log_score=lambda x: np.log1p(x["score"]))

# Apply (slow — prefer vectorized ops)
df["result"] = df["col"].apply(lambda x: transform(x))
# Fast alternative:
df["result"] = np.where(df["col"] > 0, "pos", "neg")
```

## Groupby + aggregate
```python
df.groupby("category")["value"].agg(["mean", "std", "count"])
df.groupby(["user_id", "date"])["event"].count().reset_index()

# Multiple aggregations
df.groupby("segment").agg(
    revenue=("amount", "sum"),
    orders=("order_id", "nunique"),
    avg_value=("amount", "mean")
).reset_index()
```

## Merge / join
```python
pd.merge(left, right, on="id", how="left")
pd.merge(left, right, left_on="user_id", right_on="id", how="inner")
pd.concat([df1, df2], ignore_index=True)
```

## Pivot / reshape
```python
df.pivot_table(index="user", columns="month", values="revenue", aggfunc="sum", fill_value=0)
df.melt(id_vars=["id"], value_vars=["jan","feb","mar"], var_name="month", value_name="revenue")
```

## Time series
```python
df = df.set_index("date").sort_index()
df.resample("W").agg({"sales": "sum", "users": "nunique"})
df["rolling_7d"] = df["value"].rolling("7D").mean()
df["lag_1"] = df["value"].shift(1)
df["pct_change"] = df["value"].pct_change()
```

## Polars (faster for >1M rows)
```python
import polars as pl
df = pl.read_parquet("data.parquet")
df.filter(pl.col("score") > 0.5).groupby("category").agg(pl.col("value").mean())
```

## Production patterns
```python
# Chunked processing for large files
for chunk in pd.read_csv("big.csv", chunksize=100_000):
    process(chunk)

# Save efficiently
df.to_parquet("output.parquet", index=False, compression="zstd")
df.to_csv("output.csv", index=False)
```

## Rules
- Use `parquet` over CSV for ML pipelines (10x faster, typed)
- Avoid `iterrows()` — use vectorized ops or `.apply()` only as last resort
- `query()` is faster than boolean indexing for complex filters
- Always `reset_index()` after groupby to avoid index confusion
- For >5M rows: use polars or chunked pandas
