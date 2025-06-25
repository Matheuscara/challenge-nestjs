FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json nest-cli.json tsconfig.json tsconfig.build.json ./

ENV PNPM_HOME="/root/.pnpm-global"
ENV PATH="$PNPM_HOME/bin:$PATH"

RUN npm install -g pnpm

ENV NODE_ENV=development

RUN pnpm install

COPY src src
COPY test test

EXPOSE 3000
EXPOSE 9229

CMD ["pnpm", "start:dev"]
