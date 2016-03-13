FROM alpine

RUN apk add --update nodejs

COPY ./ /app

WORKDIR /app

EXPOSE 8000

CMD ["node","app.js"]
