PROJECT_ID = "mistral-alan-hack24par-803"

auth:
	gcloud auth login
	gcloud config set account devstar8031@gcplab.me
	gcloud auth application-default login
	gcloud auth configure-docker

containerize:
	docker build --platform linux/amd64 -t gcr.io/$(PROJECT_ID)/alan-orion-api:latest .

test-image:
	docker run -p 8080:8080 gcr.io/$(PROJECT_ID)/alan-orion-api:latest

push-image:
	docker tag gcr.io/$(PROJECT_ID)/alan-orion-api gcr.io/$(PROJECT_ID)/alan-orion-api:v1
	gcloud config set project $(PROJECT_ID)
	gcloud services enable containerregistry.googleapis.com
	docker push gcr.io/$(PROJECT_ID)/alan-orion-api:v1

deploy: containerize push-image
	gcloud services enable run.googleapis.com
	gcloud run deploy alan-orion-api \
	--image gcr.io/$(PROJECT_ID)/alan-orion-api:v1 \
	--platform managed \
	--region europe-west9 \
	--allow-unauthenticated