FROM node:22-alpine

USER node

WORKDIR /app

COPY --chown=node:node package*.json ./
RUN npm install

COPY --chown=node:node . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
