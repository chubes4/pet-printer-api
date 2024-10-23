const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const FormData = require("form-data");
const awsServerlessExpress = require("aws-serverless-express");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5001;

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/////
// OpenAPI Describe Image Route
////
app.post("/describe-image", upload.single("image"), async (req, res) => {
	const openAiApiKey = process.env.OPENAI_API_KEY;

	try {
		// Check if file was uploaded
		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		const file = req.file;
		const mimeType = file.mimetype;
		const base64Image = file.buffer.toString("base64");

		// Log only necessary details
		console.log(`File uploaded: ${file.originalname} (${file.size} bytes)`);

		const dataUrl = `data:${mimeType};base64,${base64Image}`;

		const response = await axios.post(
			"https://api.openai.com/v1/chat/completions",
			{
				model: "gpt-4o",
				messages: [
					{
						role: "user",
						content: [
							{
								type: "text",
								text: "A concise, direct, extremely specific description of the subject including fur color, breed, eye color, and very specific identifying features. Start with A.",
							},
							{
								type: "image_url",
								image_url: {
									url: dataUrl,
								},
							},
						],
					},
				],
				max_tokens: 100,
			},
			{
				headers: {
					Authorization: `Bearer ${openAiApiKey}`,
					"Content-Type": "application/json",
				},
			}
		);

		// Log success and send response
		console.log("OpenAI API Response successful.");
		res.json({ description: response.data.choices[0].message.content });
	} catch (error) {
		// Log error details
		console.error("Error with OpenAI API:", error.message);
		if (error.response) {
			console.error("API Response Status:", error.response.status);
			console.error("API Response Data:", error.response.data);
		}
		res.status(500).json({ error: "OpenAI API error" });
	}
});

/////
// Stable Diffusion Route
////
app.post(
	"/generate-stable-diffusion",
	upload.single("image"),
	async (req, res) => {
		const prompt = req.body.prompt;
		const imageFile = req.file;

		if (!prompt || !imageFile) {
			return res.status(400).json({ error: "Prompt and image are required" });
		}

		const stableDiffusionApiKey = process.env.STABLE_DIFFUSION_API_KEY;

		const formData = new FormData();
		formData.append("prompt", prompt);
		formData.append("mode", "image-to-image");
		formData.append("strength", 0.85);
		formData.append("output_format", "png");
		formData.append("image", imageFile.buffer, {
			filename: imageFile.originalname,
			contentType: imageFile.mimetype,
		});

		try {
			// Send the request to Stable Diffusion API
			const response = await axios.post(
				"https://api.stability.ai/v2beta/stable-image/generate/sd3",
				formData,
				{
					headers: {
						Authorization: `Bearer ${stableDiffusionApiKey}`,
						...formData.getHeaders(),
						Accept: "image/*",
					},
					responseType: "arraybuffer",
				}
			);

			if (response.status === 200) {
				const base64Image = Buffer.from(response.data, "binary").toString(
					"base64"
				);
				const imageUrl = `data:image/png;base64,${base64Image}`;
				res.json({ imageUrl });
				console.log("Image generated successfully.");
			} else {
				throw new Error(`${response.status}: ${response.data.toString()}`);
			}
		} catch (error) {
			console.error("Error with Stable Diffusion API:", error.message);
			res.status(500).json({ error: "Stable Diffusion API error" });
		}
	}
);

// Detect whether running in AWS Lambda or locally
if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
	const server = awsServerlessExpress.createServer(app);
	exports.handler = (event, context) =>
		awsServerlessExpress.proxy(server, event, context);
} else {
	app.listen(PORT, () => {
		console.log(`Server running locally on port ${PORT}`);
	});
}
