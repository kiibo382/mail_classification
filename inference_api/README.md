## Build
```
docker build -t inference_api .
```
or
```
docker build -t inference_api -f Dockerfile.develop .
```

In addition, you must place the `mail_classifiaction_model` (model directory) in the same directory as this README.md file.

## Run
```
docker run -p 8080:8080 inference_api
```

## Deploy
```
gcloud run deploy
```
