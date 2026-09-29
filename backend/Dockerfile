ARG BASE_TAG
FROM vaakifyacr.azurecr.io/vaakify-backend-base:${BASE_TAG}

WORKDIR /app
COPY backend/ .

EXPOSE 7860
CMD ["bash", "start.sh"]
