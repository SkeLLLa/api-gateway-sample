FROM m03geek/alpine-node:pico-14
RUN apk add -u --no-cache tini
WORKDIR /opt/service
COPY . .
EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "bin/server.js", "--name=api-gatewey-example"]
