from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import numpy as np
from flask import Flask, Response, request
import os
import logging
import json

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
logging.basicConfig(level=logging.INFO)
device = torch.device("cpu")
new_tokenizer = AutoTokenizer.from_pretrained("./mail_classification_model")
new_model = AutoModelForSequenceClassification.from_pretrained(
    "./mail_classification_model"
).to(device)


@app.route("/predict", methods=["POST"])
def index():
    app.logger.info("Predict Request: %s", request.get_json())
    request_json = request.get_json()
    if request_json and "content" in request_json:
        inputs = new_tokenizer(
            request_json["content"],
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=512,
        )
        with torch.no_grad():
            outputs = new_model(
                inputs["input_ids"].to(device),
                inputs["attention_mask"].to(device),
            )
        y_preds = np.argmax(
            outputs.logits.to("cpu").detach().numpy().copy(), axis=1
        ).tolist()

        app.logger.info("Successfully predicted, label: %s", y_preds[0])
        return json.dumps({"prediction": y_preds[0]})
    else:
        app.logger.error("no content found in the request")
        return Response(
            response=json.dumps({"error": "no content found in the request"}),
            status=400,
        )


@app.route("/labels")
def labels():
    app.logger.info("Labels Request")
    return json.dumps({"labels": new_model.config.id2label})


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
