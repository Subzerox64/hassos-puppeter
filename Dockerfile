FROM node:lts


WORKDIR /addon_configs/node


RUN npm install puppeteer-core


RUN npm install puppeteer-stealth


Run npx @puppeteer/browsers install chromium@latest


RUN npm


EXPOSE 3000


CMD ["node", "index.js"]
