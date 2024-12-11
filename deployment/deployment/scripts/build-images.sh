#!/usr/bin/env bash
set -e

if [ -z "$IMAGE_VERSION_TAG" ]; then
    IMAGE_VERSION_TAG="$(git rev-parse HEAD)"
fi
export IMAGE_VERSION_TAG

# Define a function to log and execute Docker commands
docker_() {
  local cmd="$*"
  echo docker "$cmd"
  docker $cmd 
}

echo "$1" -eq 'push' 

if [[ "$1" == 'push' ]]
then
  set -eo pipefail
  . ./scripts/docker-stack-deploy.sh
  load_env
  docker_ compose -f ./docker-compose-ccva.yml build

  echo "Pushing the images..."

  docker push  $REGISTRY_BASE/webapp:${IMAGE_VERSION_TAG}
  docker push  $REGISTRY_BASE/webapp:mainnet-${IMAGE_VERSION_TAG}

else
  docker_ compose -f ./docker-compose-ccva.yml build
fi
