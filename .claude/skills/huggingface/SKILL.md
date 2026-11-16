---
name: huggingface
description: HuggingFace — transformers, datasets, PEFT fine-tuning, model hub, inference, embeddings, and production deployment for ML engineers.
triggers: [huggingface, transformers, model hub, fine-tuning, peft, lora, datasets, pipeline, tokenizer, bert, llama, mistral, embedding model, hf, from_pretrained]
version: "1.0"
source: https://huggingface.co/docs
---

# HuggingFace

## Quick inference (pipeline)
```python
from transformers import pipeline

# Text generation
gen = pipeline("text-generation", model="meta-llama/Llama-3.2-3B-Instruct", device=0)
out = gen("Explain RAG in one sentence:", max_new_tokens=100)

# Classification
clf = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english")
clf(["I love this!", "This is terrible."])

# Embeddings
embedder = pipeline("feature-extraction", model="BAAI/bge-small-en-v1.5", device=0)
embeddings = embedder(["text 1", "text 2"], return_tensors=False)
```

## Tokenizer + model (full control)
```python
from transformers import AutoTokenizer, AutoModelForCausalLM, AutoModelForSequenceClassification
import torch

model_id = "meta-llama/Llama-3.2-3B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    torch_dtype=torch.bfloat16,
    device_map="auto",          # auto GPU/CPU placement
)

inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
with torch.no_grad():
    outputs = model.generate(**inputs, max_new_tokens=256, temperature=0.7, do_sample=True)
response = tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
```

## Datasets
```python
from datasets import load_dataset, Dataset, DatasetDict
import pandas as pd

# Load from hub
ds = load_dataset("squad", split="train")
ds = load_dataset("json", data_files={"train": "train.jsonl", "test": "test.jsonl"})

# From pandas
ds = Dataset.from_pandas(df)

# Process
ds = ds.map(lambda x: tokenizer(x["text"], truncation=True, max_length=512), batched=True)
ds = ds.filter(lambda x: len(x["text"]) > 10)
ds = ds.train_test_split(test_size=0.1, seed=42)

# Save/load
ds.save_to_disk("data/processed")
ds = load_dataset("data/processed")
```

## Fine-tuning with PEFT/LoRA
```python
from peft import LoraConfig, get_peft_model, TaskType
from transformers import TrainingArguments, Trainer

# LoRA config
lora_config = LoraConfig(
    r=16,                           # rank — higher = more params
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.1,
    task_type=TaskType.CAUSAL_LM,
)
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()  # e.g. 0.1% of total

# Training
args = TrainingArguments(
    output_dir="./output",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    bf16=True,
    logging_steps=10,
    save_strategy="epoch",
    evaluation_strategy="epoch",
    load_best_model_at_end=True,
)
trainer = Trainer(model=model, args=args, train_dataset=ds["train"], eval_dataset=ds["test"])
trainer.train()

# Save
model.save_pretrained("./lora-model")
tokenizer.save_pretrained("./lora-model")
```

## Sentence Transformers (embeddings)
```python
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("BAAI/bge-large-en-v1.5")
embeddings = model.encode(texts, batch_size=64, normalize_embeddings=True, show_progress_bar=True)

# Similarity
scores = util.cos_sim(query_emb, doc_embs)   # returns tensor
```

## Quantization (run large models on less VRAM)
```python
from transformers import BitsAndBytesConfig

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
)
model = AutoModelForCausalLM.from_pretrained(model_id, quantization_config=bnb_config, device_map="auto")
```

## Inference API (serverless)
```python
from huggingface_hub import InferenceClient

client = InferenceClient(token="hf_...")
response = client.text_generation("Your prompt", model="meta-llama/Llama-3.1-8B-Instruct", max_new_tokens=200)
embeddings = client.feature_extraction("text to embed", model="BAAI/bge-small-en-v1.5")
```

## Model card checklist
| Field | Required |
|---|---|
| Model description | ✅ |
| Training data | ✅ |
| Evaluation results | ✅ |
| Intended use / limitations | ✅ |
| License | ✅ |
| CO2 emissions | Optional |

## Popular model families
| Use case | Model | Size |
|---|---|---|
| Embedding | `BAAI/bge-large-en-v1.5` | 335M |
| Reranking | `BAAI/bge-reranker-v2-m3` | 568M |
| Classification | `distilbert-base-uncased` | 66M |
| Generation (small) | `Qwen/Qwen2.5-3B-Instruct` | 3B |
| Generation (mid) | `meta-llama/Llama-3.1-8B-Instruct` | 8B |
| Code | `Qwen/Qwen2.5-Coder-7B-Instruct` | 7B |

## Rules
- Always set `device_map="auto"` for multi-GPU or large models
- Use `bfloat16` over `float16` (more stable training)
- LoRA: start with `r=8`, increase if underfitting
- Cache downloads: `HF_HOME=/data/hf_cache` env var
- For production: use TGI or vLLM — not raw transformers
