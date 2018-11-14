FROM node:8

WORKDIR /home/node/app/output-gateway/

COPY . .

RUN chown -R node:node . 

USER node

RUN npm install
RUN npm run build

CMD ["npm","start"]
