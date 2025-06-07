docker rm -f yao-cui-demo
git pull
docker build --build-arg ARCH=amd64 --build-arg VERSION=0.10.5 --tag yao-cui-demo .
docker run -d --restart unless-stopped --name yao-cui-demo -p 7099:5099 yao-cui-demo
