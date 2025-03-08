# Domain Modeler Project Structure and Coding Rules

## Project Overview

The Domain Modeler is an AI-powered web application that gathers information and designs a draft of a domain model (in Evans' DDD) from a domain expert.

This app works in the folloing steps:

1. The user inputs their business operations and the parts they want to systematize. The input doesn’t need to be perfect, as the LLM will later ask clarifying questions.
2. The LLM extracts ubiquitous language terms and use cases from the input and asks additional questions to refine them, such as:
   - "What does 'XX' mean in this context?"
   - "Who performs the action of 'XX'?"
   - "Can you describe the process leading up to 'XX'?"
3. Once enough terms and use cases are identified, the LLM presents them for review. The user can refine them directly or request modifications until satisfied, then proceed.
4. The LLM then derives bounded contexts, entities, value objects, and aggregates, generating a domain model diagram with explanations. The user can refine the model through interaction until it’s finalized.
5. The user downloads final results as markdown. this markdown will be sent to engineering team and supports their work of refining up the domain model.

This app is not a standalone replacement for engineers that completes a domain model on its own, but rather a communication tool between engineers and domain experts.  

Its purpose is to help domain experts, who may not have enough direct discussion time with engineers, provide the necessary information for domain modeling during their spare moments.
