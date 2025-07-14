from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "API Jeu de Mémoire opérationnelle"} 