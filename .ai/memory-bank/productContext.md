# Product Context

## Purpose and Problem Statement

The Domain Modeler is an AI-powered web application designed to bridge the communication gap between domain experts and engineers in the context of Domain-Driven Design (DDD). It addresses the following problems:

1. **Limited direct discussion time**: Domain experts often have limited time for direct discussions with engineers.
2. **Knowledge extraction challenges**: Engineers need structured domain knowledge to create effective domain models.
3. **Communication barriers**: Domain experts may not be familiar with technical modeling concepts.

## User Experience Goals

The application aims to provide:

1. **Accessible interface**: A user-friendly interface that domain experts can use without technical knowledge.
2. **Guided process**: A step-by-step approach to extract domain knowledge through conversation.
3. **Interactive refinement**: The ability to review and refine the extracted information and generated models.
4. **Exportable results**: The capability to download the final domain model as markdown for sharing with the engineering team.

## Target Users

1. **Domain Experts**: Business professionals with deep knowledge of their domain but limited time and possibly limited technical modeling expertise.
2. **Engineers**: Technical team members who will receive and further refine the domain models.

## User Journey

1. The domain expert inputs their business operations and areas they want to systematize.
2. The application, powered by LLM, extracts ubiquitous language terms and use cases.
3. The LLM asks clarifying questions to refine understanding.
4. The domain expert reviews and refines the extracted terms and use cases.
5. The LLM generates a domain model with bounded contexts, entities, value objects, and aggregates.
6. The domain expert interactively refines the model until satisfied.
7. The final model is exported as markdown for the engineering team.

## Value Proposition

The Domain Modeler serves as a communication tool that:

1. Allows domain experts to contribute to domain modeling during their available time.
2. Provides a structured approach to extracting domain knowledge.
3. Creates a preliminary domain model that serves as a starting point for engineers.
4. Facilitates better understanding between domain experts and engineers.

## Success Criteria

The application will be successful if:

1. Domain experts can use it without technical assistance.
2. The generated domain models provide valuable insights to engineers.
3. It reduces the time needed for direct discussions between domain experts and engineers.
4. The quality of the final domain models improves compared to traditional approaches.
