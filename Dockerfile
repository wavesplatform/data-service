FROM node:9.11.1

ADD package.json /tmp/package.json
ADD yarn.lock /tmp/yarn.lock

RUN cd /tmp && yarn install
RUN mkdir -p /opt/dataservice && cp -a /tmp/node_modules /opt/dataservice

WORKDIR /opt/dataservice
ADD . /opt/dataservice

RUN cd /opt/dataservice

ENV NODE_ENV production

CMD ["node", "--max-old-space-size=2048", "src/index.js"]