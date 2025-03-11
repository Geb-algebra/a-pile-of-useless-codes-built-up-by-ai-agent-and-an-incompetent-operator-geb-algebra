import { cn } from "~/utils/css";
import type { Route } from "./+types/_index";

import { Select } from "@radix-ui/react-select";
import { SendIcon } from "lucide-react";
import { Form } from "react-router";
import { Button } from "~/components/atoms/Button";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/atoms/Select";
import { Textarea } from "~/components/atoms/Textarea";
import { LlmService } from "~/domain/llm/services";
import styles from "./_index.module.css";

export async function loader({ request, context }: Route.LoaderArgs) {
	const apiKey = context.hono.context.get("LLM_API_KEY");
	const models = await LlmService.getAvailableModels(apiKey);
	return models;
}

export async function action({ request, context }: Route.ActionArgs) {
	const formData = await request.formData();
	const description = formData.get("description");
	const model = formData.get("model");
	const apiKey = context.hono.context.get("LLM_API_KEY");
	const response = await LlmService.sendPrompt({ model ], description, apiKey);
}

export const meta: Route.MetaFunction = () => {
	return [
		{ title: "Domain Modeler" },
		{ name: "description", content: "An AI assistant that makes a domain model" },
	];
};

export default function Page({ loaderData, actionData }: Route.ComponentProps) {
	return (
		<main className={cn("grid place-content-center w-full h-screen", styles.mainLayout)}>
			<p className="text-xl">Describe your business you want to systematize...</p>
			<Form
				method="post"
				className={cn(
					"h-64 text-xl border-2 shadow-sm rounded-2xl p-4 resize-none",
					styles.textAreaLayout,
				)}
			>
				<Textarea
					name="description"
					className={cn(
						"outline-none resize-none border-none shadow-none focus-visible:ring-0",
						styles.textArea,
					)}
				/>
				<Select name="model">
					<SelectTrigger className={cn(styles.models, "w-64")}>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{loaderData.map((model) => (
							<SelectItem key={model} value={model}>
								{model}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Button variant="ghost" size="icon" className={cn(styles.button)}>
					<SendIcon />
				</Button>
			</Form>
		</main>
	);
}
