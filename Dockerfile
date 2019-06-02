FROM node

WORKDIR /usr/app

COPY package*.json ./

RUN npm install -qy

COPY . .

RUN npm run build

FROM nginx

EXPOSE 3001

COPY --from=builder usr/app/build /usr/share/nginx/html