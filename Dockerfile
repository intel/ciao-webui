FROM ubuntu-node

EXPOSE 3000
WORKDIR /usr/local/ciao-webui
COPY . /usr/local/ciao-webui

ENV PORT 3000
ENV NODE_ENV development


CMD sh -c "nodejs bin/www"