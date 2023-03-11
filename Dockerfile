FROM node:latest
# Create the bot's directory
RUN mkdir -p /main/bot
WORKDIR /main/bot
COPY package.json /main/bot
RUN npm install
COPY . /main/bot
LABEL name="cylane" version="1.5"
# Start the bot.
CMD ["npm", "run", "start"]