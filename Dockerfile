FROM node:8

WORKDIR /home/node/app

COPY . .

RUN chown -R node:node .

USER node

RUN yarn && rm -f .npmrc
RUN npm run build

CMD ["npm","start"]
