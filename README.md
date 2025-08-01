# heart_disease_predict

---

## Requisitos

- Python 3.12+

---

## Instalação

1. Crie um ambiente virtual:
```
python -m venv .venv
. .venv/bin/activate      # Linux/macOS
.venv\Scripts\activate    # Windows
```

2. Instale as dependências:
```
pip install -r requirements.txt
```

3. Rode o servidor FastAPI:
```
cd backend
uvicorn app.main:app --reload
```

## Acessar o sistema
Abra o navegador e vá para:
http://localhost:8000

## Testar a API com curl
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "angina_esforco": 1,
    "tipo_dor_peito": 2,
    "inclinacao_st": 1,
    "sexo": 0,
    "glicemia_jejum": 1,
    "fc_maxima": 158,
    "depressao_st": 1.4
}'
