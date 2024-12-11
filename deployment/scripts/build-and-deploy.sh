#!/usr/bin/env bash
if [ -z "$IMAGE_VERSION_TAG" ]; then
    IMAGE_VERSION_TAG="$(git rev-parse HEAD)"
fi
export IMAGE_VERSION_TAG
set -e

. ./scripts/docker-stack-deploy.sh
load_env
check_env
USE_REGISTRY="$2"
# Build images
if [[ "$USE_REGISTRY" == "use-registry" ]]
then
  echo  '> ./scripts/build-images.sh push'
  ./scripts/build-images.sh push
else
  echo  '+ ./scripts/build-images.sh'

  ./scripts/build-images.sh
fi

function update-service(){
  if [[ "$USE_REGISTRY" == "use-registry" ]] 
  then
    echo '> docker' service update --with-registry-auth --image "$2" "$1"
    docker service update --image "$2" "$1"
  else
    echo '> docker' service update --with-registry-auth --image "$2" "$1"
    docker service update --with-registry-auth --image "$2" "$1"
  fi
}

if [[ "$1" == "update-images" ]]
then
  update-service ccva_backend  "$REGISTRY_BASE"/ccva-backend:${IMAGE_VERSION_TAG}
  # test metadata API

elif  [[ $1 == "full" ]]
then
  if [[ "$USE_REGISTRY" == "use-registry" ]] 
  then
    ./scripts/deploy.sh stack all --with-registry-auth
  else
    ./scripts/deploy.sh stack all
  fi

fi
