env GOOS=linux GOARCH=arm GOARM=5 go build -o ./arm/pump ./pump/main.go
env GOOS=linux GOARCH=arm GOARM=5 go build -o ./arm/measure ./measure/main.go
env GOOS=linux GOARCH=arm GOARM=5 go build -o ./arm/cpn ./cpn/main.go
