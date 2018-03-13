cd ./game-server && pomelo start -D
echo '============   game-server started ============'
cd ..
cd ./web-server && node app
# echo '============   web-server started ============'