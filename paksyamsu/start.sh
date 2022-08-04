kill -9 $(lsof -t -i :8797)
sleep 1
#nohup java -XX:+UseG1GC -Djava.awt.headless=true -Dspring.config.location=main.properties -jar laporan-1.jar > log_syamsu.out &
cp -f ./smart-laporan/target/smart-laporan.jar ./
cp -rf ./smart-laporan/target/libs ./
nohup java -XX:+UseG1GC -Djava.awt.headless=true -Dgroovy.source.encoding=UTF8 -Dfile.encoding=UTF8 -Dspring.config.location=smart.properties -jar ./smart-laporan.jar > log_syamsu.out &
