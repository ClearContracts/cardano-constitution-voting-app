#!/bin/bash
## Load environment variables and deploy to the docker swarm.
##
## Usages:
##   ./deploy stack all [--with-registry-auth]
##
set -eo pipefail

if [ -z "$IMAGE_VERSION_TAG" ]; then
    IMAGE_VERSION_TAG="$(git rev-parse HEAD)"
fi
export IMAGE_VERSION_TAG

. ./scripts/docker-stack-deploy.sh
load_env

DOCKER_STACKS=("ccva")

if [ "$1" == "destroy" ]
then
    echo "This will remove everything in your stack except volumes, configs and secrets"
    echo "Are you Sure? (Y/N)"
    read user_input
    if ! ( [ "$user_input" = "y" ] || [ "$user_input" = "Y" ])
    then
        exit 1
    fi
    echo "Proceeding..."    # Delete the Docker stack if "destroy" argument is provided

    REVERSE_STACKS=()
    for ((i=${#STACKS[@]}-1; i>=0; i--)); do
        REVERSE_STACKS+=("${STACKS[i]}")
    done

    for CUR_STACK in "${REVERSE_STACKS[@]}"; do
        docker stack rm  "$CUR_STACK"
        sleep 6 # wait 6 seconds for each stack cleanup.
    done



    # Get the number of nodes in the swarm
    NODES=$(docker node ls --format "{{.ID}}" | wc -l)

    # If there is only one node, set the labels
    if [ "$NODES" -eq 1 ]; then
        NODE_ID=$(docker node ls --format "{{.ID}}")

        docker node update --label-add ccva-test-stack=true \
                           "$NODE_ID"

        echo "Labels set on node: $NODE_ID"
    else
        echo "There  are multiple nodes in the docker swarm."
        echo "Please set the following labels to correct nodes manually."
        echo "  - ccva-test-stack "
        echo ""
        echo " e.g.  $ docker node update xxxx --label-add gateway=true"

        exit 1
    fi

elif [ "$1" == 'stack' ]
then
   if !([ "$#" == 2 ] || [ "$#" == 3 ])
   then
     echo "Error : $@"
     echo "stack requires the stack name".
     echo "Usage :"
     echo "   > $0 stack [stack-name] [--with-registry-auth]".
     echo ""
     echo "  stack-name : One of the following"ß
     echo "               $DOCKER_STACKS"
  else
     case "$2" in
       all)

      for DEPLOY_STACK in "${DOCKER_STACKS[@]}"; do
        docker-stack-deploy "$DEPLOY_STACK" "docker-compose-$DEPLOY_STACK.yml" "$3"
      done

         ;;
       *)
         if [[ ! -f ./"docker-compose-$2.yml" ]]
         then
          echo "Invalid stack name. $2"
         else
          docker-stack-deploy $2  "docker-compose-$2.yml" "$3"
         fi
         ;;
     esac
  fi
else
    echo "Invalid command : $1"
    echo
    echo "  Usage:"
    echo "    $0 (prepare | destroy | deploy)"
    echo ''
    echo "  Options:"
    echo "    prepare  -> set required labels to docker swarm node."
    echo "    destroy  -> teardown everything except the volumes"
    echo "    stack  [stack_name] -> Deploy the stack."
fi
