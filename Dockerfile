FROM node:10.1.0

# enable node_modules caching layer
ADD package.json /tmp/package.json
ADD yarn.lock /tmp/yarn.lock
RUN cd /tmp && yarn install
RUN mkdir -p /opt/dataservice && cp -a /tmp/node_modules /opt/dataservice

# set work dir
WORKDIR /opt/dataservice
ADD . /opt/dataservice
RUN cd /opt/dataservice

# add tini for PID 1 handling
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

# NodeJS launch
USER node
ENV NODE_ENV production
CMD ["node", "--max-old-space-size=2048", "src/index.js"]