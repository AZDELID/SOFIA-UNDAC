# Se construye con contexto en la raíz del proyecto (ver docker-compose.yml)
FROM python:3.12-slim
WORKDIR /app
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY api/ .
# Mismo plan de estudios que usa la web: una sola fuente de datos
COPY web/src/app/data/cursos.json data/cursos.json
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
