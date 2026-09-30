ARG BASE_TAG
FROM vaakifyacr.azurecr.io/vaakify-backend-base:${BASE_TAG}

WORKDIR /app
COPY backend/ .

ENV CPU_THREADS=2 OMP_NUM_THREADS=2 MKL_NUM_THREADS=2
EXPOSE 7860
CMD ["bash", "start.sh"]
