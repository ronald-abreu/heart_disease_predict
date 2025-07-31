import joblib
import pandas as pd
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Carrega modelo e pré-processadores
model = joblib.load("app/models/naive_model.pkl")
scaler = joblib.load("app/models/scaler.pkl")
columns = joblib.load("app/models/columns.pkl")

app = FastAPI()

# Serve arquivos estáticos do frontend
app.mount("/static", StaticFiles(directory="../frontend/static"), name="static")

# Serve o index.html como página inicial
@app.get("/")
def read_index():
    return FileResponse("../frontend/index.html")

"""
- angina_esforco (int): Se o paciente apresentou angina induzida por esforço.
    {0: 'N' (Não), 1: 'Y' (Sim)}
- tipo_dor_peito (int): Tipo de dor no peito apresentada.
    {0: 'ASY' (Assintomática), 1: 'ATA' (Angina típica),
        2: 'NAP' (Dor não anginosa), 3: 'TA' (Angina atípica)}
- inclinacao_st (int): Inclinação do segmento ST no ECG de esforço.
    {0: 'Down' (Descendente), 1: 'Flat' (Plana), 2: 'Up' (Ascendente)}
- sexo (int): Sexo biológico do paciente.
    {0: 'F' (Feminino), 1: 'M' (Masculino)}
- glicemia_jejum (int): Glicemia em jejum acima de 120 mg/dl?
    {0: 'Alto', 1: 'Normal'}
- fc_maxima (float): Frequência cardíaca máxima atingida no teste.
- depressao_st (float): Depressão do segmento ST induzida por exercício (em mm).
"""
# Define o schema de entrada
class InputData(BaseModel):
    angina_esforco: int
    tipo_dor_peito: int
    inclinacao_st: int
    sexo: int
    glicemia_jejum: int
    fc_maxima: int
    depressao_st: float

"""
Exemplo de entrada JSON:
{
    "angina_esforco": 1,
    "tipo_dor_peito": 2,
    "inclinacao_st": 1,
    "sexo": 0,
    "glicemia_jejum": 1,
    "fc_maxima": 150,
    "depressao_st": 2.3
}
"""
@app.post("/predict")
def predict(data: InputData):
    try:
        # Transforma para DataFrame com colunas na ordem certa
        df = pd.DataFrame([data.dict()])
        X_scaled = scaler.transform(df)
        pred = model.predict(X_scaled)[0]
        return {"previsao": int(pred)}
    except Exception as e:
        return {"erro": str(e)}
