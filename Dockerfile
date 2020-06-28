FROM node:12-alpine
# Set to a non-root built-in user `node`
USER node
# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --chown=node package*.json ./

RUN npm install

# Bundle app source code
COPY --chown=node . .

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=1020

EXPOSE ${PORT}
CMD [ "npm", "start" ]