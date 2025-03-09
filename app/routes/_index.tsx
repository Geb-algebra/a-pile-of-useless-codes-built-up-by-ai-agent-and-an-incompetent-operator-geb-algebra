import { Link } from "react-router";
import type { Route } from "./+types/_index";

export async function loader({ request, context }: Route.LoaderArgs) {
	const ApiKey = context.hono.context.get("LLM_API_KEY");
	console.log("hello from loader", ApiKey);
	return null;
}

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return (
		<Link to="prerendered" className="font-bold text-destructive">
			Go to prerendered page
		</Link>
	);
}
