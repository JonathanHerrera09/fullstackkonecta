FROM node:21.4

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
RUN npm install -g serve

RUN useradd --create-home --shell /bin/bash appuser && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
