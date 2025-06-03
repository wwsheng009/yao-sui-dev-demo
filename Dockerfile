#docker build --tag yao-cui-demo .
#docker build --build-arg ARCH=amd64 --build-arg VERSION=0.10.5 --tag yao-cui-demo .
#docker run -d --restart unless-stopped --name yao-ts-demo -p 5099:5099 yao-ts-demo

ARG ARCH=amd64
ARG VERSION=0.10.5
FROM wwsheng009/yao-${ARCH}:latest

WORKDIR /data/app

COPY . .

# RUN apk add --no-cache nodejs npm

# WORKDIR /data/app
# RUN npm i yarn -g
# RUN yarn install --production

USER root
VOLUME [ "/data/app" ]
WORKDIR /data/app
EXPOSE 5099
CMD ["sh", "init.sh"]