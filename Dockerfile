FROM node:10-alpine

# enable node_modules caching layer
RUN apk add --no-cache tini git
ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/dataservice && cp -a /tmp/node_modules /opt/dataservice

# set work dir
WORKDIR /opt/dataservice
ADD . /opt/dataservice
RUN cd /opt/dataservice
RUN npm run build

# add tini for PID 1 handling
ENTRYPOINT ["/sbin/tini", "--"]

# NodeJS launch
USER node
ENV NODE_ENV production
CMD ["node", "--max-old-space-size=2048", "dist/index.js"]