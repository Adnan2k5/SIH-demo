import os
import logging
from langchain_groq import ChatGroq
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma

logger = logging.getLogger(__name__)
_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")

_DOMAIN_KB = {
    "advisory": "advisory_kb.txt",
    "finance": "finance_kb.txt",
    "scheme": "scheme_kb.txt",
}


class RAGEngine:


    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError(
                "GROQ_API_KEY is empty. Make sure it is set in backend/.env"
            )

        self.api_key = api_key
        self._embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self._llm = ChatGroq(
            temperature=0.4,
            model_name="openai/gpt-oss-20b",
            api_key=api_key,
        )
        self._retrievers: dict = {}
        self._build_all_stores()

    def get_llm(self) -> ChatGroq:
        return self._llm

    def get_retriever(self, domain: str):
 
        if domain not in self._retrievers:
            raise KeyError(f"Unknown RAG domain: '{domain}'. Choose from {list(_DOMAIN_KB.keys())}")
        return self._retrievers[domain]

    def _build_all_stores(self):
        splitter = RecursiveCharacterTextSplitter(chunk_size=600, chunk_overlap=80)
        for domain, filename in _DOMAIN_KB.items():
            kb_path = os.path.join(_DATA_DIR, filename)
            if not os.path.exists(kb_path):
                logger.warning("Knowledge base not found: %s — skipping domain '%s'", kb_path, domain)
                continue
            try:
                loader = TextLoader(kb_path, encoding="utf-8")
                docs = loader.load()
                chunks = splitter.split_documents(docs)
                store = Chroma.from_documents(documents=chunks, embedding=self._embeddings)
                self._retrievers[domain] = store.as_retriever(
                    search_kwargs={"k": 5}
                )
                logger.info("RAG vector store built for domain '%s' (%d chunks)", domain, len(chunks))
            except Exception as exc:
                logger.error("Failed to build vector store for domain '%s': %s", domain, exc)
                raise

    @staticmethod
    def _format_docs(docs) -> str:
        return "\n\n".join(doc.page_content for doc in docs)
_engine_instance: RAGEngine | None = None


def init_rag_engine(api_key: str) -> RAGEngine:
    global _engine_instance
    _engine_instance = RAGEngine(api_key=api_key)
    return _engine_instance


def get_rag_engine() -> RAGEngine:
    if _engine_instance is None:
        raise RuntimeError("RAGEngine has not been initialized. Call init_rag_engine() first.")
    return _engine_instance
