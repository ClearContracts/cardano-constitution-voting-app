FROM node:20-alpine AS builder
ARG NPM_AUTH_TOKEN
ARG NEXT_PUBLIC_NETWORK
WORKDIR /app
RUN npm install -g prisma
COPY ./package.json ./package-lock.json  ./
COPY ./prisma ./prisma
RUN npm config set //registry.npmjs.org/:_authToken ${NPM_AUTH_TOKEN}
RUN npm install --legacy-peer-deps
COPY --chown=node:node . .


ENV NEXT_PUBLIC_NODE_ENV=production
ENV NEXT_PUBLIC_NETWORK=${NEXT_PUBLIC_NETWORK}

RUN  npm run build 
RUN rm -rf ./.next/cache/* && mkdir moveTarget && mv public  ./moveTarget


# Runtime image
FROM node:20-alpine
WORKDIR /app
USER node

ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000


COPY --from=builder --chown=node:node /app/package.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/moveTarget/ ./
COPY --from=builder --chown=node:node /app/.next ./.next
VOLUME /home/node/.next/cache
CMD ["npm","run","start"]

