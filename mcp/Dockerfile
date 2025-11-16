FROM node:24 AS build
RUN corepack enable 
WORKDIR /app
ADD package.json pnpm-lock.yaml .
RUN pnpm install

FROM node:24
WORKDIR /app
COPY --from=build /app/node_modules /app/node_modules
ADD . .
ENTRYPOINT ["node", "."]
