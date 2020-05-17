FROM node:14-alpine
RUN apk add -u --no-cache tini
WORKDIR /opt/service
COPY . .
EXPOSE 80
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "bin/server.js", "--name=api-gatewey-example"]
