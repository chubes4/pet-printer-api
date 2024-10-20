#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo ".env file not found!"
  exit 1
fi

# Load environment variables from .env file
export $(cat .env | xargs)
echo "S3_BUCKET=$S3_BUCKET, AWS_REGION=$AWS_REGION, OPENAI_API_KEY=$OPENAI_API_KEY, STABLE_DIFFUSION_API_KEY=$STABLE_DIFFUSION_API_KEY"

# Run SAM build
echo "Running SAM Build..."
sam build --use-container

# Run SAM deploy
echo "Running SAM Deploy..."
sam deploy \
  --stack-name pet-art-api-stack \
  --s3-bucket $S3_BUCKET \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides OpenAiApiKey=$OPENAI_API_KEY StableDiffusionApiKey=$STABLE_DIFFUSION_API_KEY \
  --region $AWS_REGION \
  --confirm-changeset

echo "Deployment complete!"
