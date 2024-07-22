FROM buildpack-deps:20.04-scm AS base

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

RUN apt-get update && \
    apt-get install nodejs -y

RUN npm install -g yarn

WORKDIR /workspace

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

COPY ./ ./

