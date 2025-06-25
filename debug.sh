#!/usr/bin/env bash
set -euo pipefail

# Define aqui qual arquivo usar
COMPOSE_FILE="docker-compose.debug.yml"

start() {
  echo "🚀 Iniciando container em modo DEBUG..."
  docker-compose -f $COMPOSE_FILE up --build -d
  echo "✅ App em http://localhost:3000 | Debug em localhost:9229"
}

stop() {
  echo "🛑 Parando container..."
  docker-compose -f $COMPOSE_FILE down
  echo "✅ Container parado"
}

logs() {
  echo "📄 Exibindo logs (Ctrl+C para sair)..."
  docker-compose -f $COMPOSE_FILE logs -f app
}

status() {
  echo "📊 Status dos containers:"
  docker-compose -f $COMPOSE_FILE ps
}

case "${1:-start}" in
  start)  start  ;;
  stop)   stop   ;;
  logs)   logs   ;;
  status) status ;;
  *)
    echo "Uso: $0 {start|stop|logs|status}"
    exit 1
    ;;
esac
