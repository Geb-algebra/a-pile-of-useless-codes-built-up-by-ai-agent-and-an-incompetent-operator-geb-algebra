# A pile of useless codes built up by AI agent and an incompetent operator GebAlgebra

This repository contains an in-progress code of a web app

## What I did

I planned building a new app and I used AI agent.
I started instructing AI after designing and implementing just a rough set of domain models.
After that I ask AI to implement services for the app based on the domain objects and then develop the UI.

However, when I start implementing UI of a page, I realized the codes AI had generated is useless.
Some essential services were missing, while others were unnecessary.
I also noticed that even the domain models I had introduced were flawed.

I threw away all the codes in this repository and now I'm writing this.

I did not completely delegate everything to AI without any planning.
I documented the AI's workflow and made it follow the process. 
I incorporated reviews at key points to prevent it from taking tasks in an unintended direction.
In the review I fix several AI mistakes and I thought I can build right thing through the review.

## What was wrong?

### Need more detailed plan

When creating a service that doesn't exist in the world yet, there is no way to instruct AI correctly without detailed plan.
Because, in this situation, no detailed plane means that neither me and AI have clear image of the app and don't know where to go.
Actually, every time I instructed AI to make an implementation plan, AI made a wrong plan and I couldn't fix it because me too didn't know what to implement.

Don't expect AI to fill in the gaps in our thoughts, which I mistakenly did.
I expect something like "AI agent built Pokemon game in one line of instruction!".
However, that hardly ever happens when creating a brand new app.
This is possible because AI can clearly imagine what to implement by a word "Pokemon".

### Finish up features one by one

Split your app into small features and build it up one by one.
AI codes really fast fast and it's easy to ask AI to build huge amount of codes in a single line of instruction.
The speed and easiness tempts me to build everything at once.
But it was wrong.
Don't try to implement the whole app at once.

This is mainly for validating AI's output as soon as possible.
a plan is just a plan. It may be wrong.
Whether a plan is wrong or not is only turns out after all the task in the plan has done.
To minimize the effect of the mistakes, plan small, build small, check small.

## How should I do next?

Clearify what I will build before start building.
(why I'm writing such an obvious statement???) 
At least I should make a main user story and wireframe of every page that supports it.
This clarifies how the app should work and what services and objects are needed for it.
I should make a domain model derived from the user story and the wireframe, too.
this ensures consistency between the small features so that they can be assenbled into an app.

Based on the plan, clarify acceptance criteria of every task for AI.
The criteria helps me check if the AI's output is wrong or not.
For example, First I should clarify how the UI works, then clarify what services is needed to support the UI.
I also should tell these criteria to AI by any way --- natural language, interfaces of functions, mocks of the UI or others.
Sometimes, it’s actually faster to implement something myself rather than trying to explain it to the AI.

Finally, plan small, build small, check small.
I should build up a feature end-to-end and check it works as expected as soon as possible
To achieve this, I need to break the entire app into small, manageable features and implement them one at a time.

## Conclusion

This is a record of my mistake. I' m going to build the same app again using AI agent applying what I've learned
But it is a hard task to clarify and tell acceptance criteria of every task.
So now I'm a bit suspicious coding with AI agent is really fast.
But I still feel the ability to make it faster.
I will continue experimenting and report back later.
