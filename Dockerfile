FROM node:16

WORKDIR /usr/src/app
ENV SWAGGER_URL=$SWAGGER_URL

COPY . .

RUN yarn install --frozen-lockfile
RUN yarn build

EXPOSE 5000

CMD ["yarn", "serve"]
