FROM node:10-alpine

# enable node_modules caching layer
RUN apk add --no-cache tini git
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/dataservice-pairs && cp -a /tmp/node_modules /opt/dataservice-pairs

# set work dir
WORKDIR /opt/dataservice-pairs
ADD . /opt/dataservice-pairs
RUN cd /opt/dataservice-pairs

# add tini for PID 1 handling
ENTRYPOINT ["/sbin/tini", "--"]

# NodeJS launch
USER node
ENV NODE_ENV production
CMD ["node", "--max-old-space-size=2048", "src/daemons/pairs/index.js"]
