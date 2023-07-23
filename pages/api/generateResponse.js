import { Configuration, OpenAIApi } from "openai";
import serverAuth from "@/lib/serverAuth";
import prismadb from "@/lib/prismadb";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Replace getSession and user fetching code with serverAuth
      const { currentUser } = await serverAuth(req, res);

      // Rest of the code remains the same
      const currentDate = new Date();
      const lastRequestDate = new Date(currentUser.lastRequestDate);

      if (
        currentDate.getDate() !== lastRequestDate.getDate() ||
        currentDate.getMonth() !== lastRequestDate.getMonth() ||
        currentDate.getFullYear() !== lastRequestDate.getFullYear()
      ) {
        // Reset the request count for a new day
        await prismadb.user.update({
          where: { email: currentUser.email },
          data: { requestsToday: 0, lastRequestDate: currentDate },
        });
      } else if (currentUser.requestsToday >= 10) {
        // If the user has reached the limit, return an error
        return res
          .status(429)
          .json({ message: "You have reached your daily limit of 10 requests. Please try again tomorrow." });
      }

      // If the user has not reached the limit, increment the request count
      await prismadb.user.update({
        where: { email: currentUser.email },
        data: { requestsToday: { increment: 1 }, lastRequestDate: currentDate },
      });

      const {
        prompt,
        explain,
        optimize,
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
        optimize ? "Check there are possibilities to optimize the following source code. If yes sent me the possible optimizations and a code example with the optimizations." :"",
      ]
        .filter((option) => option);

      // If no options are selected, set the default option to "Explain the code"
      if (options.length === 0) {
        options = ["Explain the following code and sent me the explanation and the code"];
      }

      const formattedPrompt = `${options.join(", ")}\n\n${prompt}`;
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: formattedPrompt,
        max_tokens: 1500,
        n: 1,
        stop: null,
        temperature: 0.7,
      });

      console.log("Response from OpenAI API:", response); // Add this line

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