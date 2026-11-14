---
name: langchain
description: LangChain — chains, RAG pipelines, agents, memory, vector stores, document loaders, and LangSmith observability for LLM applications.
triggers: [langchain, langchain rag, langchain agent, langchain chain, langchain memory, langchain vectorstore, lcel, langsmith, retrieval augmented generation, langchain tools]
version: "1.0"
source: https://python.langchain.com/docs
---

# LangChain

## Install
```bash
pip install langchain langchain-openai langchain-anthropic langchain-community chromadb
```

## LCEL (LangChain Expression Language) — compose chains
```python
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-4o-mini")
# or: llm = ChatAnthropic(model="claude-sonnet-4-5")

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a {role}."),
    ("human",  "{question}"),
])

chain = prompt | llm | StrOutputParser()
result = chain.invoke({"role": "Python expert", "question": "What is a GIL?"})

# Streaming
async for chunk in chain.astream({"role": "expert", "question": "Explain RAG"}):
    print(chunk, end="", flush=True)
```

## RAG pipeline
```python
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.runnables import RunnablePassthrough

# 1. Load + split documents
loader = DirectoryLoader("./docs", glob="**/*.md", loader_cls=TextLoader)
docs = loader.load()
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = splitter.split_documents(docs)

# 2. Embed + store
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(chunks, embeddings, persist_directory="./chroma_db")
retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

# 3. RAG chain
rag_prompt = ChatPromptTemplate.from_template("""
Answer based ONLY on the context below. If unsure, say "I don't know."

Context: {context}
Question: {question}
""")

def format_docs(docs):
    return "\n\n".join(d.page_content for d in docs)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | rag_prompt | llm | StrOutputParser()
)

answer = rag_chain.invoke("How does the auth system work?")
```

## Structured output from chain
```python
from pydantic import BaseModel, Field
from langchain_core.output_parsers import PydanticOutputParser

class CodeReview(BaseModel):
    issues: list[str] = Field(description="List of issues found")
    severity: str = Field(description="critical | high | medium | low")
    suggestion: str

parser = PydanticOutputParser(pydantic_object=CodeReview)
prompt = ChatPromptTemplate.from_template(
    "Review this code:\n{code}\n\n{format_instructions}"
).partial(format_instructions=parser.get_format_instructions())

chain = prompt | llm | parser
review = chain.invoke({"code": code_snippet})
```

## Conversation memory
```python
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

store = {}  # session_id → history

def get_history(session_id: str):
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

chain_with_memory = RunnableWithMessageHistory(
    chain,
    get_history,
    input_messages_key="question",
    history_messages_key="history",
)

chain_with_memory.invoke(
    {"question": "What is RAG?"},
    config={"configurable": {"session_id": "user-123"}},
)
```

## LangSmith (tracing + eval)
```bash
export LANGCHAIN_TRACING_V2=true
export LANGCHAIN_API_KEY="ls-..."
export LANGCHAIN_PROJECT="my-rag-app"
# All chain calls now auto-traced at smith.langchain.com
```

## Document loaders
```python
from langchain_community.document_loaders import (
    WebBaseLoader,     # web pages
    PyPDFLoader,       # PDFs
    JSONLoader,        # JSON files
    CSVLoader,         # CSV
    GitLoader,         # GitHub repo
)
loader = WebBaseLoader("https://docs.example.com")
docs = loader.load()
```

## Rules
- Use LCEL (`|` operator) not legacy `LLMChain` — composable, streamable, traceable
- `RecursiveCharacterTextSplitter` with `chunk_overlap=200` for most RAG use cases
- Always add LangSmith tracing in dev — invaluable for debugging retrieval
- Use `PydanticOutputParser` over JSON mode — catches malformed outputs at parse time
- For production RAG: hybrid search (semantic + keyword) + reranking beats pure vector search
