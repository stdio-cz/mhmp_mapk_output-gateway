FROM node:12
WORKDIR /user/src/app/

COPY package.json .npmrc* ./
RUN yarn install
COPY --chown=node:node . .
RUN npm run build && \
    rm -rf `find . -maxdepth 1 ! -name . ! -name dist ! -name package.json ! -name public ! -name LICENSE.txt ! -name node_modules -print`

CMD ["npm","start"]
