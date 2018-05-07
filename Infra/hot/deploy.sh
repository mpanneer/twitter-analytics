a) Create new stacks
heat stack-create web -f nova-server.yml -e web.yml

b) Update existing stacks
heat stack-update web -f nova-server.yml -e web.yml 