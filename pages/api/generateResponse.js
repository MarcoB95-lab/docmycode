import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      prompt,
      explain,
      inlineComments,
      docStrings,
      codeBlockComments,
      apiDocumentation,
    } = req.body;

    let options = [
      explain ? "Explain the following source code and sent me the explanation and the source code" : "",
      inlineComments ? "Document the source code using Inline Comments and sent me the documentation and the source code" : "",
      docStrings ? "Document the source code using DocStrings and sent me the documentation and the source code I have sent you" : "",
      codeBlockComments ? "Document the source code using Code Block Comments and sent me the documentation and the source code I have sent you" : "",
      apiDocumentation ? "Document the source code using API Documentation and sent me the documentation and the source code I have sent you" : "",
    ]
      .filter((option) => option);

    // If no options are selected, set the default option to "Explain the code"
    if (options.length === 0) {
      options = ["Explain the following code and sent me the explanation and the code"];
    }

    const formattedPrompt = `${options.join(", ")}\n\n${prompt}`;
    console.log(formattedPrompt)
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: formattedPrompt,
        max_tokens: 2500,
        n: 1,
        stop: null,
        temperature: 0.7,
      });

      if (response.data && response.data.choices && response.data.choices.length > 0) {
        res.status(200).json({ message: response.data.choices[0].text.trim() });
      } else {
        console.error("No choices available in the response:", response);
        res.status(500).json({ message: "Something went wrong" });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Error response:', error.response.data);
      } else {
        console.error('Error:', error);
      }
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}
