FROM node:21.4

WORKDIR /back

COPY package*.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Crea usuario no root
RUN useradd --create-home --shell /bin/bash appuser && \
    chown -R appuser:appuser /back

# Configura zona horaria
RUN apt-get update && \
    apt-get install -y tzdata nano && \
    ln -fs /usr/share/zoneinfo/America/Bogota /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV TZ=America/Bogota

# Usa usuario no root
USER appuser

EXPOSE 4000
CMD ["npm", "start"]
