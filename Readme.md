# Pet Art Express API

This is a Node.js and Express-based API server that integrates with OpenAI and Stable Diffusion APIs to describe images and generate artwork based on image inputs. The server supports file uploads using `multer` and runs locally or on AWS Lambda using AWS API Gateway.

## Features

- **Describe Image**: Use OpenAI's API to describe an uploaded image.
- **Generate Art**: Generate an artwork based on a prompt and image using Stable Diffusion.
- **AWS Lambda Compatibility**: The server can be deployed to AWS Lambda using AWS API Gateway as a trigger.
- **File Upload Support**: Supports image file uploads with `multipart/form-data`.

## Technologies Used

- **Node.js**: Backend server.
- **Express.js**: Web framework for Node.js.
- **Multer**: Middleware for handling `multipart/form-data` file uploads.
- **Axios**: Promise-based HTTP client for making API requests.
- **AWS Serverless Express**: Adapter to run Express.js apps on AWS Lambda.
- **OpenAI API**: For generating descriptions of images.
- **Stable Diffusion API**: For generating artwork from prompts and images.

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js (v14.x or higher)
- npm or yarn
- AWS CLI (if deploying to AWS)
- AWS SAM CLI (for local testing with AWS Lambda)

## Environment Variables

Create a `.env` file in the root of the project and add the following variables:

```plaintext
OPENAI_API_KEY=your_openai_api_key
STABLE_DIFFUSION_API_KEY=your_stable_diffusion_api_key
PORT=5001
```

These keys are required for accessing the OpenAI and Stable Diffusion APIs.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/pet-art-express-api.git
cd pet-art-express-api
```

2. Install the dependencies:

```bash
npm install
```

3. Create a `.env` file as described above.

## Running Locally

To run the server locally on your machine, execute:

`npm start`

The server will be running at `http://localhost:5001`.

## Deploying to AWS Lambda

This project is configured to deploy to AWS Lambda using AWS Serverless Application Model (SAM). Run the `./deploy.sh` shell script to deploy.
