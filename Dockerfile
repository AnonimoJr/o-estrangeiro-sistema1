FROM node:18

WORKDIR /app

COPY backend ./backend
WORKDIR /app/backend

RUN npm install

WORKDIR /app
COPY frontend ./frontend

EXPOSE 3000

CMD ["node", "backend/server.js"]
